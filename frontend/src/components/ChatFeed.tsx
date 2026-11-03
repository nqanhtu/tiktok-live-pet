import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  HelpCircle,
  UserCheck,
  Share2,
  LogIn,
  ArrowDown,
  User,
  Sparkles,
} from 'lucide-react';
import { ChatItem, SocialItem } from '../types';

interface ChatFeedProps {
  recentChats: ChatItem[];
  recentSocials: SocialItem[];
}

// Keywords typically asked by buyers in Vietnamese live streams
const QUESTION_KEYWORDS = [
  '?',
  'giá',
  'bao nhiêu',
  'bao nhiu',
  'bnhieu',
  'bnhiu',
  'mua',
  'ship',
  'size',
  'màu',
  'mau',
  'tư vấn',
  'tu van',
  'chốt',
  'chot',
  'inbox',
  'còn không',
  'con ko',
  'link',
  'sản phẩm',
  'shop',
  'order',
];

export const ChatFeed: React.FC<ChatFeedProps> = ({
  recentChats,
  recentSocials,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuestionsOnly, setFilterQuestionsOnly] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages if enabled
  useEffect(() => {
    if (autoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [recentChats, autoScroll]);

  // Handle scroll events to detect if user manually scrolled up
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(isAtBottom);
  };

  const isQuestionComment = (item: ChatItem) => {
    if (item.isQuestion) return true;
    const text = item.comment.toLowerCase();
    return QUESTION_KEYWORDS.some((kw) => text.includes(kw));
  };

  const filteredChats = useMemo(() => {
    return recentChats.filter((chat) => {
      // Filter by question toggle
      if (filterQuestionsOnly && !isQuestionComment(chat)) {
        return false;
      }

      // Filter by search query (username, nickname, or comment content)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchUser =
          chat.uniqueId.toLowerCase().includes(query) ||
          chat.nickname.toLowerCase().includes(query);
        const matchText = chat.comment.toLowerCase().includes(query);
        return matchUser || matchText;
      }

      return true;
    });
  }, [recentChats, filterQuestionsOnly, searchQuery]);

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const getSocialIcon = (type: SocialItem['type']) => {
    switch (type) {
      case 'follow':
        return <UserCheck className="w-3 h-3 text-purple-400" />;
      case 'share':
        return <Share2 className="w-3 h-3 text-tiktok-cyan" />;
      case 'join':
        return <LogIn className="w-3 h-3 text-emerald-400" />;
    }
  };

  const getSocialLabel = (type: SocialItem['type']) => {
    switch (type) {
      case 'follow':
        return 'đã Follow kênh';
      case 'share':
        return 'đã Chia sẻ live';
      case 'join':
        return 'đã vào phòng';
    }
  };

  return (
    <div className="rounded-2xl bg-[#11131f]/90 border border-white/10 p-4 lg:p-5 flex flex-col h-full shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col gap-3 pb-3 border-b border-white/5 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Bình Luận & Tương Tác Trực Tiếp
              </h3>
              <p className="text-[11px] text-gray-400">Luồng chat realtime kết hợp bộ lọc câu hỏi chốt đơn</p>
            </div>
          </div>

          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-300">
            {filteredChats.length} / {recentChats.length}
          </span>
        </div>

        {/* Filter bar: Search input + Question Toggle */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo nội dung, @username..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterQuestionsOnly(!filterQuestionsOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
              filterQuestionsOnly
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                : 'bg-white/[0.04] text-gray-300 border border-white/10 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Chỉ hiện câu hỏi (?)</span>
          </button>
        </div>

        {/* Social Events Ticker (Last 3-5 follows, shares, joins) */}
        {recentSocials.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-[11px]">
            <span className="text-[10px] uppercase font-bold text-gray-500 shrink-0 font-mono">
              EVENTS:
            </span>
            {recentSocials.slice(0, 4).map((soc) => (
              <div
                key={soc.id || `${soc.uniqueId}-${soc.timestamp}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shrink-0"
              >
                {getSocialIcon(soc.type)}
                <span className="font-semibold text-gray-200 truncate max-w-[100px]">
                  {soc.nickname || soc.uniqueId}
                </span>
                <span className="text-gray-400 text-[10px]">{getSocialLabel(soc.type)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Messages Stream */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[360px] max-h-[580px] relative"
      >
        {filteredChats.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
            <MessageSquare className="w-8 h-8 text-indigo-400/30 mb-2" />
            <p className="text-xs font-medium text-gray-300">
              {filterQuestionsOnly
                ? 'Không tìm thấy câu hỏi hoặc thắc mắc nào phù hợp bộ lọc'
                : 'Đang lắng nghe bình luận từ phòng Live...'}
            </p>
            <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
              Các câu hỏi về giá, size, vận chuyển, đơn hàng sẽ được làm nổi bật để chốt đơn kịp thời.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isQuestion = isQuestionComment(chat);

            return (
              <div
                key={chat.id || `${chat.uniqueId}-${chat.timestamp}`}
                className={`p-2.5 rounded-xl transition-all border ${
                  isQuestion
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_14px_-3px_rgba(251,191,36,0.25)] ring-1 ring-amber-500/20'
                    : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {chat.avatarUrl ? (
                      <img
                        src={chat.avatarUrl}
                        alt={chat.nickname}
                        className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                        <User className="w-3 h-3" />
                      </div>
                    )}

                    <span className="text-xs font-bold text-white truncate max-w-[140px]">
                      {chat.nickname || chat.uniqueId}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate hidden sm:inline">
                      @{chat.uniqueId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isQuestion && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-amber-400 text-black flex items-center gap-0.5 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> Khách hỏi
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-gray-500">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Comment Body */}
                <p
                  className={`text-xs pl-8 break-words leading-relaxed ${
                    isQuestion ? 'text-amber-100 font-semibold' : 'text-gray-200'
                  }`}
                >
                  {chat.comment}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Auto-scroll resume button */}
      {!autoScroll && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setAutoScroll(true);
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fe2c55] text-white shadow-glow-magenta active:scale-95 transition"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>Xem tin nhắn mới nhất</span>
          </button>
        </div>
      )}
    </div>
  );
};
