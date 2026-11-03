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

export function useTikTokLive() {
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

    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsSocketConnected(true);
      console.log('[TikTokLive] Socket connected to:', backendUrl, socket.id);
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

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

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
    socketRef.current.emit('stream:simulate', { uniqueId: uniqueId || 'demo_streamer' });
  }, []);

  const disconnectStream = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('stream:disconnect');
  }, []);

  const resetMetrics = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('stream:reset');
    setSnapshot(INITIAL_SNAPSHOT);
  }, []);

  const triggerPetInteract = useCallback((payload: PetInteractPayload) => {
    // Emit via socket if available
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('pet:interact', payload);
      return;
    }
    // Also try REST API fallback
    fetch('/api/pet/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Ignored if handled via socket
    });
  }, []);

  const exportJson = useCallback(() => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
      const downloadAnchor = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const username = snapshot.roomInfo?.uniqueId || 'stream';
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tiktok-live-${username}-${timestamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('[TikTokLive] Failed to export JSON:', err);
    }
  }, [snapshot]);

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
