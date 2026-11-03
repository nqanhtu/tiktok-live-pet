import React, { useEffect, useState } from 'react';
import { EvolutionStage, PetSpeciesId } from '../../data/bunnyData';

export type BunnyActionState =
  | 'idle'
  | 'eating'
  | 'happy'
  | 'playing'
  | 'sleeping'
  | 'hungry'
  | 'evolving';

interface CuteBunnyArtProps {
  customId?: string;
  species?: PetSpeciesId;
  stage: EvolutionStage;
  actionState: BunnyActionState;
  fullness?: number;
  happiness?: number;
  onClickBunny?: (zone: 'head' | 'belly' | 'paws', e: React.MouseEvent) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  lookOffset?: { x: number; y: number };
}

export const CuteBunnyArt: React.FC<CuteBunnyArtProps> = ({
  customId,
  species = 'bunny',
  stage,
  actionState,
  fullness = 85,
  happiness = 90,
  onClickBunny,
  size = 'lg',
  lookOffset = { x: 0, y: 0 },
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (size === 'xs') return;
    let timeoutId: number;
    const intervalId = window.setInterval(() => {
      setIsBlinking(true);
      timeoutId = window.setTimeout(() => setIsBlinking(false), 160);
    }, 3400 + Math.floor(Math.random() * 1400));

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [size]);

  const { colors, id: stageId, gear = {} } = stage;
  const patternColor = colors.patternColor || '#451A03';

  const getBodyAnimationClass = () => {
    switch (actionState) {
      case 'eating':
        return 'animate-bunny-chew';
      case 'happy':
      case 'playing':
        return 'animate-bunny-bounce';
      case 'evolving':
        return 'animate-evolve';
      default:
        return 'animate-bunny-breathe';
    }
  };

  const isHungry = actionState === 'hungry' || (fullness < 25 && actionState === 'idle');
  const isHappyEyes =
    actionState === 'happy' || actionState === 'eating' || actionState === 'playing';
  const isSleeping = actionState === 'sleeping';

  const pupilX = Math.max(-3.5, Math.min(3.5, lookOffset.x * 3.5));
  const pupilY = Math.max(-2.5, Math.min(2.5, lookOffset.y * 2.5));

  const safeId = (customId || 'pet').replace(/[^a-zA-Z0-9_-]/g, '');
  const uid = `${safeId}-${species}-stage-${stageId}-${size}`;

  const containerSizeClass =
    size === 'lg'
      ? 'w-72 h-80 sm:w-80 sm:h-88 cursor-pointer group'
      : size === 'md'
      ? 'w-32 h-36 sm:w-36 sm:h-40 cursor-pointer group'
      : size === 'sm'
      ? 'w-24 h-28 cursor-pointer group'
      : 'w-14 h-14';

  return (
    <div
      className={`relative select-none flex items-center justify-center transition-transform duration-300 ${containerSizeClass}`}
      style={{
        transform: size === 'lg' || size === 'md' ? `scale(${stage.scale})` : 'scale(1)',
      }}
    >
      {/* Ambient Stage Aura */}
      {size !== 'xs' && (
        <div
          className="absolute rounded-full pointer-events-none animate-aura-pulse"
          style={{
            width: size === 'lg' ? '240px' : size === 'md' ? '125px' : '92px',
            height: size === 'lg' ? '240px' : size === 'md' ? '125px' : '92px',
            background: `radial-gradient(circle, ${colors.auraColor} 0%, rgba(255,255,255,0) 72%)`,
          }}
        />
      )}

      {/* Sleeping Zzz Bubbles */}
      {isSleeping && (
        <div className="absolute -top-4 right-4 pointer-events-none flex flex-col items-center">
          <span className="font-display font-bold text-indigo-400 text-sm animate-sleep-z">
            Zzz...
          </span>
        </div>
      )}

      {/* Main SVG Pet */}
      <svg
        viewBox="0 0 280 300"
        fill="none"
        className={`w-full h-full overflow-visible ${getBodyAnimationClass()}`}
        role="img"
        aria-label={stage.name}
      >
        <defs>
          <radialGradient id={`bodyGrad-${uid}`} cx="45%" cy="38%" r="60%">
            <stop offset="0%" stopColor={colors.bodyPrimary} />
            <stop offset="100%" stopColor={colors.bodySecondary} />
          </radialGradient>

          <linearGradient id={`cosmicGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          <linearGradient id={`fireGrad-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="55%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          <linearGradient id={`goldGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="140" cy="272" rx="68" ry="14" fill="rgba(15, 23, 42, 0.22)" />

        {/* ==================== 1. AURA GEAR (BACKGROUND HALOS & ELEMENTAL EFFECTS) ==================== */}
        {gear.aura === 'star_halo' && (
          <g>
            <circle
              cx="140"
              cy="155"
              r="102"
              stroke="#38BDF8"
              strokeWidth="2.2"
              strokeDasharray="8 6"
              strokeOpacity="0.75"
            />
            <circle cx="38" cy="155" r="5.5" fill="#FDE047" />
            <circle cx="242" cy="155" r="5.5" fill="#38BDF8" />
            <path
              d="M140 38L143 47L152 50L143 53L140 62L137 53L128 50L137 47L140 38Z"
              fill="#FDE047"
            />
          </g>
        )}

        {gear.aura === 'sun_mirror' && (
          <g>
            <circle
              cx="140"
              cy="155"
              r="96"
              stroke="#EA580C"
              strokeWidth="5"
              strokeOpacity="0.8"
            />
            <circle
              cx="140"
              cy="155"
              r="106"
              stroke="#FACC15"
              strokeWidth="2.5"
              strokeDasharray="12 8"
            />
            <path d="M140 42L132 58H148L140 42Z" fill="#EF4444" />
            <path d="M40 120L56 114L52 128L40 120Z" fill="#F97316" />
            <path d="M240 120L224 114L228 128L240 120Z" fill="#F97316" />
            <path d="M44 190L60 184L56 198L44 190Z" fill="#EF4444" />
            <path d="M236 190L220 184L224 198L236 190Z" fill="#EF4444" />
          </g>
        )}

        {gear.aura === 'water_bubbles' && (
          <g>
            <circle cx="48" cy="180" r="10" fill="#CCFBF1" fillOpacity="0.6" stroke="#2DD4BF" strokeWidth="2" />
            <circle cx="45" cy="177" r="3" fill="#FFFFFF" />
            <circle cx="228" cy="145" r="13" fill="#CCFBF1" fillOpacity="0.6" stroke="#2DD4BF" strokeWidth="2" />
            <circle cx="224" cy="141" r="3.5" fill="#FFFFFF" />
            <circle cx="62" cy="115" r="7" fill="#CCFBF1" fillOpacity="0.6" stroke="#2DD4BF" strokeWidth="1.8" />
            <circle cx="218" cy="205" r="8" fill="#CCFBF1" fillOpacity="0.6" stroke="#2DD4BF" strokeWidth="1.8" />
          </g>
        )}

        {gear.aura === 'spirit_orbs' && (
          <g>
            {[
              { cx: 42, cy: 140, c: '#F472B6' },
              { cx: 64, cy: 76, c: '#C084FC' },
              { cx: 140, cy: 48, c: '#38BDF8' },
              { cx: 216, cy: 76, c: '#C084FC' },
              { cx: 238, cy: 140, c: '#F472B6' },
            ].map((orb, idx) => (
              <g key={idx}>
                <circle cx={orb.cx} cy={orb.cy} r="10" fill={orb.c} fillOpacity="0.35" />
                <path
                  d={`M${orb.cx - 6} ${orb.cy + 2}C${orb.cx - 6} ${orb.cy - 6} ${orb.cx} ${orb.cy - 12} ${orb.cx} ${orb.cy - 14}C${orb.cx} ${orb.cy - 12} ${orb.cx + 6} ${orb.cy - 6} ${orb.cx + 6} ${orb.cy + 2}C${orb.cx + 6} ${orb.cy + 6} ${orb.cx - 6} ${orb.cy + 6} ${orb.cx - 6} ${orb.cy + 2}Z`}
                  fill={orb.c}
                />
                <circle cx={orb.cx} cy={orb.cy + 2} r="3" fill="#FFFFFF" />
              </g>
            ))}
          </g>
        )}

        {gear.aura === 'lightning_sparks' && (
          <g>
            <path
              d="M48 110L34 132H48L38 156L62 128H47L58 110H48Z"
              fill="#FACC15"
              stroke="#4F46E5"
              strokeWidth="1.8"
            />
            <path
              d="M230 116L216 138H230L220 162L244 134H229L240 116H230Z"
              fill="#FACC15"
              stroke="#4F46E5"
              strokeWidth="1.8"
            />
            <path
              d="M72 64L62 82H73L66 98L84 76H73L80 64H72Z"
              fill="#38BDF8"
              stroke="#312E81"
              strokeWidth="1.5"
            />
          </g>
        )}

        {gear.aura === 'fire_ring' && (
          <g>
            <circle
              cx="140"
              cy="168"
              r="94"
              stroke="#EF4444"
              strokeWidth="4"
              strokeDasharray="16 8"
              strokeOpacity="0.7"
            />
            <path
              d="M42 185C34 165 44 150 48 138C52 154 60 165 54 185Z"
              fill={`url(#fireGrad-${uid})`}
            />
            <path
              d="M238 185C246 165 236 150 232 138C228 154 220 165 226 185Z"
              fill={`url(#fireGrad-${uid})`}
            />
          </g>
        )}

        {gear.aura === 'bagua_halo' && (
          <g>
            <polygon
              points="140,46 218,78 250,156 218,234 140,266 62,234 30,156 62,78"
              stroke="#10B981"
              strokeWidth="2.8"
              fill="rgba(16, 185, 129, 0.06)"
            />
            <circle cx="140" cy="156" r="96" stroke="#FACC15" strokeWidth="2" strokeDasharray="6 6" />
          </g>
        )}

        {gear.aura === 'eclipse_halo' && (
          <g>
            <circle cx="140" cy="152" r="102" fill="rgba(192, 38, 211, 0.14)" />
            <circle cx="140" cy="152" r="94" stroke="#F97316" strokeWidth="3.5" />
            <circle cx="140" cy="152" r="88" stroke="#1E1B4B" strokeWidth="6" />
          </g>
        )}

        {gear.aura === 'portal_ring' && (
          <g>
            <ellipse
              cx="140"
              cy="160"
              rx="104"
              ry="88"
              stroke="#10B981"
              strokeWidth="3"
              strokeDasharray="14 6"
            />
            <ellipse
              cx="140"
              cy="160"
              rx="92"
              ry="102"
              stroke="#FACC15"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </g>
        )}

        {/* ==================== 2. BACK GEAR (WINGS, NINE TAILS, JETPACK, BANNERS, BLADES) ==================== */}
        {gear.back === 'fairy_wings' && (
          <g>
            <g className="animate-wing-left" style={{ transformOrigin: '95px 190px' }}>
              <path
                d="M95 190C46 140 20 165 36 196C22 212 42 238 72 226L95 212Z"
                fill="#FBCFE8"
                fillOpacity="0.8"
                stroke="#DB2777"
                strokeWidth="2.5"
              />
              <circle cx="52" cy="182" r="6" fill="#FEF08A" fillOpacity="0.7" />
            </g>
            <g className="animate-wing-right" style={{ transformOrigin: '185px 190px' }}>
              <path
                d="M185 190C234 140 260 165 244 196C258 212 238 238 208 226L185 212Z"
                fill="#FBCFE8"
                fillOpacity="0.8"
                stroke="#DB2777"
                strokeWidth="2.5"
              />
              <circle cx="228" cy="182" r="6" fill="#FEF08A" fillOpacity="0.7" />
            </g>
          </g>
        )}

        {gear.back === 'celestial_ribbon' && (
          <path
            d="M52 225C26 175 48 110 88 96C116 86 164 86 192 96C232 110 254 175 228 225"
            stroke="#C084FC"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        )}

        {(gear.back === 'cosmic_wings' ||
          gear.back === 'seraph_wings' ||
          gear.back === 'fire_wings' ||
          gear.back === 'ice_wings' ||
          gear.back === 'prism_wings') && (
          <g>
            <g className="animate-wing-left" style={{ transformOrigin: '95px 195px' }}>
              <path
                d="M95 195C48 156 20 172 30 202C36 220 60 222 44 236C56 248 82 238 96 220Z"
                fill={
                  gear.back === 'cosmic_wings'
                    ? `url(#cosmicGrad-${uid})`
                    : gear.back === 'fire_wings'
                    ? `url(#fireGrad-${uid})`
                    : gear.back === 'ice_wings'
                    ? '#BAE6FD'
                    : gear.back === 'prism_wings'
                    ? '#F9A8D4'
                    : '#FFFFFF'
                }
                stroke={
                  gear.back === 'fire_wings'
                    ? '#B91C1C'
                    : gear.back === 'ice_wings'
                    ? '#0284C7'
                    : gear.back === 'prism_wings'
                    ? '#DB2777'
                    : '#94A3B8'
                }
                strokeWidth="2.5"
              />
            </g>
            <g className="animate-wing-right" style={{ transformOrigin: '185px 195px' }}>
              <path
                d="M185 195C232 156 260 172 250 202C244 220 220 222 236 236C224 248 198 238 184 220Z"
                fill={
                  gear.back === 'cosmic_wings'
                    ? `url(#cosmicGrad-${uid})`
                    : gear.back === 'fire_wings'
                    ? `url(#fireGrad-${uid})`
                    : gear.back === 'ice_wings'
                    ? '#BAE6FD'
                    : gear.back === 'prism_wings'
                    ? '#F9A8D4'
                    : '#FFFFFF'
                }
                stroke={
                  gear.back === 'fire_wings'
                    ? '#B91C1C'
                    : gear.back === 'ice_wings'
                    ? '#0284C7'
                    : gear.back === 'prism_wings'
                    ? '#DB2777'
                    : '#94A3B8'
                }
                strokeWidth="2.5"
              />
            </g>
          </g>
        )}

        {gear.back === 'shuriken_scroll' && (
          <g>
            <rect
              x="54"
              y="165"
              width="172"
              height="22"
              rx="8"
              transform="rotate(-18 140 176)"
              fill="#DC2626"
              stroke="#1E293B"
              strokeWidth="2.8"
            />
            <polygon
              points="218,142 246,134 228,158"
              fill="#64748B"
              stroke="#0F172A"
              strokeWidth="2.2"
            />
            <polygon
              points="62,142 34,134 52,158"
              fill="#64748B"
              stroke="#0F172A"
              strokeWidth="2.2"
            />
          </g>
        )}

        {gear.back === 'jetpack' && (
          <g>
            <rect
              x="52"
              y="182"
              width="24"
              height="48"
              rx="8"
              fill="#475569"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <path d="M56 230L64 256L72 230Z" fill="#22D3EE" />
            <rect
              x="204"
              y="182"
              width="24"
              height="48"
              rx="8"
              fill="#475569"
              stroke="#0F172A"
              strokeWidth="2.5"
            />
            <path d="M208 230L216 256L224 230Z" fill="#22D3EE" />
          </g>
        )}

        {gear.back === 'battle_banners' && (
          <g>
            <line x1="68" y1="220" x2="48" y2="85" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <polygon points="48,90 82,102 74,155 42,145" fill="#DC2626" stroke="#FACC15" strokeWidth="2" />
            <circle cx="62" cy="122" r="6" fill="#FACC15" />

            <line x1="212" y1="220" x2="232" y2="85" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <polygon points="232,90 198,102 206,155 238,145" fill="#DC2626" stroke="#FACC15" strokeWidth="2" />
            <circle cx="218" cy="122" r="6" fill="#FACC15" />
          </g>
        )}

        {gear.back === 'vampire_cloak' && (
          <g>
            <path
              d="M90 190L32 162L46 196L30 216L66 218L88 225Z"
              fill="#1E293B"
              stroke="#E11D48"
              strokeWidth="2.2"
            />
            <path
              d="M190 190L248 162L234 196L250 216L214 218L192 225Z"
              fill="#1E293B"
              stroke="#E11D48"
              strokeWidth="2.2"
            />
            <path
              d="M66 185L52 128L100 150L180 150L228 128L214 185Z"
              fill="#9F1239"
              stroke="#1E293B"
              strokeWidth="3"
            />
          </g>
        )}

        {gear.back === 'nine_tails' && (
          <g>
            {[-58, -40, -24, -10, 10, 24, 40, 58].map((angle, i) => (
              <g
                key={i}
                transform={`rotate(${angle} 140 220)`}
              >
                <path
                  d="M140 220C124 150 128 96 140 72C152 96 156 150 140 220Z"
                  fill="#F5D0FE"
                  stroke="#C026D3"
                  strokeWidth="2.5"
                />
                <circle cx="140" cy="84" r="4" fill="#FFFFFF" />
              </g>
            ))}
          </g>
        )}

        {gear.back === 'gear_wings' && (
          <g>
            <circle
              cx="56"
              cy="195"
              r="28"
              fill="#F59E0B"
              stroke="#78350F"
              strokeWidth="4"
              strokeDasharray="10 6"
            />
            <circle cx="56" cy="195" r="10" fill="#78350F" />
            <circle
              cx="224"
              cy="195"
              r="28"
              fill="#F59E0B"
              stroke="#78350F"
              strokeWidth="4"
              strokeDasharray="10 6"
            />
            <circle cx="224" cy="195" r="10" fill="#78350F" />
          </g>
        )}

        {gear.back === 'dual_blades' && (
          <g>
            <line
              x1="44"
              y1="95"
              x2="225"
              y2="245"
              stroke="#4ADE80"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="236"
              y1="95"
              x2="55"
              y2="245"
              stroke="#4ADE80"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        )}
        {/* ==================== 3. SPECIES-SPECIFIC TAILS ==================== */}
        <g className="animate-tail-wag" style={{ transformOrigin: '192px 236px' }}>
          {species === 'bunny' && (
            <>
              <circle
                cx="204"
                cy="236"
                r={stageId >= 3 ? '20' : '15'}
                fill={stageId === 6 ? `url(#cosmicGrad-${uid})` : colors.bodyPrimary}
                stroke="#334155"
                strokeWidth="3"
              />
              {stageId >= 3 && (
                <circle cx="210" cy="231" r="6" fill="#FFFFFF" fillOpacity="0.6" />
              )}
            </>
          )}

          {species === 'dog' && (
            <g>
              <path
                d="M188 236C212 236 228 214 218 194C210 178 190 186 194 202C196 210 206 208 204 202"
                fill={colors.bodySecondary}
                stroke="#334155"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="206" cy="194" r="7" fill="#FFFFFF" fillOpacity="0.85" />
            </g>
          )}

          {species === 'cat' && gear.back !== 'nine_tails' && (
            <path
              d="M190 242C220 242 232 214 224 190C218 172 234 160 240 172"
              stroke={colors.bodySecondary}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {species === 'tiger' && (
            <g>
              <path
                d="M190 240C222 240 236 212 228 184"
                stroke="#334155"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M190 240C222 240 236 212 228 184"
                stroke={colors.bodySecondary}
                strokeWidth="13"
                strokeLinecap="round"
              />
              <path d="M214 230L224 234" stroke={patternColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M224 214L234 216" stroke={patternColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M224 197L234 197" stroke={patternColor} strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}

          {species === 'lion' && (
            <g>
              <path
                d="M190 242C218 242 230 220 228 196"
                stroke="#334155"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M190 242C218 242 230 220 228 196"
                stroke={colors.bodySecondary}
                strokeWidth="7.5"
                strokeLinecap="round"
              />
              <path
                d="M228 198C218 188 220 172 230 168C240 172 242 188 228 198Z"
                fill={patternColor}
                stroke="#334155"
                strokeWidth="2.8"
              />
            </g>
          )}

          {species === 'leopard' && (
            <g>
              <path
                d="M190 242C224 242 240 212 232 180"
                stroke="#334155"
                strokeWidth="17"
                strokeLinecap="round"
              />
              <path
                d="M190 242C224 242 240 212 232 180"
                stroke={colors.bodySecondary}
                strokeWidth="12"
                strokeLinecap="round"
              />
              <circle cx="218" cy="232" r="2.6" fill={patternColor} />
              <circle cx="230" cy="214" r="2.6" fill={patternColor} />
              <circle cx="233" cy="194" r="2.6" fill={patternColor} />
            </g>
          )}
        </g>

        {/* ==================== 4. LION MANE (DYNAMIC COLOR PER EVOLUTION) ==================== */}
        {species === 'lion' && (
          <g
            onClick={(e) => {
              e.stopPropagation();
              onClickBunny?.('head', e);
            }}
          >
            <path
              d="M140 66
                 C154 58, 170 64, 176 76
                 C190 74, 204 84, 204 98
                 C218 104, 226 118, 220 132
                 C230 144, 230 160, 218 170
                 C222 184, 212 198, 198 200
                 C192 212, 176 218, 162 212
                 C150 220, 130 220, 118 212
                 C104 218, 88 212, 82 200
                 C68 198, 58 184, 62 170
                 C50 160, 50 144, 60 132
                 C54 118, 62 104, 76 98
                 C76 84, 90 74, 104 76
                 C110 64, 126 58, 140 66Z"
              fill={patternColor}
              stroke="#334155"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
            <circle cx="140" cy="144" r="68" fill={colors.earInner} fillOpacity="0.35" />
          </g>
        )}

        {/* ==================== 5. SPECIES-SPECIFIC EARS ==================== */}
        {species === 'bunny' && (
          <>
            <g
              className="animate-ear-left"
              style={{ transformOrigin: '112px 115px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              {stageId === 1 || isHungry ? (
                <g>
                  <path
                    d="M114 115C98 86 66 92 58 124C52 146 66 158 80 148C92 138 100 124 114 115Z"
                    fill={`url(#bodyGrad-${uid})`}
                    stroke="#334155"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M104 118C92 98 72 104 67 124C64 136 73 142 82 135"
                    fill={colors.earInner}
                    fillOpacity="0.65"
                  />
                </g>
              ) : (
                <g>
                  <path
                    d="M100 120C84 68 86 24 104 20C122 16 128 64 122 116Z"
                    fill={`url(#bodyGrad-${uid})`}
                    stroke="#334155"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M105 110C94 70 96 36 105 33C115 30 119 66 115 108Z"
                    fill={stageId === 6 ? `url(#cosmicGrad-${uid})` : colors.earInner}
                    fillOpacity="0.82"
                  />
                </g>
              )}
            </g>

            <g
              className="animate-ear-right"
              style={{ transformOrigin: '168px 115px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              <path
                d={
                  stageId === 1
                    ? 'M156 116C152 76 160 40 175 42C190 44 190 80 176 120Z'
                    : 'M158 116C152 64 158 16 176 20C194 24 196 68 180 120Z'
                }
                fill={`url(#bodyGrad-${uid})`}
                stroke="#334155"
                strokeWidth="3.2"
              />
              <path
                d={
                  stageId === 1
                    ? 'M162 108C159 78 164 52 173 53C182 54 181 80 171 110Z'
                    : 'M165 108C161 66 165 30 175 33C184 36 186 70 175 110Z'
                }
                fill={stageId === 6 ? `url(#cosmicGrad-${uid})` : colors.earInner}
                fillOpacity="0.82"
              />
            </g>
          </>
        )}

        {species === 'dog' && (
          <>
            <g
              className="animate-ear-left"
              style={{ transformOrigin: '96px 110px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              {stageId === 1 ? (
                <path
                  d="M104 102C82 82 58 96 64 122C68 136 86 130 98 116Z"
                  fill={patternColor}
                  stroke="#334155"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
              ) : (
                <g>
                  <path
                    d="M82 122L72 64C72 58 80 56 86 60L122 100Z"
                    fill={`url(#bodyGrad-${uid})`}
                    stroke="#334155"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M87 112L80 72L112 100Z"
                    fill={colors.earInner}
                    fillOpacity="0.8"
                  />
                </g>
              )}
            </g>
            <g
              className="animate-ear-right"
              style={{ transformOrigin: '184px 110px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              <path
                d="M198 122L208 64C208 58 200 56 194 60L158 100Z"
                fill={`url(#bodyGrad-${uid})`}
                stroke="#334155"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="M193 112L200 72L168 100Z"
                fill={colors.earInner}
                fillOpacity="0.8"
              />
            </g>
          </>
        )}

        {species === 'cat' && (
          <>
            <g
              className="animate-ear-left"
              style={{ transformOrigin: '96px 112px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              <path
                d="M78 128L66 58L124 98Z"
                fill={`url(#bodyGrad-${uid})`}
                stroke="#334155"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path d="M84 118L75 70L114 98Z" fill={colors.earInner} fillOpacity="0.82" />
            </g>
            <g
              className="animate-ear-right"
              style={{ transformOrigin: '184px 112px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              <path
                d="M202 128L214 58L156 98Z"
                fill={`url(#bodyGrad-${uid})`}
                stroke="#334155"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path d="M196 118L205 70L166 98Z" fill={colors.earInner} fillOpacity="0.82" />
            </g>
          </>
        )}

        {(species === 'tiger' || species === 'lion' || species === 'leopard') && (
          <>
            <g
              className="animate-ear-left"
              style={{ transformOrigin: '92px 106px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              <circle
                cx="86"
                cy="94"
                r="24"
                fill={`url(#bodyGrad-${uid})`}
                stroke="#334155"
                strokeWidth="3.2"
              />
              <circle cx="86" cy="94" r="13" fill={colors.earInner} fillOpacity="0.85" />
            </g>
            <g
              className="animate-ear-right"
              style={{ transformOrigin: '188px 106px' }}
              onClick={(e) => {
                e.stopPropagation();
                onClickBunny?.('head', e);
              }}
            >
              <circle
                cx="194"
                cy="94"
                r="24"
                fill={`url(#bodyGrad-${uid})`}
                stroke="#334155"
                strokeWidth="3.2"
              />
              <circle cx="194" cy="94" r="13" fill={colors.earInner} fillOpacity="0.85" />
            </g>
          </>
        )}

        {/* ==================== 6. LOWER CHUBBY BODY (BELLY ZONE) ==================== */}
        <g
          onClick={(e) => {
            e.stopPropagation();
            onClickBunny?.('belly', e);
          }}
        >
          <path
            d="M84 210C80 245 96 268 140 268C184 268 200 245 196 210C192 182 172 172 140 172C108 172 88 182 84 210Z"
            fill={`url(#bodyGrad-${uid})`}
            stroke="#334155"
            strokeWidth="3.2"
          />

          {species === 'tiger' && (
            <g>
              <path d="M84 214L100 218" stroke={patternColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M83 228L98 230" stroke={patternColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M196 214L180 218" stroke={patternColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M197 228L182 230" stroke={patternColor} strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {species === 'leopard' && (
            <g>
              <circle cx="95" cy="218" r="5" fill={colors.earInner} stroke={patternColor} strokeWidth="2.2" />
              <circle cx="92" cy="236" r="4" fill={colors.earInner} stroke={patternColor} strokeWidth="2" />
              <circle cx="185" cy="218" r="5" fill={colors.earInner} stroke={patternColor} strokeWidth="2.2" />
              <circle cx="188" cy="236" r="4" fill={colors.earInner} stroke={patternColor} strokeWidth="2" />
            </g>
          )}

          {species === 'dog' && stageId === 6 && (
            <g>
              <path d="M86 220Q98 210 96 232" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M194 220Q182 210 184 232" stroke="#EA580C" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}

          <ellipse cx="140" cy="226" rx="34" ry="28" fill="#FFFFFF" fillOpacity="0.82" />
        </g>

        {/* FEET / HIND PAWS */}
        <g
          onClick={(e) => {
            e.stopPropagation();
            onClickBunny?.('paws', e);
          }}
        >
          <ellipse
            cx="104"
            cy="265"
            rx="22"
            ry="12"
            fill={colors.bodyPrimary}
            stroke="#334155"
            strokeWidth="3"
          />
          <ellipse cx="104" cy="266" rx="9" ry="5" fill={colors.earInner} fillOpacity="0.65" />

          <ellipse
            cx="176"
            cy="265"
            rx="22"
            ry="12"
            fill={colors.bodyPrimary}
            stroke="#334155"
            strokeWidth="3"
          />
          <ellipse cx="176" cy="266" rx="9" ry="5" fill={colors.earInner} fillOpacity="0.65" />
        </g>

        {/* ==================== 7. HEAD / CHEEKS / FACE GROUP ==================== */}
        <g
          onClick={(e) => {
            e.stopPropagation();
            onClickBunny?.('head', e);
          }}
        >
          <path
            d="M76 154C72 114 98 92 140 92C182 92 208 114 204 154C208 178 188 198 140 198C92 198 72 178 76 154Z"
            fill={`url(#bodyGrad-${uid})`}
            stroke="#334155"
            strokeWidth="3.2"
          />

          {species === 'dog' && (
            <g>
              <path
                d="M84 162C84 144 106 142 140 142C174 142 196 144 196 162C196 184 176 196 140 196C104 196 84 184 84 162Z"
                fill="#FFFFFF"
                fillOpacity="0.82"
              />
              <ellipse cx="114" cy="124" rx="6.5" ry="4" fill="#FFFFFF" stroke={patternColor} strokeWidth="1.5" />
              <ellipse cx="166" cy="124" rx="6.5" ry="4" fill="#FFFFFF" stroke={patternColor} strokeWidth="1.5" />
            </g>
          )}

          {species === 'cat' && (
            <g>
              <path d="M140 96V112" stroke={patternColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M128 99L131 111" stroke={patternColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M152 99L149 111" stroke={patternColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M66 152L86 155" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M64 162L85 162" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M67 172L86 168" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M214 152L194 155" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M216 162L195 162" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M213 172L194 168" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          )}

          {species === 'tiger' && (
            <g>
              <ellipse cx="140" cy="166" rx="26" ry="18" fill="#FFFFFF" fillOpacity="0.88" />
              <path d="M128 104H152" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M131 112H149" stroke={patternColor} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M134 120H146" stroke={patternColor} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M140 104V121" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M75 148L90 151" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M74 158L88 159" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M77 168L90 166" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M205 148L190 151" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M206 158L192 159" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
              <path d="M203 168L190 166" stroke={patternColor} strokeWidth="3.8" strokeLinecap="round" />
            </g>
          )}

          {species === 'lion' && (
            <g>
              <ellipse cx="140" cy="165" rx="25" ry="17" fill="#FFFFFF" fillOpacity="0.85" />
              <path d="M70 156L86 158" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M70 165L86 164" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M210 156L194 158" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M210 165L194 164" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {species === 'leopard' && (
            <g>
              <ellipse cx="140" cy="166" rx="24" ry="16" fill="#FFFFFF" fillOpacity="0.85" />
              <circle cx="140" cy="108" r="5" fill={colors.earInner} stroke={patternColor} strokeWidth="2.2" />
              <circle cx="122" cy="112" r="3.8" fill={colors.earInner} stroke={patternColor} strokeWidth="2" />
              <circle cx="158" cy="112" r="3.8" fill={colors.earInner} stroke={patternColor} strokeWidth="2" />
              <circle cx="88" cy="138" r="4" fill={colors.earInner} stroke={patternColor} strokeWidth="2" />
              <circle cx="192" cy="138" r="4" fill={colors.earInner} stroke={patternColor} strokeWidth="2" />
              <path d="M68 156L86 158" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M68 165L86 164" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M212 156L194 158" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M212 165L194 164" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          <ellipse
            cx="96"
            cy="162"
            rx={actionState === 'eating' ? '14' : '11'}
            ry={actionState === 'eating' ? '9' : '7'}
            fill={colors.cheekColor}
            fillOpacity={happiness > 60 ? '0.55' : '0.35'}
          />
          <ellipse
            cx="184"
            cy="162"
            rx={actionState === 'eating' ? '14' : '11'}
            ry={actionState === 'eating' ? '9' : '7'}
            fill={colors.cheekColor}
            fillOpacity={happiness > 60 ? '0.55' : '0.35'}
          />

          {/* EYES */}
          {isSleeping ? (
            <g>
              <path d="M102 146Q112 154 122 146" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M158 146Q168 154 178 146" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
            </g>
          ) : isHappyEyes ? (
            <g>
              <path d="M102 149Q112 135 122 149" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M158 149Q168 135 178 149" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : isBlinking ? (
            <g>
              <line x1="102" y1="146" x2="122" y2="146" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="158" y1="146" x2="178" y2="146" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <ellipse cx={112 + pupilX} cy={145 + pupilY} rx="9.5" ry="11" fill={colors.eyeColor} />
              <circle cx={109 + pupilX} cy={141 + pupilY} r="3.8" fill="#FFFFFF" />
              <circle cx={115 + pupilX} cy={149 + pupilY} r="1.8" fill="#FFFFFF" />

              <ellipse cx={168 + pupilX} cy={145 + pupilY} rx="9.5" ry="11" fill={colors.eyeColor} />
              <circle cx={165 + pupilX} cy={141 + pupilY} r="3.8" fill="#FFFFFF" />
              <circle cx={171 + pupilX} cy={149 + pupilY} r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* NOSE & MOUTH */}
          {species === 'dog' ? (
            <ellipse cx="140" cy="153" rx="6" ry="4.2" fill="#1E293B" />
          ) : species === 'tiger' || species === 'lion' || species === 'leopard' ? (
            <path
              d="M134 152H146L140 159Z"
              fill="#F43F5E"
              stroke="#334155"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          ) : (
            <ellipse cx="140" cy="154" rx="4.5" ry="3.2" fill="#FB7185" />
          )}

          {actionState === 'eating' ? (
            <g>
              <path
                d="M131 160C131 171 149 171 149 160Z"
                fill="#F43F5E"
                stroke="#334155"
                strokeWidth="2.4"
              />
              {species === 'bunny' ? (
                <rect x="137" y="160" width="6" height="4.5" rx="1" fill="#FFFFFF" />
              ) : (
                <>
                  <path d="M133 160L135 164L137 160Z" fill="#FFFFFF" />
                  <path d="M143 160L145 164L147 160Z" fill="#FFFFFF" />
                </>
              )}
            </g>
          ) : (
            <g>
              {(species === 'dog' || isHappyEyes) && gear.face !== 'ninja_mask' && gear.face !== 'milk_bone' && (
                <path
                  d="M136 162C136 170 144 170 144 162Z"
                  fill="#FB7185"
                  stroke="#334155"
                  strokeWidth="2"
                />
              )}
              <path
                d="M131 161Q135.5 166 140 160Q144.5 166 149 161"
                stroke="#334155"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* ==================== 8. FACE GEAR ==================== */}
          {gear.face === 'milk_bone' && actionState !== 'eating' && (
            <g transform="rotate(-6 140 165)">
              <rect x="122" y="161" width="36" height="8" rx="3" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
              <circle cx="121" cy="161" r="5" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
              <circle cx="121" cy="169" r="5" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
              <circle cx="159" cy="161" r="5" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
              <circle cx="159" cy="169" r="5" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
            </g>
          )}

          {gear.face === 'monocle' && (
            <g>
              <circle
                cx="168"
                cy="145"
                r="15"
                fill="rgba(254, 240, 138, 0.2)"
                stroke="#D97706"
                strokeWidth="3"
              />
              <path
                d="M182 150Q188 168 180 182"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="3 2"
                fill="none"
              />
            </g>
          )}

          {gear.face === 'eyepatch' && (
            <g>
              <line x1="82" y1="126" x2="198" y2="156" stroke="#0F172A" strokeWidth="3" />
              <ellipse cx="168" cy="145" rx="14" ry="13" fill="#0F172A" stroke="#475569" strokeWidth="2" />
            </g>
          )}

          {gear.face === 'cyber_visor' && (
            <g>
              <path
                d="M88 134H192L184 156H150L140 148L130 156H96L88 134Z"
                fill="#06B6D4"
                fillOpacity="0.82"
                stroke="#083344"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <line x1="98" y1="140" x2="132" y2="140" stroke="#CFFAFE" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {gear.face === 'star_glasses' && (
            <g>
              <polygon
                points="112,126 117,138 130,138 120,146 124,158 112,150 100,158 104,146 94,138 107,138"
                fill="#EC4899"
                fillOpacity="0.85"
                stroke="#FEF08A"
                strokeWidth="2.5"
              />
              <polygon
                points="168,126 173,138 186,138 176,146 180,158 168,150 156,158 160,146 150,138 163,138"
                fill="#EC4899"
                fillOpacity="0.85"
                stroke="#FEF08A"
                strokeWidth="2.5"
              />
              <line x1="126" y1="142" x2="154" y2="142" stroke="#FEF08A" strokeWidth="3" />
            </g>
          )}

          {gear.face === 'ninja_mask' && (
            <path
              d="M80 156Q140 146 200 156C198 184 178 198 140 198C102 198 82 184 80 156Z"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="2.8"
            />
          )}

          {/* ==================== 9. HEAD GEAR ==================== */}
          {gear.head === 'sprout' && (
            <g>
              <path d="M140 93V74" stroke="#15803D" strokeWidth="3.2" strokeLinecap="round" />
              <path
                d="M140 76C130 68 120 72 123 80C126 86 136 83 140 76Z"
                fill="#22C55E"
                stroke="#15803D"
                strokeWidth="2"
              />
              <path
                d="M140 74C149 66 159 70 156 78C153 84 144 81 140 74Z"
                fill="#4ADE80"
                stroke="#15803D"
                strokeWidth="2"
              />
            </g>
          )}

          {gear.head === 'chef_hat' && (
            <g>
              <path
                d="M108 94C96 82 102 62 118 64C126 50 154 50 162 64C178 62 184 82 172 94Z"
                fill="#FFFFFF"
                stroke="#334155"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <rect x="108" y="88" width="64" height="10" rx="3" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />
            </g>
          )}

          {gear.head === 'sakura_crown' && (
            <g>
              <circle cx="116" cy="96" r="9" fill="#FBB6CE" stroke="#DB2777" strokeWidth="2" />
              <circle cx="116" cy="96" r="3" fill="#FEF08A" />
              <circle cx="140" cy="91" r="11" fill="#F472B6" stroke="#BE185D" strokeWidth="2" />
              <circle cx="140" cy="91" r="3.8" fill="#FEF08A" />
              <circle cx="164" cy="96" r="9" fill="#FBB6CE" stroke="#DB2777" strokeWidth="2" />
              <circle cx="164" cy="96" r="3" fill="#FEF08A" />
            </g>
          )}

          {gear.head === 'witch_hat' && (
            <g>
              <ellipse
                cx="140"
                cy="94"
                rx="46"
                ry="11"
                fill="#115E59"
                stroke="#042F2E"
                strokeWidth="2.8"
              />
              <path
                d="M108 92C116 56 134 32 158 26C154 46 158 68 172 92Z"
                fill="#0D9488"
                stroke="#042F2E"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path d="M111 89Q140 96 169 89" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
              <circle cx="140" cy="91" r="4.5" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
            </g>
          )}

          {gear.head === 'moon_tiara' && (
            <g>
              <path
                d="M108 98Q140 82 172 98L164 84L140 72L116 84Z"
                fill="#E9D5FF"
                stroke="#6B21A8"
                strokeWidth="2.5"
              />
              <circle cx="140" cy="84" r="6" fill="#FDE047" stroke="#9333EA" strokeWidth="1.8" />
            </g>
          )}

          {gear.head === 'royal_crown' && (
            <g>
              <path
                d="M114 95L108 66L126 80L140 58L154 80L172 66L166 95Z"
                fill={`url(#goldGrad-${uid})`}
                stroke="#92400E"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              <circle cx="140" cy="82" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="122" cy="85" r="3" fill="#F43F5E" />
              <circle cx="158" cy="85" r="3" fill="#F43F5E" />
            </g>
          )}

          {gear.head === 'detective_cap' && (
            <g>
              <path
                d="M96 96C98 68 120 58 140 58C160 58 182 68 184 96Z"
                fill="#B45309"
                stroke="#451A03"
                strokeWidth="2.8"
              />
              <path d="M90 96Q140 104 190 96" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
              <line x1="140" y1="58" x2="140" y2="96" stroke="#78350F" strokeWidth="2" />
            </g>
          )}

          {gear.head === 'ninja_headband' && (
            <g>
              <path
                d="M84 114Q140 122 196 114L194 102Q140 110 86 102Z"
                fill="#1E293B"
                stroke="#0F172A"
                strokeWidth="2.2"
              />
              <rect
                x="120"
                y="103"
                width="40"
                height="13"
                rx="3"
                fill="#CBD5E1"
                stroke="#334155"
                strokeWidth="2"
              />
            </g>
          )}

          {gear.head === 'samurai_helm' && (
            <g>
              <path
                d="M92 98C96 68 118 58 140 58C162 58 184 68 188 98Z"
                fill="#991B1B"
                stroke="#450A0A"
                strokeWidth="2.8"
              />
              <path
                d="M140 86C116 82 96 62 92 42C106 56 122 70 140 74C158 70 174 56 188 42C184 62 164 82 140 86Z"
                fill="#FACC15"
                stroke="#92400E"
                strokeWidth="2.2"
              />
              <circle cx="140" cy="80" r="6" fill="#EF4444" stroke="#FDE047" strokeWidth="2" />
            </g>
          )}

          {gear.head === 'pirate_hat' && (
            <g>
              <path
                d="M84 96L106 58L140 52L174 58L196 96Q140 106 84 96Z"
                fill="#1E293B"
                stroke="#FACC15"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="140" cy="78" r="7" fill="#FFFFFF" />
            </g>
          )}

          {gear.head === 'shell_crown' && (
            <g>
              <path
                d="M114 96C114 74 128 64 140 64C152 64 166 74 166 96Z"
                fill="#F472B6"
                stroke="#9D174D"
                strokeWidth="2.4"
              />
              <circle cx="140" cy="88" r="6" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
              <circle cx="112" cy="94" r="5" fill="#2DD4BF" />
              <circle cx="168" cy="94" r="5" fill="#2DD4BF" />
            </g>
          )}

          {gear.head === 'pharaoh_nemes' && (
            <g>
              <path
                d="M96 98L108 62H172L184 98Z"
                fill="#FACC15"
                stroke="#0284C7"
                strokeWidth="3"
              />
              <line x1="122" y1="62" x2="116" y2="98" stroke="#0284C7" strokeWidth="4" />
              <line x1="158" y1="62" x2="164" y2="98" stroke="#0284C7" strokeWidth="4" />
              <circle cx="140" cy="78" r="6" fill="#EF4444" stroke="#FEF08A" strokeWidth="2" />
            </g>
          )}

          {gear.head === 'kungfu_band' && (
            <g>
              <path
                d="M84 112Q140 120 196 112L194 102Q140 110 86 102Z"
                fill="#DC2626"
                stroke="#7F1D1D"
                strokeWidth="2"
              />
              <path
                d="M194 106C212 98 226 104 234 114"
                stroke="#DC2626"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
          )}

          {gear.head === 'lightning_horn' && (
            <polygon
              points="132,94 144,46 142,72 154,70 136,96"
              fill="#FACC15"
              stroke="#4F46E5"
              strokeWidth="2.5"
            />
          )}

          {gear.head === 'flame_crest' && (
            <path
              d="M120 94C118 72 132 58 140 44C148 58 162 72 160 94Z"
              fill={`url(#fireGrad-${uid})`}
              stroke="#991B1B"
              strokeWidth="2.2"
            />
          )}

          {gear.head === 'ice_crown' && (
            <polygon
              points="110,95 116,66 130,82 140,50 150,82 164,66 170,95"
              fill="#BAE6FD"
              stroke="#0284C7"
              strokeWidth="2.5"
            />
          )}

          {gear.head === 'dragon_horns' && (
            <g>
              <path
                d="M118 94C108 72 96 56 104 42C114 52 122 68 128 92"
                fill="#FACC15"
                stroke="#047857"
                strokeWidth="2.5"
              />
              <path
                d="M162 94C172 72 184 56 176 42C166 52 158 68 152 92"
                fill="#FACC15"
                stroke="#047857"
                strokeWidth="2.5"
              />
            </g>
          )}

          {gear.head === 'antlers' && (
            <g>
              <path
                d="M118 92C106 70 92 60 88 44M104 68L92 64M110 58L114 44"
                stroke="#78350F"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M162 92C174 70 188 60 192 44M176 68L188 64M170 58L166 44"
                stroke="#78350F"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="88" cy="44" r="4.5" fill="#22C55E" />
              <circle cx="192" cy="44" r="4.5" fill="#22C55E" />
            </g>
          )}

          {gear.head === 'viking_helm' && (
            <g>
              <path
                d="M100 84C76 78 66 56 76 42C82 56 92 68 106 72"
                fill="#FEF3C7"
                stroke="#334155"
                strokeWidth="2.6"
              />
              <path
                d="M180 84C204 78 214 56 204 42C198 56 188 68 174 72"
                fill="#FEF3C7"
                stroke="#334155"
                strokeWidth="2.6"
              />
              <path
                d="M98 96C102 68 120 60 140 60C160 60 178 68 182 96Z"
                fill="#64748B"
                stroke="#1E293B"
                strokeWidth="2.8"
              />
            </g>
          )}

          {gear.head === 'aviator_goggles' && (
            <g>
              <path
                d="M94 104Q140 94 186 104"
                stroke="#78350F"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="120" cy="98" r="12" fill="#38BDF8" stroke="#D97706" strokeWidth="3.5" />
              <circle cx="160" cy="98" r="12" fill="#38BDF8" stroke="#D97706" strokeWidth="3.5" />
            </g>
          )}

          {gear.head === 'steampunk_hat' && (
            <g>
              <ellipse cx="140" cy="94" rx="42" ry="8" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
              <rect
                x="112"
                y="52"
                width="56"
                height="42"
                rx="4"
                fill="#92400E"
                stroke="#451A03"
                strokeWidth="2.8"
              />
              <circle cx="152" cy="76" r="9" fill="#FACC15" stroke="#451A03" strokeWidth="2" />
            </g>
          )}

          {gear.head === 'crystal_tiara' && (
            <g>
              <polygon
                points="114,95 122,70 132,84 140,56 148,84 158,70 166,95"
                fill="#38BDF8"
                stroke="#0369A1"
                strokeWidth="2.4"
              />
              <circle cx="140" cy="82" r="4.5" fill="#F472B6" />
            </g>
          )}
        </g>

        {/* ==================== 10. NECK GEAR ==================== */}
        {gear.neck === 'scarf' && (
          <g>
            <path
              d="M96 188Q140 204 184 188C188 196 182 206 170 207Q140 214 110 207C98 206 92 196 96 188Z"
              fill="#EA580C"
              stroke="#7C2D12"
              strokeWidth="2.6"
            />
            <path
              d="M152 202L162 232L176 228L168 200Z"
              fill="#DC2626"
              stroke="#7C2D12"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </g>
        )}

        {gear.neck === 'bow_tie' && (
          <g>
            <polygon
              points="140,196 118,186 118,206"
              fill="#E11D48"
              stroke="#881337"
              strokeWidth="2.2"
            />
            <polygon
              points="140,196 162,186 162,206"
              fill="#E11D48"
              stroke="#881337"
              strokeWidth="2.2"
            />
            <circle cx="140" cy="196" r="5" fill="#FECDD3" stroke="#881337" strokeWidth="2" />
          </g>
        )}

        {gear.neck === 'bell_collar' && (
          <g>
            <path
              d="M100 190Q140 204 180 190"
              stroke="#DC2626"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="140" cy="200" r="8" fill="#FACC15" stroke="#92400E" strokeWidth="2.2" />
            <circle cx="140" cy="202" r="2.2" fill="#78350F" />
          </g>
        )}

        {gear.neck === 'egypt_collar' && (
          <g>
            <path
              d="M92 188Q140 216 188 188L180 206Q140 228 100 206Z"
              fill="#FACC15"
              stroke="#0284C7"
              strokeWidth="2.8"
            />
            <circle cx="140" cy="204" r="5" fill="#0284C7" />
            <circle cx="120" cy="200" r="4" fill="#EF4444" />
            <circle cx="160" cy="200" r="4" fill="#EF4444" />
          </g>
        )}

        {gear.neck === 'royal_brooch' && (
          <g>
            <path
              d="M104 192Q140 206 176 192"
              stroke="#FACC15"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx="140"
              cy="199"
              r="7"
              fill={colors.accentColor}
              stroke="#FDE047"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* ==================== 11. FRONT PAWS ==================== */}
        <g
          onClick={(e) => {
            e.stopPropagation();
            onClickBunny?.('paws', e);
          }}
        >
          {actionState === 'eating' ? (
            <>
              <ellipse
                cx="120"
                cy="182"
                rx="13"
                ry="10"
                transform="rotate(-25 120 182)"
                fill={colors.bodyPrimary}
                stroke="#334155"
                strokeWidth="3"
              />
              <ellipse
                cx="160"
                cy="182"
                rx="13"
                ry="10"
                transform="rotate(25 160 182)"
                fill={colors.bodyPrimary}
                stroke="#334155"
                strokeWidth="3"
              />
            </>
          ) : (
            <>
              <ellipse
                cx="108"
                cy="208"
                rx="13"
                ry="16"
                transform="rotate(-15 108 208)"
                fill={colors.bodyPrimary}
                stroke="#334155"
                strokeWidth="3"
              />
              <ellipse
                cx="172"
                cy="208"
                rx="13"
                ry="16"
                transform="rotate(15 172 208)"
                fill={colors.bodyPrimary}
                stroke="#334155"
                strokeWidth="3"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
