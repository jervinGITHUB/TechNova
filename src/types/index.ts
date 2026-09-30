export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  followingCount: number;
  followersCount: number;
  likesCount: string | number;
  isPrivate: boolean;
  isFollowing?: boolean;
  isBlocked?: boolean;
  isReported?: boolean;
  role?: 'creator' | 'viewer' | 'admin';
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string; // e.g. "00:30"
  coverUrl: string;
  audioUrl?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likesCount?: number;
  replyToId?: string;
  replies?: VideoComment[];
}

export interface Video {
  id: string;
  creatorId: string;
  creator: User;
  caption: string;
  hashtags: string[];
  audioTrack?: AudioTrack;
  mediaUrl: string;
  thumbnailUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: string;
  isLiked?: boolean;
  createdAt: string;
  reportsCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantIds?: string[];
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  unreadCounts?: { [userId: string]: number };
  messages: Message[];
  isOnline?: boolean;
  lastSeen?: string;
}

export interface NotificationItem {
  id: string;
  recipientId?: string;
  type: 'like' | 'follow' | 'comment' | 'share';
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  targetText?: string;
  timestamp: string;
  isUnread: boolean;
  videoId?: string;
}

export interface ReportItem {
  id: string;
  type: 'video' | 'user';
  targetId: string;
  targetName: string;
  targetSubtitle?: string;
  targetThumbnail?: string;
  scenario: string;
  description?: string;
  status: 'Under Review' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface LiveViewer {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  joinedAt: string;
}

export interface LiveStreamMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  text: string;
  timestamp: string;
  isSystemEvent?: boolean;
}

export interface LiveStream {
  id: string;
  host: User;
  title: string;
  topic: string;
  aboutMe: string;
  viewersCount: number;
  viewers: LiveViewer[];
  isLive: boolean;
  timerSeconds: number;
  followerGoal: {
    current: number;
    target: number;
  };
  messages: LiveStreamMessage[];
  videoSource?: 'camera' | 'screen' | 'avatar' | 'demo';
  cameraEnabled: boolean;
  micEnabled: boolean;
  screenShareEnabled: boolean;
}
