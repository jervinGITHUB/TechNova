/**
 * Supabase Client Configuration & Connectors
 * 
 * Supports both cloud Supabase project and seamless local fallback
 * for development, testing, and deployment to Vercel.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url,
    anonKey,
    isConnected: Boolean(url && anonKey),
  };
};

export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- VIRAL HUB DATABASE SCHEMA (SUPABASE POSTGRES)
-- Supports Rules BR-001 through BR-027
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (BR-001, BR-002, BR-011, BR-012)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  following_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  likes_count TEXT DEFAULT '0',
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. AUDIO LIBRARY TABLE (BR-015)
CREATE TABLE IF NOT EXISTS public.audio_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration TEXT DEFAULT '00:30',
  cover_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. VIDEOS TABLE (BR-013, BR-014, BR-015, BR-016, BR-022, BR-023)
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  audio_track_id UUID REFERENCES public.audio_library(id) ON DELETE SET NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count TEXT DEFAULT '0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COMMENTS TABLE (BR-018, BR-021)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  reply_to_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. LIKES TABLE (BR-014, BR-022, BR-024)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(video_id, user_id)
);

-- 6. FOLLOWS TABLE (BR-011, BR-012)
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(follower_id, following_id)
);

-- 7. CONVERSATIONS & MESSAGES (BR-005, BR-008, BR-009)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_one UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_two UUID REFERENCES public.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. LIVESTREAMS (BR-004, BR-010, BR-026, BR-027)
CREATE TABLE IF NOT EXISTS public.livestreams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  about_me TEXT,
  viewers_count INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.live_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  livestream_id UUID REFERENCES public.livestreams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. REPORTS (BR-006, BR-007, BR-017, BR-025)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL, -- 'video' | 'user'
  target_id TEXT NOT NULL,
  target_name TEXT NOT NULL,
  scenario TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Under Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. NOTIFICATIONS (BR-020, BR-021, BR-024)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  target_text TEXT,
  is_unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;
