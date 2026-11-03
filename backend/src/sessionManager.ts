import { Server as SocketIOServer, Socket } from 'socket.io';
import { MetricsStore } from './metricsStore';
import { TikTokService } from './tiktokService';
import { ConnectPayload } from './types';

export function normalizeUniqueId(raw?: string): string {
  if (!raw) return 'demo';
  const trimmed = raw.trim();
  if (!trimmed) return 'demo';

  // Support full tiktok.com/@username/live URLs
  const match = trimmed.match(/tiktok\.com\/@([^/?#]+)/i);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }

  // Remove leading @ and any trailing path segments
  const clean = trimmed.replace(/^@/, '').split('/')[0].trim().toLowerCase();
  return clean || 'demo';
}

export interface StreamSession {
  uniqueId: string;
  store: MetricsStore;
  service: TikTokService;
  clientSockets: Set<string>;
  createdAt: number;
  lastActiveAt: number;
  autoCleanupTimer: NodeJS.Timeout | null;
}

export class SessionManager {
  private sessions = new Map<string, StreamSession>();
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;

    // Periodic snapshot broadcast per active room (every 1000ms)
    setInterval(() => {
      this.broadcastSnapshots();
    }, 1000);
  }

  public getRoomName(uniqueId: string): string {
    return `stream:${normalizeUniqueId(uniqueId)}`;
  }

  public getSession(rawId?: string): StreamSession | undefined {
    if (!rawId) return undefined;
    return this.sessions.get(normalizeUniqueId(rawId));
  }

  public getOrCreateSession(rawId: string): StreamSession {
    const uniqueId = normalizeUniqueId(rawId);
    let session = this.sessions.get(uniqueId);

    if (session) {
      if (session.autoCleanupTimer) {
        clearTimeout(session.autoCleanupTimer);
        session.autoCleanupTimer = null;
      }
      session.lastActiveAt = Date.now();
      return session;
    }

    const store = new MetricsStore();
    const service = new TikTokService(store);
    const room = this.getRoomName(uniqueId);

    // Relay service events to clients in this specific streamer's room
    service.on('event:chat', (chatItem) => {
      this.io.to(room).emit('event:chat', chatItem);
    });

    service.on('event:gift', (giftItem) => {
      this.io.to(room).emit('event:gift', giftItem);
    });

    service.on('event:social', (socialItem) => {
      this.io.to(room).emit('event:social', socialItem);
    });

    service.on('event:pet_evolve', (evolutionEvent) => {
      this.io.to(room).emit('event:pet_evolve', evolutionEvent);
    });

    service.on('stream:status', (status, error) => {
      this.io.to(room).emit('stream:status', { status, error });
      this.io.to(room).emit('metrics:snapshot', store.getSnapshot());
    });

    session = {
      uniqueId,
      store,
      service,
      clientSockets: new Set<string>(),
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      autoCleanupTimer: null,
    };

    this.sessions.set(uniqueId, session);
    console.log(`[SessionManager] Created new session for: @${uniqueId}`);
    return session;
  }

  public joinSession(socket: Socket, rawId: string): StreamSession {
    const uniqueId = normalizeUniqueId(rawId);

    // If socket was already in another room, leave it first
    if (socket.data.uniqueId && socket.data.uniqueId !== uniqueId) {
      this.leaveSession(socket);
    }

    const session = this.getOrCreateSession(uniqueId);
    session.clientSockets.add(socket.id);
    session.lastActiveAt = Date.now();

    socket.data.uniqueId = uniqueId;
    socket.join(this.getRoomName(uniqueId));

    // Send the current snapshot of this session to this specific socket
    socket.emit('metrics:snapshot', session.store.getSnapshot());
    console.log(`[SessionManager] Socket ${socket.id} joined stream @${uniqueId} (${session.clientSockets.size} viewers in room)`);

    return session;
  }

  public leaveSession(socket: Socket): void {
    const uniqueId = socket.data.uniqueId;
    if (!uniqueId) return;

    socket.leave(this.getRoomName(uniqueId));
    delete socket.data.uniqueId;

    const session = this.sessions.get(uniqueId);
    if (!session) return;

    session.clientSockets.delete(socket.id);
    console.log(`[SessionManager] Socket ${socket.id} left stream @${uniqueId} (${session.clientSockets.size} remaining)`);

    // If no clients left in this room, schedule an auto-cleanup after 8 minutes to save resources
    if (session.clientSockets.size === 0 && uniqueId !== 'demo') {
      if (session.autoCleanupTimer) {
        clearTimeout(session.autoCleanupTimer);
      }
      session.autoCleanupTimer = setTimeout(() => {
        if (session.clientSockets.size === 0) {
          console.log(`[SessionManager] Cleaning up idle session @${uniqueId} (0 active clients for 8 minutes)`);
          session.service.disconnect();
          this.sessions.delete(uniqueId);
        }
      }, 8 * 60 * 1000); // 8 minutes
    }
  }

  public handlePetInteract(
    rawId: string,
    payload: {
      action: 'spawn' | 'chat' | 'like' | 'gift';
      uniqueId?: string;
      nickname?: string;
      comment?: string;
      likeCount?: number;
      diamondCount?: number;
      giftName?: string;
    }
  ): void {
    const session = this.getSession(rawId);
    if (!session) return;

    const uid = payload.uniqueId || 'tester_vip';
    const name = payload.nickname || 'Tester Bạn Thân';
    const store = session.store;

    if (payload.action === 'spawn') {
      store.addSocial({
        type: 'join',
        uniqueId: uid,
        nickname: name,
      });
    } else if (payload.action === 'chat') {
      store.addChat({
        uniqueId: uid,
        nickname: name,
        comment: payload.comment || 'Bé cưng ăn ngon mau lớn nha! 🐾✨',
      });
    } else if (payload.action === 'like') {
      store.addLikes(payload.likeCount || 10, undefined, {
        uniqueId: uid,
        nickname: name,
      });
    } else if (payload.action === 'gift') {
      const diamonds = payload.diamondCount || 30;
      const gName = payload.giftName || 'Doughnut';
      store.addGift({
        uniqueId: uid,
        nickname: name,
        giftId: 9999,
        giftName: gName,
        diamondCount: diamonds,
        repeatCount: 1,
        repeatEnd: true,
        giftType: 0,
      });
    }

    this.io.to(this.getRoomName(session.uniqueId)).emit('metrics:snapshot', store.getSnapshot());
  }

  private broadcastSnapshots(): void {
    for (const [uniqueId, session] of this.sessions.entries()) {
      // Only broadcast if there are listeners or actively connected
      if (session.clientSockets.size > 0 || session.store.getStatus() === 'LIVE') {
        this.io.to(this.getRoomName(uniqueId)).emit('metrics:snapshot', session.store.getSnapshot());
      }
    }
  }

  public getActiveSessionsSummary() {
    const result: Array<{ uniqueId: string; status: string; clientCount: number; viewerCount: number }> = [];
    for (const [uniqueId, session] of this.sessions.entries()) {
      result.push({
        uniqueId,
        status: session.store.getStatus(),
        clientCount: session.clientSockets.size,
        viewerCount: session.store.getSnapshot().kpis.viewerCount,
      });
    }
    return result;
  }
}
