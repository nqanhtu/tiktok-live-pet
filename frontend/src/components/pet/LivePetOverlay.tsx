import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  HelpCircle,
  Crown,
  Tv,
  Heart,
  Gift,
  MessageCircle,
  UserPlus,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Sliders,
} from 'lucide-react';
import { ViewerPetState, PetEvolutionEvent, PetSpeciesId } from '../../types';
import { PetInteractPayload } from '../../hooks/useTikTokLive';
import {
  getStageForSpeciesLevel,
  SPECIES_CONFIGS,
  SPECIES_GAMIFICATION_META,
  SPECIES_ORDER,
} from '../../data/bunnyData';
import { CuteBunnyArt } from './CuteBunnyArt';
import { FoodSvgIcon } from './FoodSvgIcon';
import { soundEngine } from '../../utils/sound';

export type BackgroundMode = 'meadow' | 'sakura' | 'galaxy' | 'chroma' | 'transparent';
export type AspectRatioMode = '16-9' | '9-16' | 'full';

interface LivePetOverlayProps {
  activePets: ViewerPetState[];
  totalPetsCount?: number;
  recentEvolutions?: PetEvolutionEvent[];
  onTestPetInteract?: (payload: PetInteractPayload) => void;
  isFullScreen?: boolean;
  pureObsMode?: boolean;
  streamUsername?: string;
  onToggleFullScreen?: () => void;
}

interface PetWalkState {
  x: number;
  y: number;
  facing: 'left' | 'right';
  isWalking: boolean;
  durationMs: number;
  walkEndAt: number;
  nextMoveAt: number;
}

