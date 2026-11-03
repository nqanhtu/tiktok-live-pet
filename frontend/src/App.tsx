import React, { useState, useEffect } from 'react';
import { HeaderBar, ViewMode } from './components/HeaderBar';
import { KpiGrid } from './components/KpiGrid';
import { LiveCharts } from './components/LiveCharts';
import { GiftFeed } from './components/GiftFeed';
import { ChatFeed } from './components/ChatFeed';
import { LivePetOverlay } from './components/pet/LivePetOverlay';
import { useTikTokLive } from './hooks/useTikTokLive';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  // Check if launched as a dedicated OBS Browser Source URL (/obs.html, /obs, ?obs=1, ?mode=overlay)
  const isPureObsUrl = (() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    return (
      path.endsWith('/obs.html') ||
      path.endsWith('/obs') ||
      params.get('obs') === '1' ||
      params.get('mode') === 'overlay'
    );
  })();

  // Parse ?username=... from URL (supports raw handle, @handle, or full https://www.tiktok.com/@user/live URL)
  const urlTargetUsername = (() => {
    if (typeof window === 'undefined') return '';
    const raw = new URLSearchParams(window.location.search).get('username')?.trim() || '';
    if (!raw) return '';
    const match = raw.match(/tiktok\.com\/@([^/?#]+)/i);
    if (match && match[1]) return match[1];
    return raw.replace(/^@/, '').split('/')[0].trim();
  })();

  const [activeStreamer, setActiveStreamer] = useState<string>(() => {
    return urlTargetUsername || '';
  });

  const {
    snapshot,
    isSocketConnected,
    connectStream,
    startSimulation,
    disconnectStream,
    resetMetrics,
    triggerPetInteract,
    exportJson,
  } = useTikTokLive(activeStreamer);

  // Initialize view mode with automatic URL query check
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (isPureObsUrl) return 'overlay';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'analytics') return 'analytics';
    }
    return 'hybrid';
  });

  // Make html/body 100% transparent when in pure OBS URL mode
  useEffect(() => {
    if (!isPureObsUrl) return;
    const params = new URLSearchParams(window.location.search);
    const customBg = params.get('bgColor') || 'transparent';
    document.documentElement.style.background = customBg;
    document.body.style.background = customBg;
    document.body.style.overflow = 'hidden';
    document.body.classList.remove('bg-[#0a0b10]');
  }, [isPureObsUrl]);

  // Auto-retry in OBS mode if stream is offline/error
  useEffect(() => {
    if (!isPureObsUrl || !activeStreamer || !isSocketConnected) return;

    if (snapshot.status === 'ERROR') {
      const timer = setTimeout(() => {
        connectStream({ uniqueId: activeStreamer });
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [activeStreamer, isSocketConnected, snapshot.status, isPureObsUrl, connectStream]);

  // Pure Frameless OBS Overlay Mode: render ONLY the single Pet Garden frame (no header, no footer, no website chrome)
  if (isPureObsUrl || viewMode === 'overlay') {
    return (
      <div className="w-screen h-screen overflow-hidden bg-transparent select-none relative group">
        <LivePetOverlay
          activePets={snapshot.activePets}
          totalPetsCount={snapshot.totalPetsCount}
          recentEvolutions={snapshot.recentEvolutions}
          onTestPetInteract={triggerPetInteract}
          isFullScreen={true}
          pureObsMode={true}
          streamUsername={activeStreamer || snapshot.roomInfo?.uniqueId || urlTargetUsername}
        />
        {!isPureObsUrl && (
          <button
            type="button"
            onClick={() => setViewMode('hybrid')}
            className="fixed top-3 right-3 z-50 opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-opacity duration-200 shadow-lg"
          >
            ✕ Thoát Toàn Màn Hình
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] text-gray-100 flex flex-col font-sans">
      {/* Top Sticky Header */}
      <HeaderBar
        status={snapshot.status}
        roomInfo={snapshot.roomInfo}
        isSocketConnected={isSocketConnected}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onConnect={(payload) => {
          setActiveStreamer(payload.uniqueId);
          connectStream(payload);
        }}
        onSimulate={(uid) => {
          const target = uid || 'demo';
          setActiveStreamer(target);
          startSimulation(target);
        }}
        onDisconnect={() => disconnectStream(activeStreamer)}
        onReset={() => resetMetrics(activeStreamer)}
        onExport={exportJson}
      />

      {/* Connection / Error Notice Banners */}
      <div className="max-w-[1920px] mx-auto w-full px-4 lg:px-6 pt-3">
        {!isSocketConnected && (
          <div className="mb-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs text-rose-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Chưa kết nối tới Backend Socket.IO:</strong> Vui lòng đảm bảo backend Node.js đang chạy tại{' '}
                <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-rose-300">
                  http://localhost:3001
                </code>
                . Giao diện đang tự động thử kết nối lại...
              </span>
            </div>
          </div>
        )}

        {snapshot.status === 'ERROR' && (
          <div className="mb-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between text-xs text-rose-200 shadow-glow-magenta/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Lỗi kết nối phiên LIVE:</strong>{' '}
                {snapshot.errorMessage || 'Không thể kết nối tới TikTok Live. Hãy kiểm tra lại username hoặc thử Demo Sim.'}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveStreamer('demo');
                startSimulation('demo');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 border border-rose-400/40 text-white font-semibold transition active:scale-95"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Chạy Demo Sim</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODE 2: HYBRID (Kết Hợp Sân Thú Cưng + Chỉ Số Realtime + Quà + Chat)
          ========================================================================= */}
      {viewMode === 'hybrid' && (
        <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 space-y-5">
          {/* Row 1: KPI Metrics Grid */}
          <KpiGrid kpis={snapshot.kpis} />

          {/* Row 2: Live Pet Overlay + Charts on Left / Gift Feed on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (7 cols): Sân Cỏ Nuôi Thú + Biểu Đồ */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-5">
              <LivePetOverlay
                activePets={snapshot.activePets}
                totalPetsCount={snapshot.totalPetsCount}
                recentEvolutions={snapshot.recentEvolutions}
                onTestPetInteract={triggerPetInteract}
                isFullScreen={false}
                streamUsername={activeStreamer || snapshot.roomInfo?.uniqueId || urlTargetUsername}
                onToggleFullScreen={() => setViewMode('overlay')}
              />
              <LiveCharts timeSeries={snapshot.timeSeries} />
            </div>

            {/* Right Column (5 cols): Live Gift Stream & Leaderboards */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
              <GiftFeed
                recentGifts={snapshot.recentGifts}
                topGifters={snapshot.topGifters}
                topChatters={snapshot.topChatters}
              />
            </div>
          </div>

          {/* Row 3: Realtime Chat Stream & Social Events with Question Filter */}
          <div className="w-full">
            <ChatFeed
              recentChats={snapshot.recentChats}
              recentSocials={snapshot.recentSocials}
            />
          </div>
        </main>
      )}

      {/* =========================================================================
          MODE 3: ANALYTICS (Bảng Số Liệu Chuyên Sâu Cổ Điển)
          ========================================================================= */}
      {viewMode === 'analytics' && (
        <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 lg:p-6 space-y-5">
          {/* Row 1: KPI Metrics Grid */}
          <KpiGrid kpis={snapshot.kpis} />

          {/* Row 2: Live Charts & Gift Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (7 cols): Realtime Charts */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-4">
              <LiveCharts timeSeries={snapshot.timeSeries} />
            </div>

            {/* Right Column (5 cols): Live Gift Stream & Leaderboards */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
              <GiftFeed
                recentGifts={snapshot.recentGifts}
                topGifters={snapshot.topGifters}
                topChatters={snapshot.topChatters}
              />
            </div>
          </div>

          {/* Row 3: Realtime Chat Stream & Social Events with Question Filter */}
          <div className="w-full">
            <ChatFeed
              recentChats={snapshot.recentChats}
              recentSocials={snapshot.recentSocials}
            />
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-gray-500">
        <p>TikTok LIVE Realtime Analytics & MochiBunny Pet Overlay &copy; 2026. Designed for live streamers, moderators & e-commerce operators.</p>
      </footer>
    </div>
  );
};

export default App;
