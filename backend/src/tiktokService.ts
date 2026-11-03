import { EventEmitter } from 'events';
import { MetricsStore } from './metricsStore';
import { ConnectPayload, RoomInfo } from './types';

// Fallback user and gift simulation data
const MOCK_USERS = [
  { uniqueId: 'nguyen_van_a', nickname: 'Anh Tuấn', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop' },
  { uniqueId: 'mai_phuong99', nickname: 'Phương Mai 🌸', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop' },
  { uniqueId: 'hoang_long_vip', nickname: 'Hoàng Long Luxury 💎', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop' },
  { uniqueId: 'lan_anh_cute', nickname: 'Lan Anh (Mẹ Bỉm)', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop' },
  { uniqueId: 'tran_minh_tri', nickname: 'Trí Trần Tech', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop' },
  { uniqueId: 'thuy_tien_beauty', nickname: 'Tiên Tiên Skincare', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop' },
  { uniqueId: 'shark_hung_tiktok', nickname: 'Hưng Đại Ca 🐉', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop' },
  { uniqueId: 'quynh_nga_order', nickname: 'Quỳnh Nga săn sale', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop' },
  { uniqueId: 'alex_kim_sg', nickname: 'Alex Kim', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop' },
  { uniqueId: 'tram_anh_boutique', nickname: 'Trâm Anh Fashion', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop' },
  { uniqueId: 'bao_ngoc_96', nickname: 'Bảo Ngọc', avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop' },
  { uniqueId: 'duc_thang_vlogs', nickname: 'Thắng Vlogs', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop' },
];

const MOCK_COMMENTS = [
  'Sp số 2 giá sao shop?',
  'Chốt đơn ạ 🛍️',
  'Đỉnh quá idol ơi 🔥🔥',
  'Có mã freeship extra không shop?',
  'Mẫu đang mặc cao 1m6 mặc size gì vừa ạ?',
  'Áo màu đen còn size L không ạ?',
  'Đã thả tim mỏi tay cho shop rồi nè ❤️❤️❤️',
  'Combo này hời thật sự luôn!',
  'Shop tư vấn nhiệt tình ghê!',
  'Hàng nhận được đẹp lắm nha, ủng hộ shop tiếp!',
  'Mấy hôm trước mua 250k nay sale còn 180k hời quá 😭',
  'Ghim lại link sản phẩm 1 giùm em với shop ơi',
  'Ship về Cần Thơ mấy ngày tới shop?',
  'Chào mọi người trong live nha!',
  'Cảm ơn shop đã tặng voucher nha 😍',
  'Chốt 2 áo 1 quần nha idol!',
  'Mọi người share live nhận quà kìa mn ơi',
  'Idol hát 1 bài đi ạ 🎤',
  'Chất vải co giãn tốt không bạn?',
  'Đã đặt 2 đơn rồi ạ!',
];

const MOCK_GIFTS = [
  { giftId: 5655, giftName: 'Rose', diamondCount: 1, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/66b043ce6c32104374c4314c1eb252d6.png~tplv-obj.png' },
  { giftId: 5882, giftName: 'TikTok', diamondCount: 1, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/26d5f7bc74d82b4dc2230198f121d550.png~tplv-obj.png' },
  { giftId: 6064, giftName: 'Finger Heart', diamondCount: 5, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/8f2c34cb80fb359a674ba41c7b824343.png~tplv-obj.png' },
  { giftId: 5879, giftName: 'Doughnut', diamondCount: 30, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/f3b26ecf130b134d19b788a18357a701.png~tplv-obj.png' },
  { giftId: 5658, giftName: 'Corgi', diamondCount: 299, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/6ea5779c6d3df392cb91b17b07f4d2f0.png~tplv-obj.png' },
  { giftId: 5937, giftName: 'Money Gun', diamondCount: 500, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/03d6d0ae5da9e4e2a1e640ad7a04e578.png~tplv-obj.png' },
  { giftId: 6104, giftName: 'Leon the Kitten', diamondCount: 4888, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/3ae0385fcbb0ef10d9be4cbcf4c2c54c.png~tplv-obj.png' },
  { giftId: 5699, giftName: 'TikTok Universe', diamondCount: 34999, giftPictureUrl: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/resource/35532ce55b89c704ca9f7efd116346b9.png~tplv-obj.png' },
];

export class TikTokService extends EventEmitter {
  private store: MetricsStore;
  private connection: any = null;
  private simulationIntervals: NodeJS.Timeout[] = [];
  private currentViewerCount: number = 0;
  private activeSimStreaks: Map<string, { repeat: number; maxRepeat: number; gift: typeof MOCK_GIFTS[0]; user: typeof MOCK_USERS[0] }> = new Map();
  private seenMsgIds: Set<string> = new Set();

  constructor(store: MetricsStore) {
    super();
    this.store = store;
    this.store.on('event:pet_evolve', (evolutionEvent) => {
      this.emit('event:pet_evolve', evolutionEvent);
    });
  }

  private isDuplicateMsg(data: any): boolean {
    const msgId = data?.common?.msgId || data?.msgId;
    if (!msgId) return false;
    const key = String(msgId);
    if (this.seenMsgIds.has(key)) return true;
    this.seenMsgIds.add(key);
    if (this.seenMsgIds.size > 3000) {
      const first = this.seenMsgIds.values().next().value;
      if (first) this.seenMsgIds.delete(first);
    }
    return false;
  }

  public async connect(payload: ConnectPayload): Promise<void> {
    this.disconnect();
    this.store.setStatus('CONNECTING');

    const cleanUniqueId = payload.uniqueId.replace(/^@/, '').trim();
    if (!cleanUniqueId) {
      this.store.setStatus('ERROR', 'Invalid uniqueId');
      throw new Error('Invalid uniqueId');
    }

    try {
      // Use TikTokLiveConnection (v2 native client - avoids legacy data-converter bug on WebcastRoomUserSeqMessage)
      const tiktokLiveModule = await import('tiktok-live-connector');
      const ConnectionConstructor =
        (tiktokLiveModule as any).TikTokLiveConnection ||
        (tiktokLiveModule as any).default?.TikTokLiveConnection ||
        (tiktokLiveModule as any).WebcastPushConnection ||
        (tiktokLiveModule as any).default?.WebcastPushConnection ||
        (tiktokLiveModule as any).default;

      if (!ConnectionConstructor) {
        throw new Error('Failed to resolve TikTok connection class from tiktok-live-connector');
      }

      const connectionOptions: any = {
        processInitialData: true,
        fetchRoomInfoOnConnect: true,
        enableExtendedGiftInfo: false,
      };

      if (payload.eulerApiKey) {
        connectionOptions.signApiKey = payload.eulerApiKey;
      }

      if (payload.sessionId) {
        connectionOptions.sessionId = payload.sessionId;
        connectionOptions.session = {
          type: 'cookie',
          value: {
            sessionId: payload.sessionId,
            ttTargetIdc: 'useast2a',
          },
        };
      }

      this.connection = new ConnectionConstructor(cleanUniqueId, connectionOptions);

      // Listen to events
      this.connection.on('chat', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId || 'viewer';
        const nickname = data.nickname || data.user?.nickname || uniqueId;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0] ||
          data.user?.avatarThumb?.url_list?.[0];
        const comment = data.comment || data.content || '';

        const chatItem = this.store.addChat({
          uniqueId,
          nickname,
          avatarUrl,
          comment,
          timestamp: Date.now(),
        });
        this.emit('event:chat', chatItem);
      });

      this.connection.on('gift', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId || 'gifter';
        const nickname = data.nickname || data.user?.nickname || uniqueId;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0] ||
          data.user?.avatarThumb?.url_list?.[0];
        const giftId = Number(data.giftId || data.gift?.gift_id || 0);
        const giftName =
          data.giftName ||
          data.giftDetails?.giftName ||
          data.extendedGiftInfo?.name ||
          data.gift?.name ||
          `Gift #${giftId}`;
        const giftPictureUrl =
          data.giftPictureUrl ||
          data.giftDetails?.giftImage?.url?.[0] ||
          data.giftDetails?.giftImage?.urlList?.[0] ||
          data.giftDetails?.giftImage?.url_list?.[0] ||
          data.extendedGiftInfo?.image?.url_list?.[0] ||
          data.gift?.image?.url_list?.[0] ||
          '';
        const diamondCount = Number(
          data.diamondCount ??
            data.giftDetails?.diamondCount ??
            data.extendedGiftInfo?.diamond_count ??
            0
        );
        const repeatCount = Number(data.repeatCount || 1);
        const repeatEnd = Boolean(data.repeatEnd);
        const giftType = Number(data.giftType ?? data.giftDetails?.giftType ?? 1);

        const giftItem = this.store.addGift({
          uniqueId,
          nickname,
          avatarUrl,
          giftId,
          giftName,
          giftPictureUrl,
          diamondCount,
          repeatCount,
          repeatEnd,
          giftType,
          timestamp: Date.now(),
        });
        this.emit('event:gift', giftItem);
      });

      this.connection.on('like', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const count = Number(data.likeCount || data.count || 1);
        const rawTotal = data.totalLikeCount ?? data.total;
        const totalLikeCount = rawTotal !== undefined ? Number(rawTotal) : undefined;
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId;
        const nickname = data.nickname || data.user?.nickname;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0];

        this.store.addLikes(count, totalLikeCount, uniqueId ? { uniqueId, nickname, avatarUrl } : undefined);
      });

      this.connection.on('roomUser', (data: any) => {
        const viewerCount = Number(data.viewerCount ?? data.viewer_count ?? data.total ?? 0);
        if (viewerCount > 0) {
          this.store.updateViewerCount(viewerCount);
        }
      });

      this.connection.on('member', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId || 'viewer';
        const nickname = data.nickname || data.user?.nickname || uniqueId;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0];

        const socialItem = this.store.addSocial({
          type: 'join',
          uniqueId,
          nickname,
          avatarUrl,
          timestamp: Date.now(),
        });
        this.emit('event:social', socialItem);
      });

      this.connection.on('social', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const displayType = String(data.displayType || data.common?.displayText?.key || data.label || '').toLowerCase();
        const type: 'follow' | 'share' = displayType.includes('share') ? 'share' : 'follow';
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId || 'supporter';
        const nickname = data.nickname || data.user?.nickname || uniqueId;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0];

        const socialItem = this.store.addSocial({
          type,
          uniqueId,
          nickname,
          avatarUrl,
          timestamp: Date.now(),
        });
        this.emit('event:social', socialItem);
      });

      this.connection.on('follow', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId || 'supporter';
        const nickname = data.nickname || data.user?.nickname || uniqueId;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0];

        const socialItem = this.store.addSocial({
          type: 'follow',
          uniqueId,
          nickname,
          avatarUrl,
          timestamp: Date.now(),
        });
        this.emit('event:social', socialItem);
      });

      this.connection.on('share', (data: any) => {
        if (this.isDuplicateMsg(data)) return;
        const uniqueId = data.uniqueId || data.user?.uniqueId || data.user?.displayId || 'supporter';
        const nickname = data.nickname || data.user?.nickname || uniqueId;
        const avatarUrl =
          data.profilePictureUrl ||
          data.user?.profilePictureUrl ||
          data.user?.avatarLarge?.urlList?.[0] ||
          data.user?.avatarThumb?.urlList?.[0];

        const socialItem = this.store.addSocial({
          type: 'share',
          uniqueId,
          nickname,
          avatarUrl,
          timestamp: Date.now(),
        });
        this.emit('event:social', socialItem);
      });

      this.connection.on('streamEnd', () => {
        this.store.setStatus('ENDED');
        this.emit('stream:status', 'ENDED');
      });

      this.connection.on('disconnected', () => {
        if (this.store.getStatus() === 'LIVE') {
          this.store.setStatus('ENDED');
          this.emit('stream:status', 'ENDED');
        }
      });

      this.connection.on('error', (err: any) => {
        const errMsg = err?.exception?.message || err?.message || err?.info || String(err);
        console.warn('TikTok connection warning/error:', errMsg);
        if (this.store.getStatus() !== 'LIVE') {
          this.store.setStatus('ERROR', errMsg);
          this.emit('stream:status', 'ERROR', errMsg);
        }
      });

      const state = await this.connection.connect();

      // Extract room info
      const rawInfo = this.connection?.roomInfo?.data || this.connection?.roomInfo || state?.roomInfo?.data || state?.roomInfo || {};
      const owner = rawInfo.owner || {};
      const initialViewers = Number(rawInfo.user_count || rawInfo.stats?.total_user || 0);
      if (initialViewers > 0) {
        this.store.updateViewerCount(initialViewers);
      }
      const initialLikes = Number(rawInfo.like_count || rawInfo.stats?.like_count || 0);
      if (initialLikes > 0) {
        this.store.addLikes(0, initialLikes);
      }

      const roomInfo: RoomInfo = {
        roomId: String(rawInfo.id_str || rawInfo.id || state?.roomId || this.connection?.roomId || Date.now()),
        uniqueId: owner.display_id || cleanUniqueId,
        nickname: owner.nickname || cleanUniqueId,
        avatarUrl:
          owner.avatar_thumb?.url_list?.[0] ||
          owner.avatar_large?.url_list?.[0] ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanUniqueId)}&background=random`,
        title: rawInfo.title || `${cleanUniqueId}'s LIVE Stream`,
        startTime: rawInfo.create_time ? rawInfo.create_time * 1000 : Date.now(),
      };

      this.store.setRoomInfo(roomInfo);
      this.store.setStatus('LIVE');
      this.emit('stream:status', 'LIVE');

      // Seed top fans if present
      const topFans = rawInfo.top_fans || state?.top_fans || [];
      if (Array.isArray(topFans) && topFans.length > 0) {
        const sanctuary = this.store.getPetSanctuary();
        topFans.forEach((fan: any, idx: number) => {
          const fanUser = fan.user || fan;
          const uid = fanUser.display_id || fanUser.unique_id || fanUser.uniqueId || `fan_${idx + 1}`;
          const name = fanUser.nickname || uid;
          const avatar = fanUser.avatar_thumb?.url_list?.[0] || fanUser.avatar_large?.url_list?.[0];
          const diamonds = Number(fan.fan_ticket || fan.coins || fan.diamond_count || fan.diamonds || 0);

          let fanLevel = 1;
          if (diamonds >= 30000) fanLevel = 20;
          else if (diamonds >= 15000) fanLevel = 15;
          else if (diamonds >= 6000) fanLevel = 10;
          else if (diamonds >= 2000) fanLevel = 6;
          else if (diamonds >= 500) fanLevel = 3;
          else if (diamonds > 0) fanLevel = 2;

          const u = this.store.getOrCreateUser(uid, name, avatar);
          u.totalDiamonds = Math.max(u.totalDiamonds, diamonds);

          sanctuary.seedPet({
            uniqueId: uid,
            nickname: name,
            avatarUrl: avatar,
            level: fanLevel,
            totalDiamonds: diamonds,
          });
        });
      }
    } catch (err: any) {
      console.error('Failed to connect to TikTok LIVE:', err);
      const errMsg = err?.exception?.message || err?.message || 'Connection failed';
      this.store.setStatus('ERROR', errMsg);
      this.emit('stream:status', 'ERROR', errMsg);
      throw err;
    }
  }

  public startSimulation(uniqueId?: string): void {
    this.disconnect();
    this.store.reset();

    const targetId = uniqueId ? uniqueId.replace(/^@/, '').trim() : 'linh.official.store';
    const roomInfo: RoomInfo = {
      roomId: '7392819382910283921',
      uniqueId: targetId,
      nickname: 'Linh Official Store 🛍️',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      title: 'SIÊU SALE LIVE ĐẦU THÁNG 🔥 XẢ KHO TỚI 70% + QUÀ TẶNG KHỦNG 🎁',
      startTime: Date.now() - 12 * 60 * 1000,
    };

    this.store.setRoomInfo(roomInfo);
    this.store.setStatus('SIMULATING');
    this.emit('stream:status', 'SIMULATING');

    this.currentViewerCount = 1850;
    this.store.updateViewerCount(this.currentViewerCount);

    // Seed pet sanctuary with starter pets of various species & levels
    const sanctuary = this.store.getPetSanctuary();
    sanctuary.seedPet({
      uniqueId: 'hoang_long_vip',
      nickname: 'Hoàng Long Luxury 💎',
      species: 'lion',
      level: 10,
      totalDiamonds: 12500,
    });
    sanctuary.seedPet({
      uniqueId: 'mai_phuong99',
      nickname: 'Phương Mai 🌸',
      species: 'bunny',
      level: 6,
      totalDiamonds: 3200,
    });
    sanctuary.seedPet({
      uniqueId: 'shark_hung_tiktok',
      nickname: 'Hưng Đại Ca 🐉',
      species: 'tiger',
      level: 8,
      totalDiamonds: 8900,
    });
    sanctuary.seedPet({
      uniqueId: 'thuy_tien_beauty',
      nickname: 'Tiên Tiên Skincare',
      species: 'cat',
      level: 4,
      totalDiamonds: 850,
    });
    sanctuary.seedPet({
      uniqueId: 'lan_anh_cute',
      nickname: 'Lan Anh (Mẹ Bỉm)',
      species: 'dog',
      level: 3,
      totalDiamonds: 450,
    });

    // Initial seed likes
    this.store.addLikes(120, 2450);

    // Initial mock chat messages
    for (let i = 0; i < 5; i++) {
      const u = MOCK_USERS[i % MOCK_USERS.length];
      const comment = MOCK_COMMENTS[i % MOCK_COMMENTS.length];
      const chatItem = this.store.addChat({
        uniqueId: u.uniqueId,
        nickname: u.nickname,
        avatarUrl: u.avatarUrl,
        comment,
        timestamp: Date.now() - (5 - i) * 1000,
      });
      this.emit('event:chat', chatItem);
    }

    // 1. Viewers fluctuation loop (every 2.5s)
    const viewerInterval = setInterval(() => {
      if (this.store.getStatus() !== 'SIMULATING') return;
      // Drift between 1,200 and 3,500
      const delta = Math.floor(Math.random() * 81) - 38;
      this.currentViewerCount = Math.max(1200, Math.min(3500, this.currentViewerCount + delta));
      this.store.updateViewerCount(this.currentViewerCount);
    }, 2500);
    this.simulationIntervals.push(viewerInterval);

    // 2. Chat comments loop (every 600ms - 1400ms)
    const scheduleNextChat = () => {
      if (this.store.getStatus() !== 'SIMULATING') return;
      const delay = Math.floor(Math.random() * 800) + 600;
      const timer = setTimeout(() => {
        if (this.store.getStatus() !== 'SIMULATING') return;
        const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const comment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
        const chatItem = this.store.addChat({
          uniqueId: user.uniqueId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          comment,
          timestamp: Date.now(),
        });
        this.emit('event:chat', chatItem);
        scheduleNextChat();
      }, delay);
      this.simulationIntervals.push(timer as any);
    };
    scheduleNextChat();

    // 3. Likes loop (every 700ms - 1200ms)
    const scheduleNextLikes = () => {
      if (this.store.getStatus() !== 'SIMULATING') return;
      const delay = Math.floor(Math.random() * 500) + 700;
      const timer = setTimeout(() => {
        if (this.store.getStatus() !== 'SIMULATING') return;
        const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const count = Math.floor(Math.random() * 40) + 15;
        this.store.addLikes(count, undefined, user);
        scheduleNextLikes();
      }, delay);
      this.simulationIntervals.push(timer as any);
    };
    scheduleNextLikes();

    // 4. Room joins loop (every 1200ms - 2500ms)
    const scheduleNextJoin = () => {
      if (this.store.getStatus() !== 'SIMULATING') return;
      const delay = Math.floor(Math.random() * 1300) + 1200;
      const timer = setTimeout(() => {
        if (this.store.getStatus() !== 'SIMULATING') return;
        const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const socialItem = this.store.addSocial({
          type: 'join',
          uniqueId: user.uniqueId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          timestamp: Date.now(),
        });
        this.emit('event:social', socialItem);
        scheduleNextJoin();
      }, delay);
      this.simulationIntervals.push(timer as any);
    };
    scheduleNextJoin();

    // 5. Follow / Share loop (every 3000ms - 6000ms)
    const scheduleNextSocial = () => {
      if (this.store.getStatus() !== 'SIMULATING') return;
      const delay = Math.floor(Math.random() * 3000) + 3000;
      const timer = setTimeout(() => {
        if (this.store.getStatus() !== 'SIMULATING') return;
        const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const type = Math.random() > 0.4 ? 'follow' : 'share';
        const socialItem = this.store.addSocial({
          type,
          uniqueId: user.uniqueId,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          timestamp: Date.now(),
        });
        this.emit('event:social', socialItem);
        scheduleNextSocial();
      }, delay);
      this.simulationIntervals.push(timer as any);
    };
    scheduleNextSocial();

    // 6. Gift loop (every 1500ms - 3500ms)
    const scheduleNextGift = () => {
      if (this.store.getStatus() !== 'SIMULATING') return;
      const delay = Math.floor(Math.random() * 2000) + 1500;
      const timer = setTimeout(() => {
        if (this.store.getStatus() !== 'SIMULATING') return;
        this.simulateGiftStep();
        scheduleNextGift();
      }, delay);
      this.simulationIntervals.push(timer as any);
    };
    scheduleNextGift();
  }

  private simulateGiftStep(): void {
    // Check if there is an active streak to continue
    if (this.activeSimStreaks.size > 0 && Math.random() < 0.65) {
      const streakKeys = Array.from(this.activeSimStreaks.keys());
      const chosenKey = streakKeys[Math.floor(Math.random() * streakKeys.length)];
      const streak = this.activeSimStreaks.get(chosenKey)!;

      const increment = Math.floor(Math.random() * 5) + 2;
      streak.repeat += increment;
      const isEnd = streak.repeat >= streak.maxRepeat;

      const giftItem = this.store.addGift({
        uniqueId: streak.user.uniqueId,
        nickname: streak.user.nickname,
        avatarUrl: streak.user.avatarUrl,
        giftId: streak.gift.giftId,
        giftName: streak.gift.giftName,
        giftPictureUrl: streak.gift.giftPictureUrl,
        diamondCount: streak.gift.diamondCount,
        repeatCount: streak.repeat,
        repeatEnd: isEnd,
        giftType: 1,
        timestamp: Date.now(),
      });
      this.emit('event:gift', giftItem);

      if (isEnd) {
        this.activeSimStreaks.delete(chosenKey);
      }
      return;
    }

    // Start a new gift
    const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    // Weighted gift selection: smaller gifts are more common
    const rand = Math.random();
    let gift = MOCK_GIFTS[0]; // Rose
    let isStreak = true;
    let maxRepeat = Math.floor(Math.random() * 25) + 5;

    if (rand < 0.45) {
      gift = MOCK_GIFTS[0]; // Rose (1)
    } else if (rand < 0.70) {
      gift = MOCK_GIFTS[1]; // TikTok (1)
    } else if (rand < 0.85) {
      gift = MOCK_GIFTS[2]; // Finger Heart (5)
      maxRepeat = Math.floor(Math.random() * 10) + 2;
    } else if (rand < 0.93) {
      gift = MOCK_GIFTS[3]; // Doughnut (30)
      maxRepeat = 1;
      isStreak = false;
    } else if (rand < 0.97) {
      gift = MOCK_GIFTS[4]; // Corgi (299)
      maxRepeat = 1;
      isStreak = false;
    } else if (rand < 0.99) {
      gift = MOCK_GIFTS[5]; // Money Gun (500)
      maxRepeat = 1;
      isStreak = false;
    } else {
      // Big gift: Leon or Universe!
      gift = Math.random() > 0.5 ? MOCK_GIFTS[6] : MOCK_GIFTS[7];
      maxRepeat = 1;
      isStreak = false;
    }

    const streakKey = `${user.uniqueId}_${gift.giftId}`;
    const initialRepeat = isStreak ? 1 : 1;
    const isEnd = !isStreak || maxRepeat === 1;

    const giftItem = this.store.addGift({
      uniqueId: user.uniqueId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      giftId: gift.giftId,
      giftName: gift.giftName,
      giftPictureUrl: gift.giftPictureUrl,
      diamondCount: gift.diamondCount,
      repeatCount: initialRepeat,
      repeatEnd: isEnd,
      giftType: isStreak ? 1 : 0,
      timestamp: Date.now(),
    });
    this.emit('event:gift', giftItem);

    if (isStreak && !isEnd) {
      this.activeSimStreaks.set(streakKey, {
        repeat: initialRepeat,
        maxRepeat,
        gift,
        user,
      });
    }
  }

  public disconnect(): void {
    // Clear simulation intervals
    for (const timer of this.simulationIntervals) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this.simulationIntervals = [];
    this.activeSimStreaks.clear();
    this.seenMsgIds.clear();

    // Disconnect real connection
    if (this.connection) {
      try {
        if (typeof this.connection.disconnect === 'function') {
          this.connection.disconnect();
        }
      } catch (e) {
        // ignore
      }
      this.connection = null;
    }

    const currentStatus = this.store.getStatus();
    if (currentStatus !== 'IDLE') {
      this.store.setStatus('IDLE');
      this.emit('stream:status', 'IDLE');
    }
  }
}
