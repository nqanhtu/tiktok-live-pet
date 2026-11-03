import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { DashboardSnapshot, ConnectPayload } from '../types';

export interface PetInteractPayload {
  action: 'spawn' | 'chat' | 'like' | 'gift';
  uniqueId?: string;
  nickname?: string;
  comment?: string;
  likeCount?: number;
  diamondCount?: number;
  giftName?: string;
  streamUsername?: string;
}

const INITIAL_SNAPSHOT: DashboardSnapshot = {
  status: 'IDLE',
  errorMessage: undefined,
  roomInfo: null,
  kpis: {
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
  },
  timeSeries: [],
  recentChats: [],
  recentGifts: [],
  recentSocials: [],
  topGifters: [],
  topChatters: [],
  activePets: [],
  totalPetsCount: 0,
  recentEvolutions: [],
};

export function useTikTokLive(targetUsername?: string) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(INITIAL_SNAPSHOT);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // When running with Vite dev server (port 5173), fallback to port 3001 if needed
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : '/');

    const cleanUsername = targetUsername?.trim().replace(/^@/, '') || '';

    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
      query: cleanUsername ? { username: cleanUsername } : undefined,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsSocketConnected(true);
      console.log('[TikTokLive] Socket connected to:', backendUrl, socket.id);
      if (cleanUsername) {
        socket.emit('stream:join', { uniqueId: cleanUsername, autoConnect: true });
      }
    });

    socket.on('disconnect', (reason) => {
      setIsSocketConnected(false);
      console.log('[TikTokLive] Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      setIsSocketConnected(false);
      console.warn('[TikTokLive] Socket connection error:', error.message);
    });

    socket.on('metrics:snapshot', (data: DashboardSnapshot) => {
      if (data && typeof data === 'object') {
        setSnapshot(data);
      }
    });

    socket.on('stream:error', (data: { message?: string }) => {
      if (data?.message) {
        setSnapshot((prev) => ({
          ...prev,
          status: 'ERROR',
          errorMessage: data.message,
        }));
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [targetUsername]);

  const connectStream = useCallback((payload: ConnectPayload) => {
    if (!socketRef.current) return;
    setSnapshot((prev) => ({
      ...prev,
      status: 'CONNECTING',
      errorMessage: undefined,
    }));
    socketRef.current.emit('stream:connect', payload);
  }, []);

  const startSimulation = useCallback((uniqueId?: string) => {
    if (!socketRef.current) return;
    setSnapshot((prev) => ({
      ...prev,
      status: 'SIMULATING',
      errorMessage: undefined,
    }));
    const target = uniqueId || targetUsername || 'demo';
    socketRef.current.emit('stream:simulate', { uniqueId: target });
  }, [targetUsername]);

  const disconnectStream = useCallback((uniqueId?: string) => {
    if (!socketRef.current) return;
    const target = uniqueId || targetUsername || snapshot.roomInfo?.uniqueId;
    socketRef.current.emit('stream:disconnect', { uniqueId: target });
  }, [targetUsername, snapshot.roomInfo?.uniqueId]);

  const resetMetrics = useCallback((uniqueId?: string) => {
    if (!socketRef.current) return;
    const target = uniqueId || targetUsername || snapshot.roomInfo?.uniqueId;
    socketRef.current.emit('stream:reset', { uniqueId: target });
    setSnapshot(INITIAL_SNAPSHOT);
  }, [targetUsername, snapshot.roomInfo?.uniqueId]);

  const triggerPetInteract = useCallback((payload: PetInteractPayload) => {
    const fullPayload = {
      ...payload,
      streamUsername: payload.streamUsername || targetUsername || snapshot.roomInfo?.uniqueId || 'demo',
    };

    // Emit via socket if available
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('pet:interact', fullPayload);
      return;
    }

    // Also try REST API fallback
    fetch('/api/pet/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload),
    }).catch(() => {
      // Ignored if handled via socket
    });
  }, [targetUsername, snapshot.roomInfo?.uniqueId]);

  const exportJson = useCallback(() => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
      const downloadAnchor = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const username = snapshot.roomInfo?.uniqueId || targetUsername || 'stream';
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tiktok-live-${username}-${timestamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('[TikTokLive] Failed to export JSON:', err);
    }
  }, [snapshot, targetUsername]);

  return {
    snapshot,
    isSocketConnected,
    connectStream,
    startSimulation,
    disconnectStream,
    resetMetrics,
    triggerPetInteract,
    exportJson,
  };
}
