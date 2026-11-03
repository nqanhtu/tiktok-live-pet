export type ConnectionStatus = 'IDLE' | 'CONNECTING' | 'LIVE' | 'SIMULATING' | 'ENDED' | 'ERROR';

export type PetSpeciesId =
  | 'bunny'
  | 'dog'
  | 'cat'
  | 'tiger'
  | 'lion'
  | 'leopard'
  | 'dragon'
  | 'fox'
  | 'panda'
  | 'unicorn';

export type PetActionState =
  | 'idle'
  | 'eating'
  | 'happy'
  | 'playing'
  | 'sleeping'
  | 'hungry'
  | 'evolving';

export interface ViewerPetState {
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  species: PetSpeciesId;
  level: number;
  exp: number;
  expRequired: number;
  stageId: number;
  stageName: string;
  totalDiamonds: number;
  totalLikes: number;
  totalComments: number;
  actionState: PetActionState;
  actionExpiresAt: number;
  lastChat?: {
    id: string;
    text: string;
    timestamp: number;
  };
  lastInteraction?: {
    id: string;
    type: 'like' | 'gift' | 'join' | 'follow' | 'share' | 'levelup' | 'evolve';
    label: string;
    subtext?: string;
    foodId?: string;
    timestamp: number;
  };
  position: {
    x: number;
    y: number;
  };
  joinedAt: number;
  lastActiveAt: number;
}

export interface PetEvolutionEvent {
  id: string;
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  species: PetSpeciesId;
  level: number;
  previousStageId: number;
  previousStageName: string;
  newStageId: number;
  newStageName: string;
  timestamp: number;
}

export interface RoomInfo {
  roomId: string;
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  title: string;
  startTime: number;
}

export interface KpiMetrics {
  viewerCount: number;
  peakViewerCount: number;
  totalLikes: number;
  likesPerMinute: number;
  totalComments: number;
  commentsPerMinute: number;
  totalDiamonds: number;
  estimatedUsd: number;
  totalGifts: number;
  totalFollows: number;
  totalShares: number;
  totalJoins: number;
  joinsPerMinute: number;
}

export interface TimeSeriesPoint {
  timestamp: number;
  timeLabel: string;
  viewerCount: number;
  commentsPer10s: number;
  likesPer10s: number;
  joinsPer10s: number;
  diamondsPer10s: number;
}

export interface ChatItem {
  id: string;
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  comment: string;
  timestamp: number;
  isQuestion?: boolean;
}

export interface GiftItem {
  id: string;
  streakId: string;
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  giftId: number;
  giftName: string;
  giftPictureUrl: string;
  diamondCount: number;
  repeatCount: number;
  totalDiamonds: number;
  repeatEnd: boolean;
  timestamp: number;
}

export interface SocialItem {
  id: string;
  type: 'follow' | 'share' | 'join';
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  timestamp: number;
}

export interface LeaderboardUser {
  uniqueId: string;
  nickname: string;
  avatarUrl: string;
  totalDiamonds: number;
  giftCount: number;
  commentCount: number;
  likeCount: number;
}

export interface DashboardSnapshot {
  status: ConnectionStatus;
  errorMessage?: string;
  roomInfo: RoomInfo | null;
  kpis: KpiMetrics;
  timeSeries: TimeSeriesPoint[];
  recentChats: ChatItem[];
  recentGifts: GiftItem[];
  recentSocials: SocialItem[];
  topGifters: LeaderboardUser[];
  topChatters: LeaderboardUser[];
  activePets: ViewerPetState[];
  totalPetsCount: number;
  recentEvolutions: PetEvolutionEvent[];
}

export interface ConnectPayload {
  uniqueId: string;
  sessionId?: string;
  eulerApiKey?: string;
}