export const LivePetOverlay: React.FC<LivePetOverlayProps> = ({
  activePets = [],
  totalPetsCount = 0,
  recentEvolutions = [],
  onTestPetInteract,
  isFullScreen = false,
  pureObsMode = false,
  streamUsername = '',
  onToggleFullScreen,
}) => {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  const [bgMode, setBgMode] = useState<BackgroundMode>(() => {
    const paramBg = urlParams?.get('bg') as BackgroundMode | null;
    if (paramBg && ['meadow', 'sakura', 'galaxy', 'chroma', 'transparent'].includes(paramBg)) {
      return paramBg;
    }
    return pureObsMode ? 'transparent' : 'meadow';
  });
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('16-9');
  const [maxVisiblePets, setMaxVisiblePets] = useState<number>(() => {
    const paramMax = Number(urlParams?.get('maxPets'));
    return paramMax > 0 ? paramMax : 16;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (urlParams?.get('sound') === '0') {
      soundEngine.enabled = false;
      return false;
    }
    return soundEngine.enabled;
  });
  const [showControls, setShowControls] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<ViewerPetState | null>(null);
  const [showCompendium, setShowCompendium] = useState<boolean>(false);
  const [compendiumSpecies, setCompendiumSpecies] = useState<PetSpeciesId>('dragon');
  const [showObsBuilder, setShowObsBuilder] = useState<boolean>(false);
  const [obsUsernameInput, setObsUsernameInput] = useState<string>(streamUsername || 'huyga.official');
  const [obsBgInput, setObsBgInput] = useState<BackgroundMode>('transparent');
  const [obsShowRank, setObsShowRank] = useState<boolean>(true);
  const [obsShowFever, setObsShowFever] = useState<boolean>(true);
  const [obsShowGuide, setObsShowGuide] = useState<boolean>(true);
  const [obsCopied, setObsCopied] = useState<boolean>(false);
  const [now, setNow] = useState<number>(Date.now());

  const showRankHud = urlParams?.get('showRank') !== '0';
  const showFeverHud = urlParams?.get('showFever') !== '0';
  const showGuideHud = pureObsMode ? urlParams?.get('showGuide') !== '0' : true;
  const customBgColor = urlParams?.get('bgColor') || '';
  const customFontColor = urlParams?.get('fontColor') || '';
  const customFontSize = urlParams?.get('fontSize') || '';
  const [walkStates, setWalkStates] = useState<Record<string, PetWalkState>>({});
  const lastEvoIdRef = useRef<string | null>(null);

  // Autonomous random wandering loop for all visible pets
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      setWalkStates((prev) => {
        const next: Record<string, PetWalkState> = { ...prev };
        let changed = false;

        for (const pet of activePets.slice(0, maxVisiblePets)) {
          const id = pet.uniqueId;
          const isChatting = Boolean(pet.lastChat && currentTime - pet.lastChat.timestamp < 6500);
          const isEvolving = pet.actionState === 'evolving';
          let st = next[id];

          if (!st) {
            const startX = Math.min(90, Math.max(10, pet.position?.x ?? 15 + Math.random() * 70));
            const startY = Math.min(88, Math.max(54, pet.position?.y ?? 56 + Math.random() * 30));
            st = {
              x: startX,
              y: startY,
              facing: Math.random() > 0.5 ? 'right' : 'left',
              isWalking: false,
              durationMs: 2400,
              walkEndAt: 0,
              nextMoveAt: currentTime + 400 + Math.floor(Math.random() * 1800),
            };
            next[id] = st;
            changed = true;
            continue;
          }

          // Stop walking if walk duration finished or pet starts chatting/evolving
          if (st.isWalking && (currentTime >= st.walkEndAt || isChatting || isEvolving)) {
            next[id] = {
              ...st,
              isWalking: false,
            };
            changed = true;
            continue;
          }

          // Pick a new random destination when idle timer fires
          if (!st.isWalking && !isChatting && !isEvolving && currentTime >= st.nextMoveAt) {
            const stepX = (Math.random() * 18 + 6) * (Math.random() > 0.5 ? 1 : -1);
            const stepY = (Math.random() * 9 + 2) * (Math.random() > 0.5 ? 1 : -1);

            let targetX = st.x + stepX;
            if (targetX < 10) targetX = 12 + Math.random() * 14;
            if (targetX > 90) targetX = 88 - Math.random() * 14;

            let targetY = st.y + stepY;
            if (targetY < 54) targetY = 56 + Math.random() * 8;
            if (targetY > 88) targetY = 86 - Math.random() * 8;

            const dist = Math.hypot(targetX - st.x, targetY - st.y);
            const durationMs = Math.round(Math.max(1600, Math.min(3400, dist * 135)));
            const pauseAfterMs = 900 + Math.floor(Math.random() * 2200);

            next[id] = {
              x: Math.round(targetX * 10) / 10,
              y: Math.round(targetY * 10) / 10,
              facing: targetX < st.x ? 'left' : 'right',
              isWalking: true,
              durationMs,
              walkEndAt: currentTime + durationMs,
              nextMoveAt: currentTime + durationMs + pauseAfterMs,
            };
            changed = true;
          }
        }

        return changed ? next : prev;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [activePets, maxVisiblePets]);

  // Monitor evolutions to play evolution fanfare sound
  useEffect(() => {
    if (recentEvolutions && recentEvolutions.length > 0) {
      const latestEvo = recentEvolutions[0];
      if (latestEvo.id !== lastEvoIdRef.current) {
        lastEvoIdRef.current = latestEvo.id;
        // Check if evolution occurred in last 8 seconds
        if (Date.now() - latestEvo.timestamp < 8000) {
          soundEngine.playEvolutionSound();
        }
      }
    }
  }, [recentEvolutions]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    soundEngine.enabled = nextState;
    setSoundEnabled(nextState);
  };

  // Top 3 highest level pets in room
  const topPets = [...activePets]
    .sort((a, b) => b.level - a.level || b.exp - a.exp)
    .slice(0, 3);

  // Active latest evolution in last 7 seconds
  const activeEvolution = recentEvolutions?.find(
    (evo) => now - evo.timestamp < 7000
  );

  // Preset quick test comments
  const sampleComments = [
    'Bao nhiêu một chiếc áo này shop ơi? 😍',
    'Thả tim tới tấp cho idol!',
    'Pet của mình cưng xỉu luôn á',
    'Check inbox giúp em với shop nhé',
    'Chấm hóng siêu phẩm mới ra mắt',
    'Ship về Đà Nẵng mấy ngày vậy ạ?',
  ];

  const handleTestSpawn = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    onTestPetInteract?.({
      action: 'spawn',
      uniqueId: `viewer_${randomNum}`,
      nickname: `Khán Giả ${randomNum}`,
    });
    soundEngine.playPetSound('bunny');
  };

  const handleTestChat = () => {
    const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
    onTestPetInteract?.({
      action: 'chat',
      comment: randomComment,
    });
    soundEngine.playSoftAlert();
  };

  const handleTestLike = () => {
    onTestPetInteract?.({
      action: 'like',
      likeCount: 50,
    });
    soundEngine.playEatSound();
  };

  const handleTestGift = () => {
    const gifts = [
      { name: 'Hoa Hồng Tình Yêu', dia: 10 },
      { name: 'Mũ Phù Thủy', dia: 99 },
      { name: 'Vương Miện Kim Cương', dia: 299 },
      { name: 'Cung Trăng Thần Thoại', dia: 520 },
    ];
    const picked = gifts[Math.floor(Math.random() * gifts.length)];
    onTestPetInteract?.({
      action: 'gift',
      diamondCount: picked.dia,
      giftName: picked.name,
    });
    soundEngine.playLevelUpSound();
  };

  const handleTestGacha = () => {
    const targetPet = activePets[0];
    onTestPetInteract?.({
      action: 'chat',
      uniqueId: targetPet?.uniqueId || 'viewer_vip',
      nickname: targetPet?.nickname || 'Khán Giả VIP',
      comment: '!gacha',
    });
    soundEngine.playEvolutionSound();
  };

  const handleSummonSpecies = (speciesId: PetSpeciesId) => {
    const meta = SPECIES_GAMIFICATION_META[speciesId];
    const randomId = Math.floor(100 + Math.random() * 900);
    onTestPetInteract?.({
      action: 'chat',
      uniqueId: `summoner_${speciesId}_${randomId}`,
      nickname: `${meta.emoji} Luyện Thú Sư ${randomId}`,
      comment: meta.chatCmd,
    });
    soundEngine.playPetSound(speciesId);
  };

  // Community Energy / Fever Boss Bar calculation
  const totalRoomPower = activePets.reduce(
    (sum, p) => sum + (p.totalDiamonds || 0) * 8 + (p.totalLikes || 0) + (p.totalComments || 0) * 15 + p.level * 25,
    0
  );
  const feverCycle = 500;
  const currentFeverPoints = totalRoomPower % feverCycle;
  const feverTier = Math.floor(totalRoomPower / feverCycle) + 1;
  const feverPct = Math.min(100, Math.round((currentFeverPoints / feverCycle) * 100));
  const isFeverActive = feverPct >= 80 || (activeEvolution !== undefined);

  // Background styling logic
  const getBackgroundClass = () => {
    switch (bgMode) {
      case 'meadow':
        return 'bg-gradient-to-b from-[#87ceeb] via-[#bfe3f7] to-[#78c264] text-gray-900';
      case 'sakura':
        return 'bg-gradient-to-b from-[#ffd1dc] via-[#ffe4e1] to-[#f49ac2] text-gray-900';
      case 'galaxy':
        return 'bg-gradient-to-b from-[#060714] via-[#120e29] to-[#1e1338] text-white';
      case 'chroma':
        return 'bg-[#00FF00] text-black';
      case 'transparent':
        return 'bg-transparent text-white';
      default:
        return 'bg-[#11131f] text-white';
    }
  };

  // Aspect ratio styling
  const getContainerAspectClass = () => {
    if (pureObsMode) return 'w-screen h-screen rounded-none border-0';
    if (isFullScreen) return 'w-full h-full min-h-[600px] flex-1';
    switch (aspectRatio) {
      case '9-16':
        return 'w-full max-w-[420px] mx-auto aspect-[9/16] min-h-[580px] shadow-2xl';
      case 'full':
        return 'w-full h-[540px] shadow-xl';
      case '16-9':
      default:
        return 'w-full aspect-[16/9] min-h-[380px] max-h-[580px] shadow-xl';
    }
  };

  const visiblePets = activePets.slice(0, maxVisiblePets);

  const generatedObsUrl = (() => {
    if (typeof window === 'undefined') return '';
    const base = `${window.location.origin}/obs.html`;
    const p = new URLSearchParams();
    if (obsUsernameInput.trim()) p.set('username', obsUsernameInput.trim());
    p.set('bg', obsBgInput);
    p.set('showRank', obsShowRank ? '1' : '0');
    p.set('showFever', obsShowFever ? '1' : '0');
    p.set('showGuide', obsShowGuide ? '1' : '0');
    p.set('maxPets', String(maxVisiblePets));
    return `${base}?${p.toString()}`;
  })();

  return (
    <div className={`flex flex-col w-full relative ${pureObsMode ? 'w-screen h-screen overflow-hidden' : ''}`}>
      {/* =========================================================================
          Overlay Control Bar (Hidden completely in Pure OBS Mode!)
          ========================================================================= */}
      {!pureObsMode && (
      <div className="bg-[#12141f]/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-3 text-xs shadow-md">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Title & Stats */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#fe2c55] to-tiktok-cyan flex items-center justify-center p-[1px] shadow-glow-magenta/40">
              <div className="w-full h-full bg-[#11131f] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-tiktok-cyan animate-spin" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight">
                  🐾 Sân Thú Cưng MochiBunny
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-tiktok-cyan/15 text-tiktok-cyan border border-tiktok-cyan/30">
                  {visiblePets.length} / {totalPetsCount || activePets.length} Bé
                </span>
              </div>
              <p className="text-[10px] text-gray-400 hidden sm:block">
                Hệ thống 10 Tộc Thần Thú × 6 Bậc Tiến Hóa (60 Hình Thái) · Hỗ trợ Gacha & Lệnh Chat (`!dragon`, `!unicorn`, `!fox`, `!panda`, `!gacha`)
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Background Mode Selector */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setBgMode('meadow')}
                title="🌅 Thảo Nguyên Sáng"
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  bgMode === 'meadow'
                    ? 'bg-emerald-500 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌅 Sáng
              </button>
              <button
                type="button"
                onClick={() => setBgMode('sakura')}
                title="🌸 Vườn Sakura"
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  bgMode === 'sakura'
                    ? 'bg-pink-500 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌸 Sakura
              </button>
              <button
                type="button"
                onClick={() => setBgMode('galaxy')}
                title="🌌 Đêm Ngân Hà"
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  bgMode === 'galaxy'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌌 Ngân Hà
              </button>
              <button
                type="button"
                onClick={() => setBgMode('chroma')}
                title="🟩 Phông Xanh Chroma Key (Để tách nền OBS)"
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  bgMode === 'chroma'
                    ? 'bg-green-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🟩 Chroma
              </button>
              <button
                type="button"
                onClick={() => setBgMode('transparent')}
                title="🏁 Nền Trong Suốt (OBS Browser Source đè lên camera)"
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  bgMode === 'transparent'
                    ? 'bg-tiktok-magenta text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🏁 Alpha
              </button>
            </div>

            {/* Aspect Ratio Switch */}
            {!isFullScreen && (
              <div className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16-9')}
                  title="Tỷ lệ ngang 16:9"
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                    aspectRatio === '16-9'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  16:9
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9-16')}
                  title="Tỷ lệ dọc TikTok 9:16"
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                    aspectRatio === '9-16'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  9:16
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('full')}
                  title="Khung rộng tự do"
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                    aspectRatio === 'full'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Rộng
                </button>
              </div>
            )}

            {/* OBS URL Builder Button (Zerody-style obs.html link generator) */}
            <button
              type="button"
              onClick={() => {
                if (streamUsername) setObsUsernameInput(streamUsername);
                setShowObsBuilder(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-tiktok-magenta/20 border border-tiktok-magenta/50 text-white hover:bg-tiktok-magenta/35 font-bold text-[11px] shadow-sm transition"
            >
              <Tv className="w-3.5 h-3.5 text-tiktok-cyan" />
              <span>🎥 Lấy Link OBS</span>
            </button>

            {/* Compendium Button (60 Forms Pokédex) */}
            <button
              type="button"
              onClick={() => setShowCompendium(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 border border-amber-400/40 text-amber-300 hover:text-white hover:border-amber-300 font-bold text-[11px] shadow-sm transition"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>📖 Bách Khoa 60 Thú</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
              className={`p-2 rounded-xl border transition ${
                soundEnabled
                  ? 'bg-tiktok-cyan/15 border-tiktok-cyan/40 text-tiktok-cyan'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Max Pets Limit */}
            <select
              value={maxVisiblePets}
              onChange={(e) => setMaxVisiblePets(Number(e.target.value))}
              title="Số lượng thú tối đa trên sân"
              className="bg-white/[0.05] border border-white/10 rounded-xl px-2 py-1 text-[11px] text-gray-200 focus:outline-none focus:border-tiktok-cyan cursor-pointer"
            >
              <option value={8} className="bg-[#12141f]">8 Thú</option>
              <option value={16} className="bg-[#12141f]">16 Thú</option>
              <option value={24} className="bg-[#12141f]">24 Thú</option>
            </select>

            {/* Fullscreen Toggle */}
            {onToggleFullScreen && (
              <button
                type="button"
                onClick={onToggleFullScreen}
                title={isFullScreen ? 'Thu nhỏ giao diện' : 'Toàn màn hình OBS'}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Toggle controls accordion */}
            <button
              type="button"
              onClick={() => setShowControls(!showControls)}
              title={showControls ? 'Thu gọn thanh test tương tác' : 'Mở rộng thanh test tương tác'}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition"
            >
              {showControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Test Bar Buttons ("⚡ Test Nuôi Thú") */}
        {showControls && (
          <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Test Tương Tác Sân Cỏ:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleTestSpawn}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 font-medium active:scale-95 transition"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ Viewer Mới</span>
              </button>

              <button
                type="button"
                onClick={handleTestChat}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 font-medium active:scale-95 transition"
              >
                <MessageCircle className="w-3 h-3" />
                <span>💬 Test Chat Bubble</span>
              </button>

              <button
                type="button"
                onClick={handleTestLike}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fe2c55]/20 text-[#fe2c55] border border-[#fe2c55]/30 hover:bg-[#fe2c55]/30 font-medium active:scale-95 transition"
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>❤️ +50 Tim</span>
              </button>

              <button
                type="button"
                onClick={handleTestGift}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-medium active:scale-95 transition"
              >
                <Gift className="w-3 h-3" />
                <span>🎁 Tặng Quà Cấp Cao</span>
              </button>

              <button
                type="button"
                onClick={handleTestGacha}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 font-bold active:scale-95 transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>🎲 Gacha Đổi Thú (!gacha)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSummonSpecies('dragon')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-bold active:scale-95 transition"
              >
                <span>🐉 +Thần Long UR</span>
              </button>

              <button
                type="button"
                onClick={() => handleSummonSpecies('unicorn')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold active:scale-95 transition"
              >
                <span>🦄 +Kỳ Lân UR</span>
              </button>

              <button
                type="button"
                onClick={() => handleSummonSpecies('fox')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 font-bold active:scale-95 transition"
              >
                <span>🦊 +Hồ Ly SSR</span>
              </button>

              <button
                type="button"
                onClick={() => handleSummonSpecies('panda')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 font-bold active:scale-95 transition"
              >
                <span>🐼 +Gấu Trúc SSR</span>
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* =========================================================================
          Playground Canvas (Sân Cỏ Nuôi Thú 2.5D / Pure Frameless OBS Canvas)
          ========================================================================= */}
      <div
        style={{
          ...(customBgColor ? { backgroundColor: customBgColor, backgroundImage: 'none' } : {}),
          ...(customFontColor ? { color: customFontColor } : {}),
          ...(customFontSize ? { fontSize: customFontSize } : {}),
        }}
        className={`relative overflow-hidden ${
          pureObsMode ? 'w-screen h-screen border-0 rounded-none' : 'rounded-2xl border border-white/10'
        } ${getContainerAspectClass()} ${getBackgroundClass()} transition-all duration-300 select-none`}
      >
        {/* Visual Environment Details based on theme */}
        {bgMode === 'meadow' && (
          <>
            {/* Sun & Clouds */}
            <div className="absolute top-4 left-10 w-16 h-16 rounded-full bg-yellow-200/80 blur-md pointer-events-none" />
            <div className="absolute top-8 right-20 w-32 h-10 bg-white/60 rounded-full blur-sm pointer-events-none" />
            <div className="absolute top-16 left-32 w-24 h-8 bg-white/50 rounded-full blur-sm pointer-events-none" />
            {/* Rolling Hills Background SVG */}
            <svg
              className="absolute bottom-0 left-0 w-full h-48 pointer-events-none opacity-90"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,180 C300,120 500,240 800,160 C1000,100 1150,190 1200,170 L1200,300 L0,300 Z"
                fill="#8cd976"
              />
              <path
                d="M0,210 C200,170 450,260 750,190 C950,140 1100,220 1200,200 L1200,300 L0,300 Z"
                fill="#6ebf59"
              />
              <path
                d="M0,250 C350,220 650,270 1200,230 L1200,300 L0,300 Z"
                fill="#59ad45"
              />
            </svg>
          </>
        )}

        {bgMode === 'sakura' && (
          <>
            {/* Sakura Petals and Hills */}
            <svg
              className="absolute bottom-0 left-0 w-full h-48 pointer-events-none opacity-85"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,190 C350,130 550,230 850,170 C1050,120 1150,180 1200,170 L1200,300 L0,300 Z"
                fill="#fca5a5"
              />
              <path
                d="M0,230 C250,190 500,260 800,200 C1000,160 1100,230 1200,210 L1200,300 L0,300 Z"
                fill="#f87171"
              />
            </svg>
          </>
        )}

        {bgMode === 'galaxy' && (
          <>
            {/* Distant Stars & Nebula */}
            <div className="absolute top-10 left-12 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <div className="absolute top-24 left-1/3 w-1 h-1 rounded-full bg-tiktok-cyan animate-pulse" />
            <div className="absolute top-16 right-1/4 w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            <div className="absolute top-8 right-16 w-12 h-12 rounded-full border-2 border-amber-200/40 bg-amber-100/10 shadow-[0_0_20px_rgba(251,191,36,0.3)] pointer-events-none" />
            {/* Dark alien meadow */}
            <svg
              className="absolute bottom-0 left-0 w-full h-44 pointer-events-none opacity-70"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,200 C300,150 600,250 900,180 C1100,130 1150,210 1200,190 L1200,300 L0,300 Z"
                fill="#241747"
              />
              <path
                d="M0,240 C350,200 650,260 1200,220 L1200,300 L0,300 Z"
                fill="#160e30"
              />
            </svg>
          </>
        )}

        {/* Top-Left: Hall of Fame (Top 3 High Level Pets) */}
        {topPets.length > 0 && bgMode !== 'chroma' && showRankHud && (
          <div className="absolute top-3 left-3 z-30 max-w-[200px] pointer-events-auto">
            <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-lg">
              <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-white/10 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Top Thần Thú</span>
              </div>
              <div className="space-y-1">
                {topPets.map((p, idx) => (
                  <div
                    key={p.uniqueId}
                    onClick={() => setSelectedPet(p)}
                    className="flex items-center justify-between gap-1.5 hover:bg-white/10 p-1 rounded-lg cursor-pointer transition"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-amber-400 shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold truncate text-white max-w-[90px]">
                        {p.nickname || p.uniqueId}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 shrink-0">
                      Lv.{p.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top-Center: Community Energy / Fever Boss Bar */}
        {bgMode !== 'chroma' && showFeverHud && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[230px] sm:w-[290px] pointer-events-none">
            <div
              className={`px-3 py-1.5 rounded-2xl backdrop-blur-md border shadow-xl transition-all duration-500 ${
                isFeverActive
                  ? 'bg-gradient-to-r from-amber-600/80 via-rose-600/80 to-purple-700/80 border-yellow-300 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                  : 'bg-black/65 border-white/15'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold text-white mb-1">
                <span className="flex items-center gap-1">
                  <Zap className={`w-3 h-3 ${isFeverActive ? 'text-yellow-300 animate-bounce' : 'text-amber-400'}`} />
                  {isFeverActive ? '🔥 ĐẠI TIỆC LINH KHÍ (FEVER)!' : `⚡ Tụ Linh Đàn · Tầng ${feverTier}`}
                </span>
                <span className="font-mono text-[9px] text-amber-200">
                  {currentFeverPoints}/{feverCycle}
                </span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/20">
                <div
                  className={`h-full transition-all duration-500 ${
                    isFeverActive
                      ? 'bg-gradient-to-r from-yellow-300 via-rose-400 to-cyan-300 animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 via-rose-500 to-tiktok-cyan'
                  }`}
                  style={{ width: `${Math.max(8, feverPct)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Top-Right: Quick Livestream Interactive Guide */}
        {bgMode !== 'chroma' && showGuideHud && (
          <div className="absolute top-3 right-3 z-30 max-w-[245px] pointer-events-none hidden lg:block">
            <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-lg text-[10px] leading-relaxed">
              <div className="flex items-center gap-1 font-bold text-tiktok-cyan mb-0.5">
                <HelpCircle className="w-3 h-3" />
                <span>Lệnh Chat & Nuôi Thần Thú</span>
              </div>
              <p className="text-gray-300">
                🎲 Chat <strong>!gacha</strong> = Quay Thú Mới<br />
                🐉 Chat <strong>!dragon !unicorn !fox !panda</strong> = Đổi Tộc<br />
                ❤️ <strong>Tim & 🎁 Quà</strong> = Tiến Hóa 60 Hình Thái!
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            Active Evolution Celebration Banner
            ========================================================================= */}
        {activeEvolution && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in zoom-in-95 duration-500">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-purple-600/90 backdrop-blur-md text-white border-2 border-yellow-300 shadow-[0_0_35px_rgba(251,191,36,0.8)] text-center flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0">
                <CuteBunnyArt
                  species={activeEvolution.species}
                  stage={getStageForSpeciesLevel(activeEvolution.species, activeEvolution.level)}
                  actionState="evolving"
                  size="sm"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-amber-200 uppercase">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  CHÚC MỪNG TIẾN HÓA THẦN THÚ!
                </div>
                <div className="text-sm font-black text-white">
                  @{activeEvolution.nickname || activeEvolution.uniqueId} đã đạt cấp {activeEvolution.level}
                </div>
                <div className="text-xs text-amber-100 font-semibold">
                  {activeEvolution.previousStageName} ➔{' '}
                  <span className="text-yellow-300 underline font-black">
                    {activeEvolution.newStageName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            Pet Actors on 2.5D Playground
            ========================================================================= */}
        {visiblePets.length === 0 ? (
          pureObsMode ? null : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-tiktok-cyan animate-bounce" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1 drop-shadow-md">
                Sân Thú Cưng Đang Sẵn Sàng
              </h4>
              <p className="text-xs text-gray-200/90 max-w-sm drop-shadow">
                Bấm nút <strong>"+ Viewer Mới"</strong> hoặc kết nối phiên TikTok Live để khán giả xuất hiện và nuôi dưỡng thú cưng trực tiếp!
              </p>
            </div>
          )
        ) : (
          visiblePets.map((pet) => {
            const stage = getStageForSpeciesLevel(pet.species, pet.level);
            const isChatActive =
              pet.lastChat && now - pet.lastChat.timestamp < 7000;
            const isInteractionActive =
              pet.lastInteraction &&
              now - pet.lastInteraction.timestamp < 2600;

            // Autonomous walk state or fallback to server coordinates
            const walkState = walkStates[pet.uniqueId];
            const posX = Math.min(92, Math.max(8, walkState?.x ?? pet.position?.x ?? 50));
            const posY = Math.min(88, Math.max(52, walkState?.y ?? pet.position?.y ?? 68));
            const isWalking = Boolean(walkState?.isWalking && !isChatActive && pet.actionState === 'idle');
            const walkDuration = walkState?.durationMs ?? 2400;
            const facing = walkState?.facing ?? 'right';
            const zIndexVal = Math.floor(posY * 10) + (isChatActive ? 200 : 0);

            return (
              <div
                key={pet.uniqueId}
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: zIndexVal,
                  transition: `left ${walkDuration}ms ease-in-out, top ${walkDuration}ms ease-in-out`,
                }}
                className="absolute flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  setSelectedPet(pet);
                  soundEngine.playPetSound(pet.species);
                }}
              >
                {/* 1. Speech Bubble (when user chats) */}
                {isChatActive && pet.lastChat && (
                  <div className="absolute -top-16 z-50 pointer-events-none animate-in fade-in zoom-in-75 duration-300 min-w-[120px] max-w-[220px]">
                    <div className="relative bg-white/95 text-gray-900 border-2 border-indigo-500/80 rounded-2xl px-3 py-1.5 shadow-2xl text-center">
                      <p className="text-xs font-bold leading-snug break-words">
                        {pet.lastChat.text}
                      </p>
                      {/* Triangle pointer downward to pet head */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
                    </div>
                  </div>
                )}

                {/* 2. Floating Food / Hearts / EXP Toss Effect */}
                {isInteractionActive && pet.lastInteraction && (
                  <div className="absolute -top-14 z-40 pointer-events-none flex flex-col items-center animate-float-up">
                    {pet.lastInteraction.foodId && (
                      <FoodSvgIcon
                        foodId={pet.lastInteraction.foodId}
                        className="w-10 h-10 animate-food-toss drop-shadow-lg"
                      />
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide bg-amber-400 text-black border border-white/60 shadow-lg whitespace-nowrap">
                      {pet.lastInteraction.label}
                    </span>
                    {pet.lastInteraction.subtext && (
                      <span className="text-[9px] font-bold text-white drop-shadow-md">
                        {pet.lastInteraction.subtext}
                      </span>
                    )}
                  </div>
                )}

                {/* 3. SVG Pet Avatar */}
                <div
                  className={`relative transition-transform duration-200 group-hover:scale-110 active:scale-95 ${
                    isWalking ? 'animate-pet-walk' : ''
                  }`}
                >
                  <CuteBunnyArt
                    customId={pet.uniqueId}
                    species={pet.species}
                    stage={stage}
                    actionState={pet.actionState}
                    size="md"
                    lookOffset={{
                      x: isWalking ? (facing === 'left' ? -0.85 : 0.85) : facing === 'left' ? -0.25 : 0.25,
                      y: isWalking ? 0.15 : 0,
                    }}
                  />
                </div>

                {/* 4. Viewer Nameplate, Rarity Badge & Level Bar under Pet */}
                <div className="mt-[-4px] flex flex-col items-center pointer-events-none">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/25 text-white shadow-md">
                    {topPets[0]?.uniqueId === pet.uniqueId && (
                      <span className="text-[10px]" title="Top 1 Thần Thú">👑</span>
                    )}
                    {SPECIES_GAMIFICATION_META[pet.species] && (
                      <span
                        className={`px-1 rounded text-[7px] font-black tracking-tighter text-white bg-gradient-to-r ${SPECIES_GAMIFICATION_META[pet.species].badgeBg}`}
                      >
                        {SPECIES_GAMIFICATION_META[pet.species].rarityTier}
                      </span>
                    )}
                    {pet.avatarUrl ? (
                      <img
                        src={pet.avatarUrl}
                        alt={pet.nickname}
                        className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-white/40"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-[8px] font-bold flex items-center justify-center">
                        {(pet.nickname || pet.uniqueId).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[10px] font-bold truncate max-w-[80px]">
                      {pet.nickname || pet.uniqueId}
                    </span>
                    <span className="px-1 rounded text-[8px] font-mono font-black bg-amber-400 text-black">
                      Lv.{pet.level}
                    </span>
                  </div>

                  {/* Stage Name & Mini EXP Progress Bar */}
                  <div className="w-20 mt-0.5 flex flex-col items-center">
                    <span className="text-[8px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-[80px]">
                      {stage.name}
                    </span>
                    <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden border border-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-tiktok-cyan transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((pet.exp || 0) / (pet.expRequired || 100)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          Pet Detail Modal / Inspector
          ========================================================================= */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141f] border border-white/15 rounded-2xl w-full max-w-sm p-5 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedPet(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1 shrink-0">
                <CuteBunnyArt
                  species={selectedPet.species}
                  stage={getStageForSpeciesLevel(selectedPet.species, selectedPet.level)}
                  actionState="happy"
                  size="sm"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-bold text-white truncate">
                    {selectedPet.nickname || selectedPet.uniqueId}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-400 text-black">
                    Lv.{selectedPet.level}
                  </span>
                </div>
                <p className="text-xs text-tiktok-cyan font-semibold">
                  {SPECIES_CONFIGS[selectedPet.species]?.speciesName} · {getStageForSpeciesLevel(selectedPet.species, selectedPet.level).name}
                </p>
                <p className="text-[10px] text-gray-400">@{selectedPet.uniqueId}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 leading-relaxed mb-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              {getStageForSpeciesLevel(selectedPet.species, selectedPet.level).description}
            </p>

            {/* Stats contribution grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="text-[10px] text-gray-400">Kim Cương</div>
                <div className="text-xs font-mono font-bold text-amber-400">
                  {selectedPet.totalDiamonds?.toLocaleString() || 0} 💎
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="text-[10px] text-gray-400">Lượt Thích</div>
                <div className="text-xs font-mono font-bold text-[#fe2c55]">
                  {selectedPet.totalLikes?.toLocaleString() || 0} ❤️
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="text-[10px] text-gray-400">Bình Luận</div>
                <div className="text-xs font-mono font-bold text-indigo-400">
                  {selectedPet.totalComments?.toLocaleString() || 0} 💬
                </div>
              </div>
            </div>

            {/* EXP Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Tiến trình lên cấp:</span>
                <span className="font-mono font-semibold">
                  {selectedPet.exp} / {selectedPet.expRequired} EXP
                </span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-tiktok-cyan transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        ((selectedPet.exp || 0) /
                          (selectedPet.expRequired || 100)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPetSound(selectedPet.species);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-tiktok-cyan/20 text-tiktok-cyan border border-tiktok-cyan/40 hover:bg-tiktok-cyan/30 active:scale-95 transition"
              >
                🐾 Vuốt Ve Thú
              </button>
              <button
                type="button"
                onClick={() => setSelectedPet(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          Bách Khoa Toàn Thư 10 Tộc Thú (60 Hình Thái Tiến Hóa) Modal
          ========================================================================= */}
      {showCompendium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12141f] border border-white/15 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Bách Khoa Toàn Thư 10 Tộc Thần Thú · 60 Hình Thái Tiến Hóa
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Khán giả trên TikTok Live có thể gõ lệnh chat (VD: <code className="text-amber-300 font-mono">!dragon</code>, <code className="text-cyan-300 font-mono">!unicorn</code>, <code className="text-pink-300 font-mono">!fox</code>, <code className="text-emerald-300 font-mono">!panda</code>, <code className="text-purple-300 font-mono">!gacha</code>) để triệu hồi!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCompendium(false)}
                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Species Tabs */}
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2 overflow-x-auto bg-black/20">
              {SPECIES_ORDER.map((spId) => {
                const cfg = SPECIES_CONFIGS[spId];
                const meta = SPECIES_GAMIFICATION_META[spId];
                const isSelected = compendiumSpecies === spId;
                return (
                  <button
                    key={spId}
                    type="button"
                    onClick={() => {
                      setCompendiumSpecies(spId);
                      soundEngine.playPetSound(spId);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition ${
                      isSelected
                        ? 'bg-white/15 border-amber-400 text-white shadow-md scale-105'
                        : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{meta.emoji}</span>
                    <span>{cfg.defaultPetName}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-black text-white bg-gradient-to-r ${meta.badgeBg}`}
                    >
                      {meta.rarityTier}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Species Banner + Summon Action */}
            <div className="px-5 py-3 bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-rose-950/40 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-white">
                    {SPECIES_CONFIGS[compendiumSpecies].speciesName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r ${SPECIES_GAMIFICATION_META[compendiumSpecies].badgeBg}`}
                  >
                    Hạng {SPECIES_GAMIFICATION_META[compendiumSpecies].rarityTier} · {SPECIES_GAMIFICATION_META[compendiumSpecies].rarityLabel} ({SPECIES_GAMIFICATION_META[compendiumSpecies].expBonus})
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-amber-300 border border-amber-400/30">
                    Lệnh Chat: {SPECIES_GAMIFICATION_META[compendiumSpecies].chatCmd}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  {SPECIES_CONFIGS[compendiumSpecies].shortDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleSummonSpecies(compendiumSpecies);
                  setShowCompendium(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                ⚡ Triệu Hồi {SPECIES_CONFIGS[compendiumSpecies].defaultPetName} Ra Sân Ngay
              </button>
            </div>

            {/* 6 Evolution Stages Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SPECIES_CONFIGS[compendiumSpecies].stages.map((st) => (
                <div
                  key={st.id}
                  onClick={() => soundEngine.playPetSound(compendiumSpecies)}
                  className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 p-4 flex flex-col items-center text-center cursor-pointer transition group"
                >
                  <div className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-amber-300 font-mono">
                      Bậc {st.id} · Lv.{st.minLevel}+
                    </span>
                    <span className="text-tiktok-cyan font-mono">
                      Charm {st.charmBase}
                    </span>
                  </div>
                  <div className="my-1 group-hover:scale-105 transition-transform">
                    <CuteBunnyArt
                      customId={`compendium-${compendiumSpecies}-${st.id}`}
                      species={compendiumSpecies}
                      stage={st}
                      actionState="idle"
                      size="md"
                    />
                  </div>
                  <h4 className="text-sm font-black text-white mt-1">
                    {st.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-amber-300/90 mb-1.5">
                    {st.visualFeature}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                    {st.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OBS Overlay URL Generator Modal (Zerody obs.html style)
          ========================================================================= */}
      {showObsBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#12141f] border border-white/15 rounded-2xl w-full max-w-xl p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Tv className="w-5 h-5 text-tiktok-cyan" />
                <div>
                  <h3 className="text-base font-black text-white">
                    Trình Tạo Link OBS Overlay Độc Lập (obs.html)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Chỉ hiển thị thuần lớp Overlay (không có thanh menu web, nền trong suốt 100%, tự động kết nối kênh)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowObsBuilder(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  1. Tài khoản TikTok LIVE (hoặc gõ <code className="text-tiktok-cyan">demo</code> để tự chạy giả lập):
                </label>
                <input
                  type="text"
                  value={obsUsernameInput}
                  onChange={(e) => setObsUsernameInput(e.target.value)}
                  placeholder="VD: huyga.official hoặc https://www.tiktok.com/@huyga.official/live"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-tiktok-cyan font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  2. Phông nền Overlay trên OBS:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(
                    [
                      { id: 'transparent', label: '🏁 Trong Suốt' },
                      { id: 'meadow', label: '🌅 Thảo Nguyên' },
                      { id: 'sakura', label: '🌸 Sakura' },
                      { id: 'galaxy', label: '🌌 Ngân Hà' },
                      { id: 'chroma', label: '🟩 Phông Xanh' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setObsBgInput(opt.id)}
                      className={`px-2 py-1.5 rounded-xl font-bold text-[11px] border transition ${
                        obsBgInput === opt.id
                          ? 'bg-tiktok-cyan/20 border-tiktok-cyan text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  3. Tuỳ chọn các bảng HUD phụ trên màn hình:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={obsShowRank}
                      onChange={(e) => setObsShowRank(e.target.checked)}
                      className="accent-tiktok-cyan"
                    />
                    <span>👑 Top Thần Thú</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={obsShowFever}
                      onChange={(e) => setObsShowFever(e.target.checked)}
                      className="accent-tiktok-cyan"
                    />
                    <span>⚡ Thanh Fever</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={obsShowGuide}
                      onChange={(e) => setObsShowGuide(e.target.checked)}
                      className="accent-tiktok-cyan"
                    />
                    <span>💬 Bảng Lệnh Chat</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-amber-300 font-bold mb-1">
                  🔗 URL gắn vào OBS Browser Source:
                </label>
                <div className="p-2.5 rounded-xl bg-black/70 border border-amber-400/30 font-mono text-[11px] text-tiktok-cyan break-all select-all">
                  {generatedObsUrl}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedObsUrl);
                  setObsCopied(true);
                  setTimeout(() => setObsCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-tiktok-cyan to-emerald-400 text-black hover:brightness-110 active:scale-95 transition"
              >
                {obsCopied ? '✓ Đã Copy Link OBS!' : '📋 Copy Link OBS'}
              </button>
              <a
                href={generatedObsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition"
              >
                ↗ Mở Xem Thử Tab Mới
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
