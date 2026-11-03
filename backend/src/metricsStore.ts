import { EventEmitter } from 'events';
import {
  ConnectionStatus,
  RoomInfo,
  KpiMetrics,
  TimeSeriesPoint,
  ChatItem,
  GiftItem,
  SocialItem,
  LeaderboardUser,
  DashboardSnapshot,
} from './types';
import { PetSanctuaryManager } from './petSanctuary';

interface RollingCountEvent {
  timestamp: number;
  count: number;
}

interface ActiveStreakState {
  previousRepeatCount: number;
  giftItemId: string;
}

export class MetricsStore extends EventEmitter {
  private status: ConnectionStatus = 'IDLE';
  private errorMessage?: string;
  private roomInfo: RoomInfo | null = null;
  private petSanctuary = new PetSanctuaryManager();

  private kpis: KpiMetrics = {
    viewerCount: 0,
    peakViewerCount: 0,
    totalLikes: 0,
    likesPerMinute: 0,
    totalComments: 0,
    commentsPerMinute: 0,
    totalDiamonds: 0,
    estimatedUsd: 0,
    totalGifts: 0,
    totalFollows: 0,
    totalShares: 0,
    totalJoins: 0,
    joinsPerMinute: 0,
  };

  private timeSeries: TimeSeriesPoint[] = [];
  private recentChats: ChatItem[] = [];
  private recentGifts: GiftItem[] = [];
  private recentSocials: SocialItem[] = [];

  private users = new Map<string, LeaderboardUser>();
  private activeStreaks = new Map<string, ActiveStreakState>();

  // Rolling timestamp tracking
  private likeEvents: RollingCountEvent[] = [];
  private commentEvents: number[] = [];
  private joinEvents: number[] = [];
  private diamondEvents: RollingCountEvent[] = [];

