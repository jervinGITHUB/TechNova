import { User, Video, AudioTrack, Conversation, NotificationItem, ReportItem, LiveStream } from '../types';

// Seed avatars (reliable inline SVG data or high-contrast clean avatars)
export const SEED_AVATARS = {
  andrea: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  jervin: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  jan: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  waylay: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  rene: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  adili: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  gekko: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  yoru: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80',
  reyna: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  clove: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
};

// Safe fallback avatar generator using SVG
export const getAvatarFallback = (name: string, bg = '3b82f6') => {
  const initial = (name || 'U').charAt(0).toUpperCase();
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23${bg}"/><text x="50%" y="54%" font-family="Arial,sans-serif" font-size="42" font-weight="bold" fill="white" dominant-baseline="middle" text-anchor="middle">${initial}</text></svg>`;
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_andrea',
    username: 'andeng',
    displayName: 'Andrea Ruiz',
    email: 'andrea@viralhub.app',
    avatar: '/src/assets/images/video_morning_routine_1790766824049.jpg', // high-res profile
    bio: '*You know everything, please?! Do you want me to give you a gift? Right or left? 🍭*',
    followingCount: 0,
    followersCount: 0,
    likesCount: '0',
    isPrivate: false,
    role: 'creator',
  },
  {
    id: 'user_jervin',
    username: 'wry.jerv',
    displayName: 'Jervin Saludo',
    email: 'jervin@viralhub.app',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'More active on Discord 😜',
    followingCount: 0,
    followersCount: 0,
    likesCount: '0',
    isPrivate: false,
    isFollowing: false,
    role: 'creator',
  },
  {
    id: 'user_jan',
    username: 'imhandsome',
    displayName: 'Jan Ahron',
    email: 'jan@viralhub.app',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Pogi ko sabi ni mama',
    followingCount: 0,
    followersCount: 0,
    likesCount: '0',
    isPrivate: true, // Private profile matching Screenshot 5!
    isFollowing: false,
    role: 'creator',
  },
  {
    id: 'user_waylay',
    username: 'waylay',
    displayName: 'Waylay Soriano',
    email: 'waylay@viralhub.app',
    avatar: '/src/assets/images/streamer_gaming_live_1790766798791.jpg',
    bio: 'Late Night Genshin & Valo Streamer | Road to 3M 🚀',
    followingCount: 0,
    followersCount: 0,
    likesCount: '0',
    isPrivate: false,
    isFollowing: false,
    role: 'creator',
  },
  {
    id: 'user_rene',
    username: 'renebutter',
    displayName: 'Rene Butter',
    email: 'rene@viralhub.app',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
    bio: 'Making funny skits every Tuesday & Friday',
    followingCount: 0,
    followersCount: 0,
    likesCount: '0',
    isPrivate: false,
    isFollowing: false,
  },
  {
    id: 'user_adili',
    username: 'adili_king',
    displayName: 'Adili King',
    email: 'adili@viralhub.app',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    bio: 'Varsity shooter | Basketball coaching highlights',
    followingCount: 0,
    followersCount: 0,
    likesCount: '0',
    isPrivate: false,
    isFollowing: false,
  }
];

