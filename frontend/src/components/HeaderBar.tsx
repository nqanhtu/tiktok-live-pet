import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Square,
  RotateCcw,
  Download,
  Settings,
  Wifi,
  WifiOff,
  User,
  X,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  Zap,
  Tv,
  BarChart3,
} from 'lucide-react';
import { ConnectionStatus, RoomInfo, ConnectPayload } from '../types';

export type ViewMode = 'hybrid' | 'overlay' | 'analytics';

interface HeaderBarProps {
  status: ConnectionStatus;
  roomInfo: RoomInfo | null;
  isSocketConnected: boolean;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onConnect: (payload: ConnectPayload) => void;
  onSimulate: (uniqueId?: string) => void;
  onDisconnect: () => void;
  onReset: () => void;
  onExport: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  status,
  roomInfo,
  isSocketConnected,
  viewMode,
  onChangeViewMode,
  onConnect,
  onSimulate,
  onDisconnect,
  onReset,
  onExport,
}) => {
  const [uniqueIdInput, setUniqueIdInput] = useState('co_dai_986');
  const [showSettings, setShowSettings] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [eulerApiKey, setEulerApiKey] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live timer calculation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const isStreaming = status === 'LIVE' || status === 'SIMULATING';

    if (isStreaming) {
      const startTime = roomInfo?.startTime ? roomInfo.startTime : Date.now();
      
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((now - startTime) / 1000));
        setElapsedSeconds(diff);
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, roomInfo?.startTime]);

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = uniqueIdInput.replace(/^@/, '').trim();
    if (!cleanId) return;

    onConnect({
      uniqueId: cleanId,
      sessionId: sessionId.trim() || undefined,
      eulerApiKey: eulerApiKey.trim() || undefined,
    });
  };

  const handleSimulate = () => {
    const cleanId = uniqueIdInput.replace(/^@/, '').trim() || 'demo_streamer';
    onSimulate(cleanId);
  };

  const isLive = status === 'LIVE';
  const isSimulating = status === 'SIMULATING';
  const isConnecting = status === 'CONNECTING';
  const isActive = isLive || isSimulating || isConnecting;

  // Status Badge Styling
  const getStatusBadge = () => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#fe2c55]/20 text-[#fe2c55] border border-[#fe2c55]/40 shadow-glow-magenta">
            <span className="w-2 h-2 rounded-full bg-[#fe2c55] live-indicator" />
            LIVE
          </span>
        );
      case 'SIMULATING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-tiktok-cyan/20 text-tiktok-cyan border border-tiktok-cyan/40 shadow-glow-cyan">
            <span className="w-2 h-2 rounded-full bg-tiktok-cyan live-indicator" />
            SIMULATING
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            CONNECTING...
          </span>
        );
      case 'ENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-gray-700/40 text-gray-400 border border-gray-600/40">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            ENDED
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-red-600/20 text-red-400 border border-red-500/40">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            ERROR
          </span>
        );
      case 'IDLE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-gray-800/60 text-gray-400 border border-gray-700/50">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            IDLE
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0b10]/95 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 py-3 transition-all">
      <div className="max-w-[1920px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
        
        {/* Brand & Live Status Section */}
        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#fe2c55] to-tiktok-cyan flex items-center justify-center p-[2px] shadow-glow-magenta/50">
              <div className="w-full h-full bg-[#0a0b10] rounded-[10px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  TikTok LIVE
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-tiktok-cyan border border-tiktok-cyan/20 uppercase tracking-widest font-semibold">
                  PET + ANALYTICS
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Live Commerce & MochiBunny Pet Stream Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge()}

            {/* Live Duration Timer */}
            {(isLive || isSimulating) && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-tiktok-cyan">
                <span className="text-gray-400 text-[10px]">TIME:</span>
                <span className="font-semibold tracking-wider">{formatDuration(elapsedSeconds)}</span>
              </div>
            )}

            {/* Socket Health */}
            <div
              title={isSocketConnected ? 'Server Socket: Đã kết nối' : 'Server Socket: Mất kết nối (Kiểm tra backend port 3001)'}
              className="flex items-center gap-1 text-xs"
            >
              {isSocketConnected ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-rose-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-2xl border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => onChangeViewMode('hybrid')}
            title="⚡ Kết Hợp: Sân Thú Cưng + Chỉ Số Realtime"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              viewMode === 'hybrid'
                ? 'bg-gradient-to-r from-tiktok-cyan to-blue-500 text-black shadow-glow-cyan/50 font-bold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Kết Hợp</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('overlay')}
            title="🐾 Toàn Màn Hình Overlay Sân Thú (Dành cho OBS / TikTok Studio)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              viewMode === 'overlay'
                ? 'bg-gradient-to-r from-[#fe2c55] to-pink-500 text-white shadow-glow-magenta/50 font-bold'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>🐾 Overlay OBS</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('analytics')}
            title="📊 Bảng Số Liệu Analytics Chuyên Sâu"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
              viewMode === 'analytics'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>📊 Số Liệu</span>
          </button>
        </div>

        {/* Room Info Badge (When Connected) */}
        {roomInfo && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 max-w-xs">
            <div className="relative">
              {roomInfo.avatarUrl ? (
                <img
                  src={roomInfo.avatarUrl}
                  alt={roomInfo.nickname}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-tiktok-magenta/50"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0a0b10]" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{roomInfo.nickname || roomInfo.uniqueId}</span>
                <a
                  href={`https://www.tiktok.com/@${roomInfo.uniqueId}/live`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-tiktok-cyan transition-colors"
                  title="Mở TikTok Live tab mới"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[10px] text-gray-400 truncate max-w-[140px]" title={roomInfo.title || `@${roomInfo.uniqueId}`}>
                {roomInfo.title || `@${roomInfo.uniqueId}`}
              </p>
            </div>
          </div>
        )}

        {/* Actions & Connection Controls */}
        <div className="flex items-center gap-2 w-full xl:w-auto flex-wrap xl:flex-nowrap justify-end">
          <form onSubmit={handleConnect} className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <div className="relative flex-1 sm:w-48 md:w-56">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-mono text-sm">
                @
              </span>
              <input
                type="text"
                value={uniqueIdInput}
                onChange={(e) => setUniqueIdInput(e.target.value)}
                placeholder="tiktok_username"
                disabled={isActive}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-7 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-tiktok-magenta focus:ring-1 focus:ring-tiktok-magenta transition disabled:opacity-50"
              />
            </div>

            {!isActive ? (
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#fe2c55] to-[#e0264b] hover:brightness-110 active:scale-95 transition shadow-glow-magenta/40 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Connect Live</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onDisconnect}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/40 hover:bg-rose-500/30 active:scale-95 transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Disconnect</span>
              </button>
            )}
          </form>

          {/* Quick Demo Simulator Button */}
          {!isActive && (
            <button
              type="button"
              onClick={handleSimulate}
              title="Khởi chạy giả lập dữ liệu Live Stream ngay mà không cần tài khoản TikTok live thật"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-tiktok-cyan bg-tiktok-cyan/10 border border-tiktok-cyan/30 hover:bg-tiktok-cyan/20 active:scale-95 transition"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo</span> Sim
            </button>
          )}

          {/* Reset Metrics */}
          <button
            type="button"
            onClick={onReset}
            title="Đặt lại toàn bộ chỉ số về 0"
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Export JSON Report */}
          <button
            type="button"
            onClick={onExport}
            title="Tải báo cáo dữ liệu phiên Live (JSON)"
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 active:scale-95 transition"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Settings Modal Toggle */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            title="Cài đặt kết nối TikTok SessionId / EulerStream API Key"
            className={`p-2 rounded-xl border transition active:scale-95 ${
              showSettings || sessionId || eulerApiKey
                ? 'text-tiktok-cyan bg-tiktok-cyan/10 border-tiktok-cyan/40'
                : 'text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border-white/10'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal Popover */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141f] border border-white/15 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-tiktok-cyan" />
                <h3 className="text-base font-bold text-white">Cấu hình Nâng cao (Tùy chọn)</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Để hạn chế bị TikTok Rate-limit hoặc xác thực Captcha khi kết nối liên tục, bạn có thể nhập TikTok Web SessionId hoặc EulerStream API Key.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                  TikTok sessionId (Cookie):
                </label>
                <input
                  type="password"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="sessionid_ss_ads_..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-tiktok-cyan focus:ring-1 focus:ring-tiktok-cyan"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Lấy từ Cookie trình duyệt trên web tiktok.com (`sessionid`).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                  EulerStream API Key:
                </label>
                <input
                  type="password"
                  value={eulerApiKey}
                  onChange={(e) => setEulerApiKey(e.target.value)}
                  placeholder="euler_live_..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-tiktok-cyan focus:ring-1 focus:ring-tiktok-cyan"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Hỗ trợ proxy EulerStream bypass anti-bot cho streamer khối lượng lớn.
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSessionId('');
                  setEulerApiKey('');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition"
              >
                Xóa cấu hình
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-black bg-tiktok-cyan hover:bg-tiktok-cyanHover active:scale-95 transition"
              >
                Lưu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