  private timeSeriesInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this.startTimeSeriesTicker();
  }

  public getPetSanctuary(): PetSanctuaryManager {
    return this.petSanctuary;
  }

  public setStatus(status: ConnectionStatus, errorMessage?: string) {
    this.status = status;
    this.errorMessage = errorMessage;
    if (status === 'IDLE' || status === 'ENDED' || status === 'ERROR') {
      this.activeStreaks.clear();
    }
  }

  public setRoomInfo(roomInfo: RoomInfo | null) {
    this.roomInfo = roomInfo;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public updateViewerCount(count: number) {
    this.kpis.viewerCount = Math.max(0, count);
    if (this.kpis.viewerCount > this.kpis.peakViewerCount) {
      this.kpis.peakViewerCount = this.kpis.viewerCount;
    }
  }

  public addLikes(
    count: number,
    totalLikeCount?: number,
    user?: { uniqueId?: string; nickname?: string; avatarUrl?: string }
  ) {
    const validCount = Math.max(1, count || 1);
    const now = Date.now();

    this.kpis.totalLikes += validCount;
    if (typeof totalLikeCount === 'number' && totalLikeCount > this.kpis.totalLikes) {
      this.kpis.totalLikes = totalLikeCount;
    }

    this.likeEvents.push({ timestamp: now, count: validCount });

    if (user?.uniqueId) {
      const u = this.getOrCreateUser(user.uniqueId, user.nickname, user.avatarUrl);
      u.likeCount += validCount;

      const petRes = this.petSanctuary.handleLike(
        { uniqueId: user.uniqueId, nickname: user.nickname, avatarUrl: user.avatarUrl },
        validCount
      );
      if (petRes.evolutionEvent) {
        this.emit('event:pet_evolve', petRes.evolutionEvent);
      }
    }
  }

  public addChat(data: {
    id?: string;
    uniqueId: string;
    nickname: string;
    avatarUrl?: string;
    comment: string;
    timestamp?: number;
    isQuestion?: boolean;
  }): ChatItem {
    const now = data.timestamp || Date.now();
    const isQuestion =
      data.isQuestion ??
      (data.comment.includes('?') ||
        /\b(sao|gia|giá|bao nhieu|bao nhiêu|dau|đâu|sao|the nao|thế nào|ko|khong|không)\b/i.test(data.comment));

    const chatItem: ChatItem = {
      id: data.id || `chat_${now}_${Math.random().toString(36).substring(2, 8)}`,
      uniqueId: data.uniqueId,
      nickname: data.nickname || data.uniqueId,
      avatarUrl:
        data.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || data.uniqueId)}&background=random`,
      comment: data.comment,
      timestamp: now,
      isQuestion,
    };

    this.recentChats.unshift(chatItem);
    if (this.recentChats.length > 100) {
      this.recentChats.pop();
    }

    this.kpis.totalComments++;
    this.commentEvents.push(now);

    const user = this.getOrCreateUser(data.uniqueId, data.nickname, chatItem.avatarUrl);
    user.commentCount++;

    // Pet Sanctuary
    const petRes = this.petSanctuary.handleChat(
      { uniqueId: data.uniqueId, nickname: data.nickname, avatarUrl: chatItem.avatarUrl },
      data.comment
    );
    if (petRes.evolutionEvent) {
      this.emit('event:pet_evolve', petRes.evolutionEvent);
    }

    return chatItem;
  }

  public addGift(data: {
    uniqueId: string;
    nickname: string;
    avatarUrl?: string;
    giftId: number;
    giftName: string;
    giftPictureUrl?: string;
    diamondCount: number;
    repeatCount?: number;
    repeatEnd?: boolean;
    giftType?: number;
    timestamp?: number;
  }): GiftItem {
    const now = data.timestamp || Date.now();
    const streakId = `${data.uniqueId}_${data.giftId}`;
    const diamondPerUnit = Math.max(0, data.diamondCount || 0);
    const incomingRepeat = data.repeatCount && data.repeatCount > 0 ? data.repeatCount : 1;
    const repeatEnd = Boolean(data.repeatEnd);
    const isStreakGift = data.giftType === 1 || incomingRepeat > 1 || !repeatEnd;

    const streakState = this.activeStreaks.get(streakId);
    const previousRepeat = streakState ? streakState.previousRepeatCount : 0;
    const deltaRepeat = Math.max(0, incomingRepeat - previousRepeat);

    if (deltaRepeat > 0) {
      const addedDiamonds = deltaRepeat * diamondPerUnit;
      this.kpis.totalDiamonds += addedDiamonds;
      this.kpis.totalGifts += deltaRepeat;
      this.diamondEvents.push({ timestamp: now, count: addedDiamonds });

      const user = this.getOrCreateUser(
        data.uniqueId,
        data.nickname,
        data.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || data.uniqueId)}&background=random`
      );
      user.totalDiamonds += addedDiamonds;
      user.giftCount += deltaRepeat;

      // Pet Sanctuary
      const petRes = this.petSanctuary.handleGift(
        { uniqueId: data.uniqueId, nickname: data.nickname, avatarUrl: data.avatarUrl },
        { giftName: data.giftName, diamondCount: diamondPerUnit, deltaRepeat }
      );
      if (petRes.evolutionEvent) {
        this.emit('event:pet_evolve', petRes.evolutionEvent);
      }
    }

    let giftItem: GiftItem | undefined;

    if (streakState && streakState.giftItemId) {
      giftItem = this.recentGifts.find((g) => g.id === streakState.giftItemId);
      if (giftItem) {
        giftItem.repeatCount = incomingRepeat;
        giftItem.totalDiamonds = incomingRepeat * diamondPerUnit;
        giftItem.repeatEnd = repeatEnd;
        giftItem.timestamp = now;
      }
    }

    if (!giftItem) {
      giftItem = {
        id: `gift_${now}_${Math.random().toString(36).substring(2, 8)}`,
        streakId,
        uniqueId: data.uniqueId,
        nickname: data.nickname || data.uniqueId,
        avatarUrl:
          data.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || data.uniqueId)}&background=random`,
        giftId: data.giftId,
        giftName: data.giftName || 'Gift',
        giftPictureUrl: data.giftPictureUrl || '',
        diamondCount: diamondPerUnit,
        repeatCount: incomingRepeat,
        totalDiamonds: incomingRepeat * diamondPerUnit,
        repeatEnd,
        timestamp: now,
      };

      this.recentGifts.unshift(giftItem);
      if (this.recentGifts.length > 50) {
        this.recentGifts.pop();
      }
    }

    if (repeatEnd || !isStreakGift) {
      this.activeStreaks.delete(streakId);
    } else {
      this.activeStreaks.set(streakId, {
        previousRepeatCount: incomingRepeat,
        giftItemId: giftItem.id,
      });
    }

    return giftItem;
  }

  public addSocial(data: {
    type: 'follow' | 'share' | 'join';
    uniqueId: string;
    nickname: string;
    avatarUrl?: string;
    timestamp?: number;
  }): SocialItem {
    const now = data.timestamp || Date.now();
    const socialItem: SocialItem = {
      id: `social_${now}_${Math.random().toString(36).substring(2, 8)}`,
      type: data.type,
      uniqueId: data.uniqueId,
      nickname: data.nickname || data.uniqueId,
      avatarUrl:
        data.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || data.uniqueId)}&background=random`,
      timestamp: now,
    };

    this.recentSocials.unshift(socialItem);
    if (this.recentSocials.length > 50) {
      this.recentSocials.pop();
    }

    if (data.type === 'join') {
      this.kpis.totalJoins++;
      this.joinEvents.push(now);
    } else if (data.type === 'follow') {
      this.kpis.totalFollows++;
    } else if (data.type === 'share') {
      this.kpis.totalShares++;
    }

    this.getOrCreateUser(data.uniqueId, data.nickname, socialItem.avatarUrl);

    // Pet Sanctuary
    const petRes = this.petSanctuary.handleSocial(
      { uniqueId: data.uniqueId, nickname: data.nickname, avatarUrl: socialItem.avatarUrl },
      data.type
    );
    if (petRes.evolutionEvent) {
      this.emit('event:pet_evolve', petRes.evolutionEvent);
    }

    return socialItem;
  }

  public reset() {
    this.status = 'IDLE';
    this.errorMessage = undefined;
    this.roomInfo = null;

    this.kpis = {
      viewerCount: 0,
      peakViewerCount: 0,
      totalLikes: 0,
      likesPerMinute: 0,
      totalComments: 0,
      commentsPerMinute: 0,
      totalDiamonds: 0,
      estimatedUsd: 0,
      totalGifts: 0,
      totalFollows: 0,
      totalShares: 0,
      totalJoins: 0,
      joinsPerMinute: 0,
    };

    this.timeSeries = [];
    this.recentChats = [];
    this.recentGifts = [];
    this.recentSocials = [];

    this.users.clear();
    this.activeStreaks.clear();
    this.petSanctuary.reset();

    this.likeEvents = [];
    this.commentEvents = [];
    this.joinEvents = [];
    this.diamondEvents = [];
  }

  public getSnapshot(): DashboardSnapshot {
    const now = Date.now();
    this.pruneOldEvents(now);

    const likes60s = this.likeEvents.reduce((acc, ev) => acc + ev.count, 0);
    const comments60s = this.commentEvents.length;
    const joins60s = this.joinEvents.length;

    this.kpis.likesPerMinute = likes60s;
    this.kpis.commentsPerMinute = comments60s;
    this.kpis.joinsPerMinute = joins60s;
    this.kpis.estimatedUsd = Math.round(this.kpis.totalDiamonds * 0.005 * 100) / 100;

    const topGifters = Array.from(this.users.values())
      .filter((u) => u.totalDiamonds > 0)
      .sort((a, b) => b.totalDiamonds - a.totalDiamonds)
      .slice(0, 10);

    const topChatters = Array.from(this.users.values())
      .filter((u) => u.commentCount > 0)
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 10);

    return {
      status: this.status,
      errorMessage: this.errorMessage,
      roomInfo: this.roomInfo ? { ...this.roomInfo } : null,
      kpis: { ...this.kpis },
      timeSeries: [...this.timeSeries],
      recentChats: [...this.recentChats],
      recentGifts: [...this.recentGifts],
      recentSocials: [...this.recentSocials],
      topGifters,
      topChatters,
      activePets: this.petSanctuary.getActivePets(24),
      totalPetsCount: this.petSanctuary.getTotalPetsCount(),
      recentEvolutions: this.petSanctuary.getRecentEvolutions(),
    };
  }

  private startTimeSeriesTicker() {
    this.timeSeriesInterval = setInterval(() => {
      if (this.status !== 'LIVE' && this.status !== 'SIMULATING') {
        return;
      }
      this.recordTimeSeriesPoint();
    }, 2000);

    if (this.timeSeriesInterval.unref) {
      this.timeSeriesInterval.unref();
    }
  }

  public destroy() {
    if (this.timeSeriesInterval) {
      clearInterval(this.timeSeriesInterval);
      this.timeSeriesInterval = undefined;
    }
  }

  private recordTimeSeriesPoint() {
    const now = Date.now();
    const tenSecAgo = now - 10000;

    const likes10s = this.likeEvents
      .filter((e) => e.timestamp >= tenSecAgo)
      .reduce((sum, e) => sum + e.count, 0);

    const comments10s = this.commentEvents.filter((t) => t >= tenSecAgo).length;
    const joins10s = this.joinEvents.filter((t) => t >= tenSecAgo).length;
    const diamonds10s = this.diamondEvents
      .filter((e) => e.timestamp >= tenSecAgo)
      .reduce((sum, e) => sum + e.count, 0);

    const date = new Date(now);
    const timeLabel = date.toTimeString().split(' ')[0]; // HH:mm:ss

    const point: TimeSeriesPoint = {
      timestamp: now,
      timeLabel,
      viewerCount: this.kpis.viewerCount,
      commentsPer10s: comments10s,
      likesPer10s: likes10s,
      joinsPer10s: joins10s,
      diamondsPer10s: diamonds10s,
    };

    this.timeSeries.push(point);
    if (this.timeSeries.length > 60) {
      this.timeSeries.shift();
    }
  }

  private pruneOldEvents(now: number) {
    const cutoff = now - 65000;
    this.likeEvents = this.likeEvents.filter((e) => e.timestamp >= cutoff);
    this.commentEvents = this.commentEvents.filter((t) => t >= cutoff);
    this.joinEvents = this.joinEvents.filter((t) => t >= cutoff);
    this.diamondEvents = this.diamondEvents.filter((e) => e.timestamp >= cutoff);
  }

  public getOrCreateUser(uniqueId: string, nickname?: string, avatarUrl?: string): LeaderboardUser {
    let user = this.users.get(uniqueId);
    if (!user) {
      user = {
        uniqueId,
        nickname: nickname || uniqueId,
        avatarUrl:
          avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname || uniqueId)}&background=random`,
        totalDiamonds: 0,
        giftCount: 0,
        commentCount: 0,
        likeCount: 0,
      };
      this.users.set(uniqueId, user);
    } else {
      if (nickname && user.nickname !== nickname) {
        user.nickname = nickname;
      }
      if (avatarUrl && (!user.avatarUrl || user.avatarUrl.includes('ui-avatars.com'))) {
        user.avatarUrl = avatarUrl;
      }
    }
    return user;
  }
}
