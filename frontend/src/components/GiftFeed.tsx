import React, { useState } from 'react';
import {
  Gift,
  Trophy,
  Flame,
  Crown,
  Sparkles,
  MessageSquare,
  User,
} from 'lucide-react';
import { GiftItem, LeaderboardUser } from '../types';

interface GiftFeedProps {
  recentGifts: GiftItem[];
  topGifters: LeaderboardUser[];
  topChatters: LeaderboardUser[];
}

type TabType = 'stream' | 'gifters' | 'chatters';

export const GiftFeed: React.FC<GiftFeedProps> = ({
  recentGifts,
  topGifters,
  topChatters,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('stream');

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.6)]">
            1
          </div>
        );
      case 2:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-300 text-black font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(203,213,225,0.4)]">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(180,83,9,0.4)]">
            3
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-white/10 text-gray-400 font-mono text-xs flex items-center justify-center">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[#11131f]/90 border border-white/10 p-4 lg:p-5 flex flex-col h-full shadow-sm">
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'stream'
                ? 'bg-[#fe2c55] text-white shadow-glow-magenta/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Quà Tặng</span>
            {recentGifts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                {recentGifts.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gifters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'gifters'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Top Đại Gia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chatters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'chatters'
                ? 'bg-tiktok-cyan text-black shadow-glow-cyan/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Top Chat</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Realtime Gifts Feed */}
      {activeTab === 'stream' && (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[360px] max-h-[580px]">
          {recentGifts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <Gift className="w-8 h-8 text-tiktok-magenta/30 mb-2" />
              <p className="text-xs font-medium text-gray-300">Chưa có quà tặng nào trong phiên này</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                Khi người xem gửi Hoa hồng, Mũ, Vũ trụ... sự kiện và chuỗi combo sẽ xuất hiện ngay tại đây.
              </p>
            </div>
          ) : (
            recentGifts.map((gift) => {
              const isHighValue = (gift.totalDiamonds || 0) >= 100;
              const isCombo = (gift.repeatCount || 1) > 1;

              return (
                <div
                  key={gift.id || `${gift.uniqueId}-${gift.timestamp}-${gift.giftId}`}
                  className={`p-3 rounded-xl border transition-all ${
                    isHighValue
                      ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 shadow-[0_0_15px_-4px_rgba(251,191,36,0.3)]'
                      : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* User & Gift Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {gift.avatarUrl ? (
                          <img
                            src={gift.avatarUrl}
                            alt={gift.nickname}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                            <User className="w-4 h-4" />
                          </div>
                        )}

                        {gift.giftPictureUrl && (
                          <img
                            src={gift.giftPictureUrl}
                            alt={gift.giftName}
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full object-contain bg-black/80 p-0.5 border border-white/20"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate max-w-[120px]">
                            {gift.nickname || gift.uniqueId}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate">
                            @{gift.uniqueId}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-300">
                          <span>đã gửi</span>
                          <strong className="text-white font-medium">{gift.giftName}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Combo & Diamonds Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-0.5">
                          +{gift.totalDiamonds.toLocaleString()} 💎
                        </span>

                        {/* Combo counter */}
                        {isCombo && (
                          <span className="px-1.5 py-0.5 rounded font-black text-xs font-mono bg-gradient-to-r from-[#fe2c55] to-orange-500 text-white shadow-glow-magenta/60 animate-bounce-short">
                            x{gift.repeatCount}
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5">
                        {gift.repeatEnd ? (
                          <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">
                            FINAL
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono uppercase font-bold text-tiktok-cyan tracking-wider flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 animate-spin" /> COMBO...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Top Gifters Leaderboard */}
      {activeTab === 'gifters' && (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[360px] max-h-[580px]">
          {topGifters.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <Crown className="w-8 h-8 text-amber-400/30 mb-2" />
              <p className="text-xs font-medium text-gray-300">Chưa có bảng xếp hạng đại gia</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                Người xem tặng nhiều quà và kim cương nhất sẽ được xếp hạng từ #1 đến #10.
              </p>
            </div>
          ) : (
            topGifters.map((user, idx) => (
              <div
                key={user.uniqueId}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getRankBadge(idx + 1)}

                  <div className="relative shrink-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.nickname}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate max-w-[130px]">
                      {user.nickname || user.uniqueId}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">@{user.uniqueId}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
                    <span>{user.totalDiamonds.toLocaleString()}</span>
                    <span>💎</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {user.giftCount.toLocaleString()} lượt tặng
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Top Chatters Leaderboard */}
      {activeTab === 'chatters' && (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[360px] max-h-[580px]">
          {topChatters.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
              <MessageSquare className="w-8 h-8 text-tiktok-cyan/30 mb-2" />
              <p className="text-xs font-medium text-gray-300">Chưa có bảng xếp hạng tương tác</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                Khán giả tích cực bình luận trò chuyện nhất sẽ được vinh danh tại đây.
              </p>
            </div>
          ) : (
            topChatters.map((user, idx) => (
              <div
                key={user.uniqueId}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getRankBadge(idx + 1)}

                  <div className="relative shrink-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.nickname}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate max-w-[130px]">
                      {user.nickname || user.uniqueId}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">@{user.uniqueId}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-tiktok-cyan flex items-center justify-end gap-1">
                    <span>{user.commentCount.toLocaleString()}</span>
                    <span className="text-[10px]">cmt</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {user.likeCount.toLocaleString()} likes
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
