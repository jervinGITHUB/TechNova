import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Video,
  AudioTrack,
  Conversation,
  Message,
  MessageReplyInfo,
  NotificationItem,
  ReportItem,
  LiveStream,
  LiveStreamMessage,
  FollowRelation,
  FollowRequest,
  FollowStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VIDEOS,
  INITIAL_AUDIO_TRACKS,
  INITIAL_CONVERSATIONS,
  INITIAL_FOLLOWS,
  INITIAL_FOLLOW_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_LIVESTREAM,
  storage,
} from '../services/storage';

export type AppTab =
  | 'home'
  | 'explore'
  | 'live'
  | 'messages'
  | 'upload'
  | 'notifications'
  | 'report_history'
  | 'profile'
  | 'edit_profile'
  | 'live_host_setup'
  | 'live_host_active'
  | 'live_viewer';

interface ReportModalConfig {
  isOpen: boolean;
  type: 'video' | 'user';
  targetId: string;
  targetName: string;
  targetSubtitle?: string;
  targetThumbnail?: string;
}

interface AppContextType {
  // Auth state
  currentUser: User | null;
  authView: 'login' | 'register';
  setAuthView: (view: 'login' | 'register') => void;
  login: (usernameOrEmail: string, password?: string) => boolean;
  register: (username: string, email: string, password?: string) => boolean;
  logout: () => void;
  quickLoginAs: (userId: string) => void;

  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedUserId: string | null;
  navigateToUserProfile: (userId: string) => void;

  // Data
  users: User[];
  videos: Video[];
  audioTracks: AudioTrack[];
  conversations: Conversation[];
  activeConversationId: string | null;
  notifications: NotificationItem[];
  reports: ReportItem[];
  currentLiveStream: LiveStream;

  // Follow & Relationship System
  followRelations: FollowRelation[];
  followRequests: FollowRequest[];
  getFollowStatus: (targetUserId: string) => FollowStatus;
  isTargetFollowingMe: (targetUserId: string) => boolean;
  acceptFollowRequest: (requestId: string, andFollowBack?: boolean) => void;
  declineFollowRequest: (requestId: string) => void;
  getUserFollowers: (userId: string) => User[];
  getUserFollowing: (userId: string) => User[];
  canMessageUser: (userId: string) => boolean;
  canViewUserFollows: (userId: string) => boolean;

  // Unread counts
  totalUnreadMessages: number;
  totalUnreadNotifications: number;

  // Actions
  updateUserProfile: (updates: Partial<User>) => void;
  toggleFollowUser: (userId: string) => void;
  toggleLikeVideo: (videoId: string) => void;
  addCommentToVideo: (videoId: string, text: string) => void;
  shareVideo: (videoId: string) => void;
  shareVideoToUser: (video: Video, targetUserId: string, note?: string) => boolean;
  recordVideoView: (videoId: string) => void;
  uploadVideo: (newVideo: {
    caption: string;
    hashtags: string[];
    audioTrack?: AudioTrack;
    mediaUrl: string;
    thumbnailUrl?: string;
  }) => void;
  submitReport: (report: Omit<ReportItem, 'id' | 'timestamp' | 'status'>) => void;
  
  // Messaging
  messagesMobileView: 'list' | 'chat';
  setMessagesMobileView: (view: 'list' | 'chat') => void;
  openConversation: (convId: string) => void;
  openConversationWithUser: (userId: string) => void;
  sendMessage: (convId: string, text: string, replyTo?: MessageReplyInfo) => void;
  deleteConversation: (convId: string) => void;
  deleteMessage: (convId: string, messageId: string) => void;
  
  // Notifications
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;

  // Live Stream
  openLiveStreamAsViewer: (streamId: string) => void;
  sendLiveComment: (text: string) => void;
  startHostLiveStream: (title: string, topic: string, aboutMe: string) => void;
  endHostLiveStream: () => void;
  toggleLiveSource: (source: 'camera' | 'mic' | 'screen') => void;

  // Modals & Drawers
  commentsVideoId: string | null;
  setCommentsVideoId: (videoId: string | null) => void;
  reportModal: ReportModalConfig | null;
  openReportModal: (config: Omit<ReportModalConfig, 'isOpen'>) => void;
  closeReportModal: () => void;
  audioLibraryOpen: boolean;
  setAudioLibraryOpen: (open: boolean) => void;
  onSelectAudioCallback: ((track: AudioTrack) => void) | null;
  openAudioLibrary: (callback: (track: AudioTrack) => void) => void;

