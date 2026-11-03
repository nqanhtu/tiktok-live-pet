import React from 'react';
import {
  Users,
  TrendingUp,
  Heart,
  Gem,
  MessageCircle,
  Share2,
  LogIn,
  Zap,
} from 'lucide-react';
import { KpiMetrics } from '../types';

interface KpiGridProps {
  kpis: KpiMetrics;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + 'M';
    }
    return (num || 0).toLocaleString('vi-VN');
  };

  const cards = [
    {
      id: 'ccu',
      title: 'Người xem hiện tại (CCU)',
      value: formatNumber(kpis.viewerCount),
      subLabel: 'Kỷ lục (Peak):',
      subValue: `${formatNumber(kpis.peakViewerCount)} CCU`,
      icon: Users,
      accentColor: 'text-tiktok-cyan',
      borderColor: 'border-tiktok-cyan/30',
      glowColor: 'shadow-glow-cyan',
      bgGlow: 'from-tiktok-cyan/15 to-transparent',
      highlightBadge: kpis.viewerCount > 0 ? 'REALTIME' : null,
    },
    {
      id: 'likes',
      title: 'Tổng lượt Thích (Likes)',
      value: formatNumber(kpis.totalLikes),
      subLabel: 'Tốc độ thích:',
      subValue: `+${formatNumber(kpis.likesPerMinute)} / phút`,
      icon: Heart,
      accentColor: 'text-tiktok-magenta',
      borderColor: 'border-tiktok-magenta/30',
      glowColor: 'shadow-glow-magenta',
      bgGlow: 'from-[#fe2c55]/15 to-transparent',
      highlightBadge: kpis.likesPerMinute > 0 ? 'HOT' : null,
    },
    {
      id: 'diamonds',
      title: 'Doanh thu Quà tặng (Diamonds)',
      value: `${formatNumber(kpis.totalDiamonds)} 💎`,
      subLabel: `~ $${(kpis.estimatedUsd || 0).toFixed(2)} USD`,
      subValue: `(${formatNumber(kpis.totalGifts)} quà)`,
      icon: Gem,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-400/30',
      glowColor: 'shadow-[0_0_20px_-3px_rgba(251,191,36,0.35)]',
      bgGlow: 'from-amber-400/15 to-transparent',
      highlightBadge: kpis.totalDiamonds > 0 ? 'REVENUE' : null,
    },
    {
      id: 'comments',
      title: 'Tổng Bình luận (Comments)',
      value: formatNumber(kpis.totalComments),
      subLabel: 'Tốc độ chat:',
      subValue: `+${formatNumber(kpis.commentsPerMinute)} / phút`,
      icon: MessageCircle,
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-400/30',
      glowColor: 'shadow-[0_0_20px_-3px_rgba(129,140,248,0.35)]',
      bgGlow: 'from-indigo-400/15 to-transparent',
      highlightBadge: null,
    },
    {
      id: 'socials',
      title: 'Tương tác Mạng xã hội',
      value: `${formatNumber(kpis.totalFollows)} Follows`,
      subLabel: 'Lượt chia sẻ:',
      subValue: `${formatNumber(kpis.totalShares)} lượt Share`,
      icon: Share2,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-400/30',
      glowColor: 'shadow-[0_0_20px_-3px_rgba(192,132,252,0.35)]',
      bgGlow: 'from-purple-400/15 to-transparent',
      highlightBadge: null,
    },
    {
      id: 'joins',
      title: 'Lượt vào phòng (Joins)',
      value: formatNumber(kpis.totalJoins),
      subLabel: 'Tốc độ vào:',
      subValue: `+${formatNumber(kpis.joinsPerMinute)} / phút`,
      icon: LogIn,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-400/30',
      glowColor: 'shadow-[0_0_20px_-3px_rgba(52,211,153,0.35)]',
      bgGlow: 'from-emerald-400/15 to-transparent',
      highlightBadge: null,
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-2xl bg-[#11131f]/90 border border-white/10 p-3.5 lg:p-4 transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:bg-[#141726] shadow-sm`}
            >
              {/* Top ambient color glow */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.bgGlow} rounded-full blur-2xl pointer-events-none opacity-60`}
              />

              <div className="flex items-start justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400 line-clamp-1 pr-1">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl bg-white/[0.04] border border-white/5 ${card.accentColor} shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Main KPI Value */}
              <div className="mb-2">
                <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                  {card.value}
                </div>
              </div>

              {/* Sub Metrics / Rates */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5 pt-2 mt-auto">
                <span className="truncate pr-1">{card.subLabel}</span>
                <span className="font-semibold text-gray-200 font-mono shrink-0">
                  {card.subValue}
                </span>
              </div>

              {/* Badge if active */}
              {card.highlightBadge && (
                <div className="absolute top-2 right-12 hidden sm:block">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-white/10 text-white font-mono">
                    {card.highlightBadge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