export const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'audio_1',
    title: 'Cheerleader',
    artist: 'Porter Robinson',
    duration: '00:30',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'audio_2',
    title: "What's the meaning of...",
    artist: 'Takayan',
    duration: '00:30',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'audio_3',
    title: 'Getting Over You',
    artist: 'Hot Freaks',
    duration: '00:30',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'audio_4',
    title: 'Drift Phonk Overdrive',
    artist: 'NightCity Audio',
    duration: '00:30',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'audio_5',
    title: 'Lofi Coffee Shop Rain',
    artist: 'Chilled Cow Studio',
    duration: '00:30',
    coverUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid_1',
    creatorId: 'user_waylay',
    creator: INITIAL_USERS[3], // Waylay Soriano
    caption: "A phoenix doesn't fear the flames.",
    hashtags: ['#Phoenix', '#Top1Agent'],
    audioTrack: INITIAL_AUDIO_TRACKS[0],
    mediaUrl: '/src/assets/images/video_flame_agent_1790766811867.jpg',
    thumbnailUrl: '/src/assets/images/video_flame_agent_1790766811867.jpg',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: '0',
    isLiked: false,
    createdAt: '2 hours ago',
    reportsCount: 0,
  },
  {
    id: 'vid_2',
    creatorId: 'user_andrea',
    creator: INITIAL_USERS[0], // Andrea Ruiz
    caption: 'Morning routine ✨ toner essentials and healthy skin',
    hashtags: ['#Selfcare', '#MoringRoutine'],
    audioTrack: INITIAL_AUDIO_TRACKS[2],
    mediaUrl: '/src/assets/images/video_morning_routine_1790766824049.jpg',
    thumbnailUrl: '/src/assets/images/video_morning_routine_1790766824049.jpg',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: '0',
    isLiked: false,
    createdAt: '1 day ago',
    reportsCount: 0,
  },
  {
    id: 'vid_3',
    creatorId: 'user_jan',
    creator: INITIAL_USERS[2], // Jan Ahron
    caption: 'Hamster Plushie so cute and squishy! 🐹',
    hashtags: ['#Hamster', '#Plushie', '#Cute'],
    audioTrack: INITIAL_AUDIO_TRACKS[1],
    mediaUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: '0',
    isLiked: false,
    createdAt: '2 days ago',
    reportsCount: 0,
  },
  {
    id: 'vid_4',
    creatorId: 'user_jervin',
    creator: INITIAL_USERS[1], // Jervin Saludo
    caption: 'Boss atan dribble practice highlight and crossover drills 🏀',
    hashtags: ['#Basketball', '#DribbleDrill', '#Skills'],
    audioTrack: INITIAL_AUDIO_TRACKS[3],
    mediaUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&auto=format&fit=crop&q=80',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: '0',
    isLiked: false,
    createdAt: '3 days ago',
    reportsCount: 0,
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_jervin',
    participantIds: ['user_andrea', 'user_jervin'],
    participant: INITIAL_USERS[1], // Jervin Saludo
    lastMessage: 'pogi ko',
    lastMessageTime: 'Today, 6:18am',
    unreadCount: 0,
    unreadCounts: { user_andrea: 0, user_jervin: 0 },
    isOnline: true,
    lastSeen: '6:18am',
    messages: [
      {
        id: 'm1',
        conversationId: 'conv_jervin',
        senderId: 'user_jervin',
        text: 'How are you?',
        timestamp: 'Today, 8:30pm',
        isMine: false,
        status: 'read'
      },
      {
        id: 'm2',
        conversationId: 'conv_jervin',
        senderId: 'user_andrea',
        text: 'Hello!',
        timestamp: 'Today, 8:30pm',
        isMine: true,
        status: 'read'
      },
      {
        id: 'm3',
        conversationId: 'conv_jervin',
        senderId: 'user_andrea',
        text: 'I am fine and how are you?',
        timestamp: 'Today, 8:30pm',
        isMine: true,
        status: 'read'
      },
      {
        id: 'm4',
        conversationId: 'conv_jervin',
        senderId: 'user_jervin',
        text: 'I am doing well <3',
        timestamp: 'Today, 8:30pm',
        isMine: false,
        status: 'read'
      },
      {
        id: 'm5',
        conversationId: 'conv_jervin',
        senderId: 'user_andrea',
        text: 'pogi ko',
        timestamp: 'Today, 8:30pm',
        isMine: true,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_jan',
    participantIds: ['user_andrea', 'user_jan'],
    participant: INITIAL_USERS[2], // Jan Ahron
    lastMessage: 'pautang 5k',
    lastMessageTime: 'Today, 12:01pm',
    unreadCount: 0,
    unreadCounts: { user_andrea: 0, user_jan: 0 },
    isOnline: false,
    lastSeen: '12:05pm',
    messages: [
      {
        id: 'm_jan_1',
        conversationId: 'conv_jan',
        senderId: 'user_jan',
        text: 'oy Andrea, free ka ba?',
        timestamp: 'Today, 11:58am',
        isMine: false,
        status: 'read'
      },
      {
        id: 'm_jan_2',
        conversationId: 'conv_jan',
        senderId: 'user_jan',
        text: 'pautang 5k',
        timestamp: 'Today, 12:01pm',
        isMine: false,
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_rene',
    participantIds: ['user_andrea', 'user_rene'],
    participant: INITIAL_USERS[4], // Rene Butter
    lastMessage: 'mamaaaa!!',
    lastMessageTime: 'Yesterday, 9:52pm',
    unreadCount: 1, // Red 1 indicator as specified in user prompt!
    unreadCounts: { user_andrea: 1, user_rene: 0 },
    isOnline: true,
    lastSeen: 'Just now',
    messages: [
      {
        id: 'm_rene_1',
        conversationId: 'conv_rene',
        senderId: 'user_rene',
        text: 'did you see my new video?',
        timestamp: 'Yesterday, 9:50pm',
        isMine: false,
        status: 'read'
      },
      {
        id: 'm_rene_2',
        conversationId: 'conv_rene',
        senderId: 'user_rene',
        text: 'mamaaaa!!',
        timestamp: 'Yesterday, 9:52pm',
        isMine: false,
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv_adili',
    participantIds: ['user_andrea', 'user_adili'],
    participant: INITIAL_USERS[5], // Adili King
    lastMessage: 'ano na coach!',
    lastMessageTime: 'Yesterday, 4:29pm',
    unreadCount: 0,
    unreadCounts: { user_andrea: 0, user_adili: 0 },
    isOnline: false,
    lastSeen: 'Yesterday, 6:00pm',
    messages: [
      {
        id: 'm_adili_1',
        conversationId: 'conv_adili',
        senderId: 'user_adili',
        text: 'ano na coach!',
        timestamp: 'Yesterday, 4:29pm',
        isMine: false,
        status: 'read'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    recipientId: 'user_andrea',
    type: 'like',
    actor: {
      id: 'user_jervin',
      username: 'wry.jerv',
      displayName: 'Jervin Saludo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    targetText: 'liked your video: "Morning routine ✨ toner essentials and healthy skin"',
    timestamp: '5m ago',
    isUnread: true,
  },
  {
    id: 'notif_2',
    recipientId: 'user_andrea',
    type: 'follow',
    actor: {
      id: 'user_jervin',
      username: 'wry.jerv',
      displayName: 'Jervin Saludo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    targetText: 'started following you.',
    timestamp: '15m ago',
    isUnread: true,
  },
  {
    id: 'notif_3',
    recipientId: 'user_andrea',
    type: 'comment',
    actor: {
      id: 'user_jervin',
      username: 'wry.jerv',
      displayName: 'Jervin Saludo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    targetText: 'commented to your video: "Awesome skincare routine! ✨"',
    timestamp: '1h ago',
    isUnread: true,
  },
  {
    id: 'notif_4',
    recipientId: 'user_andrea',
    type: 'like',
    actor: {
      id: 'user_jan',
      username: 'imhandsome',
      displayName: 'Jan Ahron',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    targetText: 'liked your video: "Morning routine ✨ toner essentials and healthy skin"',
    timestamp: '2h ago',
    isUnread: false,
  },
  {
    id: 'notif_5',
    recipientId: 'user_andrea',
    type: 'follow',
    actor: {
      id: 'user_jan',
      username: 'imhandsome',
      displayName: 'Jan Ahron',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    targetText: 'started following you.',
    timestamp: '3h ago',
    isUnread: false,
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep_1',
    type: 'video',
    targetId: 'vid_4',
    targetName: "Jervin Saludo's video",
    targetSubtitle: 'for animal abuse.',
    targetThumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&auto=format&fit=crop&q=80',
    scenario: 'Animal abuse',
    status: 'Under Review',
    timestamp: '5/30/26 6:17 AM',
  },
  {
    id: 'rep_2',
    type: 'user',
    targetId: 'user_jervin',
    targetName: "Jervin Saludo's profile",
    targetSubtitle: 'for being handsome.',
    targetThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    scenario: 'Something else',
    description: 'for being too handsome',
    status: 'Approved',
    timestamp: '5/30/26 7:00 AM',
  }
];

export const INITIAL_LIVESTREAM: LiveStream = {
  id: 'stream_waylay',
  host: INITIAL_USERS[3], // Waylay Soriano
  title: "Let's play",
  topic: 'Gaming',
  aboutMe: 'Hello gais, wala lang',
  viewersCount: 67,
  viewers: [
    { id: 'v1', username: 'gekko', displayName: 'Gekko Oriola', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80', joinedAt: '5m ago' },
    { id: 'v2', username: 'yoru', displayName: 'Yoru Belga', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80', joinedAt: '4m ago' },
    { id: 'v3', username: 'reyna', displayName: 'Reyna Catan', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80', joinedAt: '2m ago' },
    { id: 'v4', username: 'clove', displayName: 'Clove Padilla', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', joinedAt: '1m ago' },
  ],
  isLive: true,
  timerSeconds: 1727, // ~28:47
  followerGoal: {
    current: 3024,
    target: 4100,
  },
  cameraEnabled: true,
  micEnabled: true,
  screenShareEnabled: false,
  messages: [
    {
      id: 'lm1',
      userId: 'v1',
      username: 'gekko',
      displayName: 'Gekko Oriola',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      text: 'has followed',
      timestamp: 'Just now',
      isSystemEvent: true,
    },
    {
      id: 'lm2',
      userId: 'v1',
      username: 'gekko',
      displayName: 'Gekko Oriola',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      text: 'joined the live',
      timestamp: 'Just now',
      isSystemEvent: true,
    },
    {
      id: 'lm3',
      userId: 'v1',
      username: 'gekko',
      displayName: 'Gekko Oriola',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      text: 'Sawadeeka',
      timestamp: '2m ago',
    },
    {
      id: 'lm4',
      userId: 'v2',
      username: 'yoru',
      displayName: 'Yoru Belga',
      avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
      text: 'What game is this',
      timestamp: '1m ago',
    },
    {
      id: 'lm5',
      userId: 'v3',
      username: 'reyna',
      displayName: 'Reyna Catan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      text: "IT'S A WOMAN!!!",
      timestamp: '1m ago',
    },
    {
      id: 'lm6',
      userId: 'v4',
      username: 'clove',
      displayName: 'Clove Padilla',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      text: 'Is she meta?',
      timestamp: '30s ago',
    }
  ]
};

// Safe storage access helpers
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(`viralhub_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`viralhub_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed', e);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(`viralhub_${key}`);
    } catch (e) {
      console.warn('Storage remove failed', e);
    }
  }
};