  // Search & Global state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state - initialized from localStorage or null (User required to log in / sign in on first page)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = storage.get<User | null>('currentUser', null);
    if (saved) {
      const resetDone = storage.get<boolean>('profile_stats_reset_v4', false);
      if (!resetDone) {
        return {
          ...saved,
          followingCount: 0,
          followersCount: 0,
          likesCount: '0',
          isFollowing: false,
        };
      }
    }
    return saved;
  });
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Core Data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = storage.get<User[]>('users', INITIAL_USERS);
    const resetDone = storage.get<boolean>('profile_stats_reset_v4', false);
    if (!resetDone) {
      storage.set('profile_stats_reset_v4', true);
      return saved.map(u => ({
        ...u,
        followingCount: 0,
        followersCount: 0,
        likesCount: '0',
        isFollowing: false,
      }));
    }
    return saved;
  });

  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = storage.get<Video[]>('videos', INITIAL_VIDEOS);
    const resetDone = storage.get<boolean>('videos_reset_v4', false);
    if (!resetDone) {
      storage.set('videos_reset_v4', true);
      return saved.map(v => ({
        ...v,
        likesCount: 0,
        isLiked: false,
      }));
    }
    return saved;
  });

  const [audioTracks] = useState<AudioTrack[]>(() => storage.get('audioTracks', INITIAL_AUDIO_TRACKS));
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const resetDone = storage.get<boolean>('conversations_reset_zero_v6', false);
    if (!resetDone) {
      storage.set('conversations_reset_zero_v6', true);
      storage.set('conversations', []);
      return [];
    }
    return storage.get<Conversation[]>('conversations', []);
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messagesMobileView, setMessagesMobileView] = useState<'list' | 'chat'>('list');
  
  // Follow System Relations and Requests
  const [followRelations, setFollowRelations] = useState<FollowRelation[]>(() =>
    storage.get<FollowRelation[]>('follow_relations_v2', INITIAL_FOLLOWS)
  );
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>(() =>
    storage.get<FollowRequest[]>('follow_requests_v2', INITIAL_FOLLOW_REQUESTS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const raw = storage.get<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS);
    // Sanitize any previous simulated reciprocal notifications or old entries where actor is user_andrea
    return raw.filter(n => !n.targetText?.includes('back!') && n.actor?.id !== 'user_andrea');
  });
  const [reports, setReports] = useState<ReportItem[]>(() => storage.get('reports', INITIAL_REPORTS));
  const [currentLiveStream, setCurrentLiveStream] = useState<LiveStream>(() => storage.get('livestream', INITIAL_LIVESTREAM));

  // Modals
  const [commentsVideoId, setCommentsVideoId] = useState<string | null>(null);
  const [reportModal, setReportModal] = useState<ReportModalConfig | null>(null);
  const [audioLibraryOpen, setAudioLibraryOpen] = useState<boolean>(false);
  const [onSelectAudioCallback, setOnSelectAudioCallback] = useState<((track: AudioTrack) => void) | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync to storage
  useEffect(() => {
    storage.set('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    storage.set('users', users);
  }, [users]);

  useEffect(() => {
    storage.set('videos', videos);
  }, [videos]);

  useEffect(() => {
    storage.set('conversations', conversations);
  }, [conversations]);

  useEffect(() => {
    storage.set('follow_relations_v2', followRelations);
  }, [followRelations]);

  useEffect(() => {
    storage.set('follow_requests_v2', followRequests);
  }, [followRequests]);

  useEffect(() => {
    storage.set('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    storage.set('reports', reports);
  }, [reports]);

  useEffect(() => {
    storage.set('livestream', currentLiveStream);
  }, [currentLiveStream]);

  // Account-specific conversation filtering: only conversations current user is part of, and NOT deleted by currentUser!
  const userConversations = conversations.filter(c => {
    if (!currentUser) return false;
    const isParticipant = (c.participantIds && c.participantIds.length > 0)
      ? c.participantIds.includes(currentUser.id)
      : c.participant.id !== currentUser.id;
    if (!isParticipant) return false;

    // If currentUser deleted this conversation, hide it from currentUser
    if (c.deletedForUserIds && c.deletedForUserIds.includes(currentUser.id)) {
      return false;
    }
    return true;
  });

  // Total unread messages across conversations for currentUser
  const totalUnreadMessages = userConversations.reduce((acc, conv) => {
    if (!currentUser) return acc;
    if (conv.unreadCounts && typeof conv.unreadCounts[currentUser.id] === 'number') {
      return acc + conv.unreadCounts[currentUser.id];
    }
    return acc + (conv.unreadCount || 0);
  }, 0);

  // User's own notifications inbox: ONLY interactions from other users to currentUser!
  // "for example someone like,comment,share,follow/followback all the interactions of other user to my own profile , that's the only will be pop up on my notification"
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    // 1. MUST be explicitly addressed to currentUser
    if (n.recipientId !== currentUser.id) return false;
    // 2. CRITICAL: NEVER show a notification caused by currentUser themselves!
    if (n.actor.id === currentUser.id) return false;
    // 3. Filter out any simulated reciprocal artifacts
    if (n.targetText?.includes('back!')) return false;
    return true;
  });

  const totalUnreadNotifications = userNotifications.filter(n => n.isUnread).length;

  // Auth functions
  const login = (usernameOrEmail: string): boolean => {
    const clean = usernameOrEmail.trim().toLowerCase().replace('@', '');
    const found = users.find(
      u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );
    if (found) {
      setCurrentUser(found);
      setActiveConversationId(null);
      setMessagesMobileView('list');
      setSelectedUserId(null);
      return true;
    }
    // Fallback: create temporary session with default Andrea Ruiz profile
    const defaultUser = INITIAL_USERS[0];
    setCurrentUser(defaultUser);
    setActiveConversationId(null);
    setMessagesMobileView('list');
    setSelectedUserId(null);
    return true;
  };

  const register = (username: string, email: string): boolean => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: username.replace('@', '').trim() || 'viralstar',
      displayName: username.replace('@', '').trim(),
      email: email.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'New creator on ViralHub! 👋',
      followingCount: 0,
      followersCount: 0,
      likesCount: '0',
      isPrivate: false,
      role: 'creator',
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveConversationId(null);
    setMessagesMobileView('list');
    setSelectedUserId(null);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    storage.remove('currentUser');
    setActiveConversationId(null);
    setMessagesMobileView('list');
    setSelectedUserId(null);
    setAuthView('login');
  };

  const quickLoginAs = (userId: string) => {
    const target = users.find(u => u.id === userId) || INITIAL_USERS[0];
    setCurrentUser(target);
    setActiveConversationId(null);
    setMessagesMobileView('list');
    setSelectedUserId(null);
  };

  const navigateToUserProfile = (userId: string) => {
    if (currentUser && userId === currentUser.id) {
      setSelectedUserId(null);
      setActiveTab('profile');
    } else {
      setSelectedUserId(userId);
      setActiveTab('profile');
    }
  };

  // Profile update (BR-002)
  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
  };

  // Follow & Relationship System (BR-011, BR-012, Friends mutual follow, Private requests)
  const isTargetFollowingMe = (targetUserId: string): boolean => {
    if (!currentUser) return false;
    return followRelations.some(
      f => f.followerId === targetUserId && f.followingId === currentUser.id
    );
  };

  const getFollowStatus = (targetUserId: string): FollowStatus => {
    if (!currentUser || currentUser.id === targetUserId) return 'none';
    const currFollowsTarget = followRelations.some(
      f => f.followerId === currentUser.id && f.followingId === targetUserId
    );
    const targetFollowsCurr = followRelations.some(
      f => f.followerId === targetUserId && f.followingId === currentUser.id
    );

    if (currFollowsTarget && targetFollowsCurr) {
      return 'friends';
    }
    if (currFollowsTarget) {
      return 'following';
    }
    const hasPendingRequest = followRequests.some(
      r => r.fromUserId === currentUser.id && r.toUserId === targetUserId
    );
    if (hasPendingRequest) {
      return 'requested';
    }
    return 'none';
  };

  const toggleFollowUser = (userId: string) => {
    if (!currentUser || currentUser.id === userId) return;
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const currentStatus = getFollowStatus(userId);

    // Case 1: Already Friends or Following -> Unfollow
    if (currentStatus === 'friends' || currentStatus === 'following') {
      setFollowRelations(prev =>
        prev.filter(f => !(f.followerId === currentUser.id && f.followingId === userId))
      );

      setUsers(prev =>
        prev.map(u => {
          if (u.id === userId) {
            return { ...u, followersCount: Math.max(0, u.followersCount - 1) };
          }
          if (u.id === currentUser.id) {
            return { ...u, followingCount: Math.max(0, u.followingCount - 1) };
          }
          return u;
        })
      );

      setCurrentUser(prev =>
        prev ? { ...prev, followingCount: Math.max(0, prev.followingCount - 1) } : prev
      );
      return;
    }

    // Case 2: Request is pending -> Cancel request
    if (currentStatus === 'requested') {
      setFollowRequests(prev =>
        prev.filter(r => !(r.fromUserId === currentUser.id && r.toUserId === userId))
      );
      setNotifications(prev =>
        prev.filter(
          n => !(n.recipientId === userId && n.actor.id === currentUser.id && n.type === 'follow_request')
        )
      );
      return;
    }

    // Case 3: Not following -> Follow or Send Request
    if (targetUser.isPrivate) {
      // Private account: send request
      const reqId = `req_${Date.now()}`;
      const newReq: FollowRequest = {
        id: reqId,
        fromUserId: currentUser.id,
        toUserId: targetUser.id,
        timestamp: 'Just now',
      };
      setFollowRequests(prev => [...prev, newReq]);

      const reqNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientId: targetUser.id,
        type: 'follow_request',
        actor: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        },
        targetText: 'sent you a follow request.',
        timestamp: 'Just now',
        isUnread: true,
        requestId: reqId,
      };
      setNotifications(prev => [reqNotif, ...prev]);
    } else {
      // Public account: Follow immediately
      setFollowRelations(prev => [
        ...prev,
        { followerId: currentUser.id, followingId: targetUser.id },
      ]);

      const targetFollowsMe = isTargetFollowingMe(targetUser.id);

      setUsers(prev =>
        prev.map(u => {
          if (u.id === targetUser.id) {
            return { ...u, followersCount: u.followersCount + 1 };
          }
          if (u.id === currentUser.id) {
            return { ...u, followingCount: u.followingCount + 1 };
          }
          return u;
        })
      );

      setCurrentUser(prev =>
        prev ? { ...prev, followingCount: prev.followingCount + 1 } : prev
      );

      const notifText = targetFollowsMe
        ? 'followed you back. You are now friends!'
        : 'started following you.';

      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientId: targetUser.id,
        type: 'follow',
        actor: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        },
        targetText: notifText,
        timestamp: 'Just now',
        isUnread: true,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Sync counts whenever followRelations change
  useEffect(() => {
    setUsers(prev =>
      prev.map(u => ({
        ...u,
        followersCount: followRelations.filter(f => f.followingId === u.id).length,
        followingCount: followRelations.filter(f => f.followerId === u.id).length,
      }))
    );
    if (currentUser) {
      setCurrentUser(prev =>
        prev
          ? {
              ...prev,
              followersCount: followRelations.filter(f => f.followingId === prev.id).length,
              followingCount: followRelations.filter(f => f.followerId === prev.id).length,
            }
          : prev
      );
    }
  }, [followRelations]);

  const acceptFollowRequest = (requestId: string, andFollowBack = true) => {
    if (!currentUser) return;
    const req = followRequests.find(r => r.id === requestId);
    const requesterId = req?.fromUserId;

    // Both become mutual follows (friends)
    if (requesterId) {
      setFollowRelations(prev => {
        const next = [...prev];
        if (!next.some(f => f.followerId === requesterId && f.followingId === currentUser.id)) {
          next.push({ followerId: requesterId, followingId: currentUser.id });
        }
        if (!next.some(f => f.followerId === currentUser.id && f.followingId === requesterId)) {
          next.push({ followerId: currentUser.id, followingId: requesterId });
        }
        return next;
      });

      // Send confirmation notification to requester
      const replyNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientId: requesterId,
        type: 'follow',
        actor: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        },
        targetText: 'accepted your follow request. You are now friends!',
        timestamp: 'Just now',
        isUnread: true,
        status: 'accepted',
      };
      setNotifications(prev => [replyNotif, ...prev]);
    }

    // Remove request from pending follow requests
    setFollowRequests(prev => prev.filter(r => r.id !== requestId));

    // Update currentUser notification: It becomes "You are now friends!" only on my notification
    setNotifications(prev =>
      prev.map(n => {
        if (n.requestId === requestId || (requesterId && n.recipientId === currentUser.id && n.actor.id === requesterId && n.type === 'follow_request')) {
          return {
            ...n,
            isUnread: false,
            status: 'accepted',
            targetText: 'You are now friends!',
          };
        }
        return n;
      })
    );
  };

  const declineFollowRequest = (requestId: string) => {
    setFollowRequests(prev => prev.filter(r => r.id !== requestId));
    setNotifications(prev =>
      prev.map(n =>
        n.requestId === requestId
          ? {
              ...n,
              isUnread: false,
              status: 'declined',
              targetText: 'Follow request declined',
            }
          : n
      )
    );
  };

  const getUserFollowers = (userId: string): User[] => {
    const followerIds = followRelations
      .filter(f => f.followingId === userId)
      .map(f => f.followerId);
    return users.filter(u => followerIds.includes(u.id));
  };

  const getUserFollowing = (userId: string): User[] => {
    const followingIds = followRelations
      .filter(f => f.followerId === userId)
      .map(f => f.followingId);
    return users.filter(u => followingIds.includes(u.id));
  };

  const canMessageUser = (targetUserId: string): boolean => {
    if (!currentUser || currentUser.id === targetUserId) return false;
    const target = users.find(u => u.id === targetUserId);
    if (!target) return false;
    if (!target.isPrivate) return true;
    return getFollowStatus(targetUserId) === 'friends';
  };

  const canViewUserFollows = (targetUserId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.id === targetUserId) return true;
    const target = users.find(u => u.id === targetUserId);
    if (!target) return false;
    if (!target.isPrivate) return true;
    return getFollowStatus(targetUserId) === 'friends';
  };

  // Like video (BR-014, BR-022, BR-024)
  const toggleLikeVideo = (videoId: string) => {
    if (!currentUser) return;
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const willLike = !video.isLiked;

    // 1. Update video likesCount and isLiked
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const newLikes = willLike ? v.likesCount + 1 : Math.max(0, v.likesCount - 1);
          return { ...v, isLiked: willLike, likesCount: newLikes };
        }
        return v;
      })
    );

    // 2. Connect directly to creator's profile total likesCount!
    setUsers(prev =>
      prev.map(u => {
        if (u.id === video.creatorId) {
          const currentTotal = parseInt(String(u.likesCount || '0'), 10) || 0;
          const newTotal = willLike ? currentTotal + 1 : Math.max(0, currentTotal - 1);
          return { ...u, likesCount: String(newTotal) };
        }
        return u;
      })
    );

    // If video belongs to currentUser, also update currentUser state
    if (video.creatorId === currentUser.id) {
      setCurrentUser(prev => {
        if (!prev) return prev;
        const currentTotal = parseInt(String(prev.likesCount || '0'), 10) || 0;
        const newTotal = willLike ? currentTotal + 1 : Math.max(0, currentTotal - 1);
        return { ...prev, likesCount: String(newTotal) };
      });
    }

    // 3. Send notification ONLY to the VIDEO CREATOR (if not currentUser)
    if (willLike && video.creatorId !== currentUser.id) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientId: video.creatorId, // Targeted to video creator!
        type: 'like',
        actor: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        },
        targetText: `liked your video: "${video.caption.slice(0, 30)}..."`,
        timestamp: 'Just now',
        isUnread: true,
        videoId: video.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Add Comment (BR-018, BR-021)
  const addCommentToVideo = (videoId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return { ...v, commentsCount: v.commentsCount + 1 };
        }
        return v;
      })
    );

    // Trigger notification to the VIDEO CREATOR (NOT currentUser)
    const video = videos.find(v => v.id === videoId);
    if (video && video.creatorId !== currentUser.id) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientId: video.creatorId, // Recipient is the VIDEO CREATOR!
        type: 'comment',
        actor: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        },
        targetText: `commented to your video: "${text.slice(0, 35)}"`,
        timestamp: 'Just now',
        isUnread: true,
        videoId: video.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Share Video (BR-019, BR-020, BR-023)
  const shareVideo = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return { ...v, sharesCount: v.sharesCount + 1 };
        }
        return v;
      })
    );

    // Trigger notification to the VIDEO CREATOR (NOT currentUser)
    const video = videos.find(v => v.id === videoId);
    if (video && currentUser && video.creatorId !== currentUser.id) {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        recipientId: video.creatorId, // Recipient is the VIDEO CREATOR!
        type: 'share',
        actor: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          avatar: currentUser.avatar,
        },
        targetText: `shared your video: "${video.caption.slice(0, 30)}..."`,
        timestamp: 'Just now',
        isUnread: true,
        videoId: video.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Record Video View (increments view count on video and profile)
  const recordVideoView = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const raw = String(v.viewsCount || '0').replace(/[^0-9]/g, '');
          const currentViews = parseInt(raw, 10) || 0;
          const newViews = currentViews + 1;
          const formatted =
            newViews >= 1000000
              ? `${(newViews / 1000000).toFixed(1)}M`
              : newViews >= 1000
              ? `${(newViews / 1000).toFixed(1)}K`
              : String(newViews);
          return { ...v, viewsCount: formatted };
        }
        return v;
      })
    );
  };

  // Share video directly to a user in messages
  const shareVideoToUser = (video: Video, targetUserId: string, note?: string): boolean => {
    if (!currentUser) return false;
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return false;

    // Guard: private profile requires friendship
    if (targetUser.isPrivate && getFollowStatus(targetUserId) !== 'friends') {
      return false;
    }

    shareVideo(video.id);

    // Find or create conversation
    let targetConvId = '';
    const existing = conversations.find(
      c => c.participantIds?.includes(currentUser.id) && c.participantIds?.includes(targetUserId)
    );
    if (existing) {
      targetConvId = existing.id;
    } else {
      const newConvId = `conv_${Date.now()}`;
      targetConvId = newConvId;
      const newConv: Conversation = {
        id: newConvId,
        participantIds: [currentUser.id, targetUserId],
        participant: targetUser,
        lastMessage: `Shared a video: "${video.caption.slice(0, 30)}"`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        unreadCounts: { [currentUser.id]: 0, [targetUserId]: 1 },
        messages: [],
        deletedForUserIds: [],
        clearedHistoryAt: {},
      };
      setConversations(prev => [newConv, ...prev]);
    }

    const shareUrl = `${window.location.origin}/video/${video.id}`;
    const textToSend = note?.trim()
      ? `${note.trim()}\n🎥 Video by @${video.creator.username}: "${video.caption}"\n${shareUrl}`
      : `🎥 Check out this video by @${video.creator.username}: "${video.caption}"\n${shareUrl}`;

    sendMessage(targetConvId, textToSend);
    return true;
  };

  // Upload Video (BR-013, BR-015, BR-016)
  const uploadVideo = (newVideo: {
    caption: string;
    hashtags: string[];
    audioTrack?: AudioTrack;
    mediaUrl: string;
    thumbnailUrl?: string;
  }) => {
    if (!currentUser) return;
    const created: Video = {
      id: `vid_${Date.now()}`,
      creatorId: currentUser.id,
      creator: currentUser,
      caption: newVideo.caption || 'New viral moment! 🔥',
      hashtags: newVideo.hashtags.length > 0 ? newVideo.hashtags : ['#viral', '#fyp'],
      audioTrack: newVideo.audioTrack,
      mediaUrl: newVideo.mediaUrl,
      thumbnailUrl: newVideo.thumbnailUrl || newVideo.mediaUrl,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: '1',
      isLiked: false,
      createdAt: 'Just now',
      reportsCount: 0,
    };
    setVideos(prev => [created, ...prev]);
    setActiveTab('home');
  };

  // Submit report (BR-006, BR-007, BR-017, BR-025)
  const submitReport = (report: Omit<ReportItem, 'id' | 'timestamp' | 'status'>) => {
    const newReport: ReportItem = {
      ...report,
      id: `rep_${Date.now()}`,
      status: 'Under Review',
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
    setReports(prev => [newReport, ...prev]);

    // If reporting a video, increment reportsCount
    if (report.type === 'video') {
      setVideos(prev =>
        prev.map(v => (v.id === report.targetId ? { ...v, reportsCount: (v.reportsCount || 0) + 1 } : v))
      );
    }

    // If reporting a user
    if (report.type === 'user') {
      setUsers(prev =>
        prev.map(u => (u.id === report.targetId ? { ...u, isReported: true } : u))
      );
    }
  };

  // Messages handling
  // "the 'red with number on it' will be removed after viewing the inside conversation of it."
  const openConversation = (convId: string) => {
    setActiveConversationId(convId);
    setMessagesMobileView('chat');
    if (!currentUser) return;
    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            unreadCount: 0, // Clears badge
            unreadCounts: {
              ...(c.unreadCounts || {}),
              [currentUser.id]: 0,
            },
            messages: c.messages.map(m =>
              m.senderId !== currentUser.id ? { ...m, status: 'read' as const } : m
            ),
          };
        }
        return c;
      })
    );
  };

  const openConversationWithUser = (targetUserId: string) => {
    if (!currentUser) return;
    const target = users.find(u => u.id === targetUserId);

    // Private profile check: cannot send message unless they are friends!
    if (target?.isPrivate && getFollowStatus(target.id) !== 'friends') {
      return;
    }

    // 1. Check if conversation with this participant already exists
    const existing = conversations.find(c => {
      if (c.participantIds && c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUserId)) {
        return true;
      }
      return c.participant.id === targetUserId;
    });

    if (existing) {
      if (existing.deletedForUserIds?.includes(currentUser.id)) {
        setConversations(prev =>
          prev.map(c =>
            c.id === existing.id
              ? {
                  ...c,
                  deletedForUserIds: (c.deletedForUserIds || []).filter(id => id !== currentUser.id),
                }
              : c
          )
        );
      }
      openConversation(existing.id);
      setMessagesMobileView('chat');
      setActiveTab('messages');
      return;
    }

    // 2. If not, create new conversation
    if (target) {
      const newConv: Conversation = {
        id: `conv_${currentUser.id}_${target.id}_${Date.now()}`,
        participantIds: [currentUser.id, target.id],
        participant: target,
        lastMessage: 'Started a conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        unreadCounts: { [currentUser.id]: 0, [target.id]: 0 },
        isOnline: true,
        lastSeen: 'online',
        messages: [],
        deletedForUserIds: [],
        clearedHistoryAt: {},
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessagesMobileView('chat');
      setActiveTab('messages');
      return;
    }

    // Fallback if targetUserId is already a convId
    openConversation(targetUserId);
    setMessagesMobileView('chat');
    setActiveTab('messages');
  };

  const sendMessage = (convId: string, text: string, replyTo?: MessageReplyInfo) => {
    if (!currentUser || !text.trim()) return;

    const conv = conversations.find(c => c.id === convId);
    const recipientId = conv?.participantIds?.find(id => id !== currentUser.id) ||
      (conv?.participant.id !== currentUser.id ? conv?.participant.id : 'user_jervin') || 'user_jervin';

    // Guard: If recipient is private, cannot message unless friends!
    const recipientUser = users.find(u => u.id === recipientId);
    if (recipientUser?.isPrivate && getFollowStatus(recipientId) !== 'friends') {
      return;
    }

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      status: 'sent',
      replyTo,
      deletedForUserIds: [],
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const currentRecipientUnread = c.unreadCounts?.[recipientId] || 0;
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTime: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: [...c.messages, newMsg],
            deletedForUserIds: (c.deletedForUserIds || []).filter(
              id => id !== currentUser.id && id !== recipientId
            ),
            unreadCounts: {
              ...(c.unreadCounts || {}),
              [currentUser.id]: 0,
              [recipientId]: currentRecipientUnread + 1,
            },
          };
        }
        return c;
      })
    );
  };

  // Delete whole conversation: ONLY deletes for currentUser's POV!
  // The other user still sees the conversation and its full history!
  const deleteConversation = (convId: string) => {
    if (!currentUser) return;
    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const currentDeleted = c.deletedForUserIds || [];
          return {
            ...c,
            deletedForUserIds: currentDeleted.includes(currentUser.id)
              ? currentDeleted
              : [...currentDeleted, currentUser.id],
            clearedHistoryAt: {
              ...(c.clearedHistoryAt || {}),
              [currentUser.id]: Date.now(),
            },
          };
        }
        return c;
      })
    );
    if (activeConversationId === convId) {
      setActiveConversationId(null);
      setMessagesMobileView('list');
    }
  };

  // Delete message: Deleted for BOTH users' POVs (deleted / unsent for everyone)
  const deleteMessage = (convId: string, messageId: string) => {
    if (!currentUser) return;
    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const remainingMessages = c.messages.filter(m => m.id !== messageId);
          const last = remainingMessages[remainingMessages.length - 1];

          return {
            ...c,
            messages: remainingMessages,
            lastMessage: last ? last.text : 'No messages yet',
            lastMessageTime: last ? last.timestamp : c.lastMessageTime,
          };
        }
        return c;
      })
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => {
        if (!n.recipientId || n.recipientId === currentUser.id) {
          return { ...n, isUnread: false };
        }
        return n;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  // Live Stream handling (BR-003, BR-004, BR-010, BR-026, BR-027)
  const openLiveStreamAsViewer = (_streamId: string) => {
    setActiveTab('live_viewer');
  };

  const sendLiveComment = (text: string) => {
    if (!currentUser || !text.trim()) return;
    const newLiveMsg: LiveStreamMessage = {
      id: `lm_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
    };
    setCurrentLiveStream(prev => ({
      ...prev,
      messages: [...prev.messages, newLiveMsg],
    }));
  };

  const startHostLiveStream = (title: string, topic: string, aboutMe: string) => {
    if (!currentUser) return;
    setCurrentLiveStream(prev => ({
      ...prev,
      host: currentUser,
      title: title || "Let's play",
      topic: topic || 'Gaming',
      aboutMe: aboutMe || 'Welcome to my stream!',
      isLive: true,
      timerSeconds: 0,
      viewersCount: 1,
    }));
    setActiveTab('live_host_active');
  };

  const endHostLiveStream = () => {
    setCurrentLiveStream(prev => ({
      ...prev,
      isLive: false,
    }));
    setActiveTab('live');
  };

  const toggleLiveSource = (source: 'camera' | 'mic' | 'screen') => {
    setCurrentLiveStream(prev => ({
      ...prev,
      cameraEnabled: source === 'camera' ? !prev.cameraEnabled : prev.cameraEnabled,
      micEnabled: source === 'mic' ? !prev.micEnabled : prev.micEnabled,
      screenShareEnabled: source === 'screen' ? !prev.screenShareEnabled : prev.screenShareEnabled,
    }));
  };

  const openReportModal = (config: Omit<ReportModalConfig, 'isOpen'>) => {
    setReportModal({ ...config, isOpen: true });
  };

  const closeReportModal = () => {
    setReportModal(null);
  };

  const openAudioLibrary = (callback: (track: AudioTrack) => void) => {
    setOnSelectAudioCallback(() => callback);
    setAudioLibraryOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authView,
        setAuthView,
        login,
        register,
        logout,
        quickLoginAs,
        activeTab,
        setActiveTab,
        selectedUserId,
        navigateToUserProfile,
        users,
        videos,
        audioTracks,
        conversations,
        activeConversationId,
        messagesMobileView,
        setMessagesMobileView,
        notifications: userNotifications,
        reports,
        currentLiveStream,
        followRelations,
        followRequests,
        getFollowStatus,
        isTargetFollowingMe,
        acceptFollowRequest,
        declineFollowRequest,
        getUserFollowers,
        getUserFollowing,
        canMessageUser,
        canViewUserFollows,
        totalUnreadMessages,
        totalUnreadNotifications,
        updateUserProfile,
        toggleFollowUser,
        toggleLikeVideo,
        addCommentToVideo,
        shareVideo,
        shareVideoToUser,
        recordVideoView,
        uploadVideo,
        submitReport,
        openConversation,
        openConversationWithUser,
        sendMessage,
        deleteConversation,
        deleteMessage,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        openLiveStreamAsViewer,
        sendLiveComment,
        startHostLiveStream,
        endHostLiveStream,
        toggleLiveSource,
        commentsVideoId,
        setCommentsVideoId,
        reportModal,
        openReportModal,
        closeReportModal,
        audioLibraryOpen,
        setAudioLibraryOpen,
        onSelectAudioCallback,
        openAudioLibrary,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
