import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Radio,
  Flame,
  Sparkles
} from 'lucide-react';

interface VideoFeedCardProps {
  video: Video;
  isMuted: boolean;
  onToggleMute: () => void;
  onShare: (video: Video) => void;
}

const VideoFeedCard: React.FC<VideoFeedCardProps> = ({
  video,
  isMuted,
  onToggleMute,
  onShare,
}) => {
  const {
    toggleLikeVideo,
    setCommentsVideoId,
    openReportModal,
    navigateToUserProfile,
    setSearchQuery,
    setActiveTab,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(true);

  const formatCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="snap-start snap-always w-full aspect-[9/16] max-h-[calc(100vh-6rem)] bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800/90 relative group select-none shrink-0 mb-6">
      {/* Background Video Media / Poster */}
      <img
        src={video.mediaUrl}
        alt={video.caption}
        className="w-full h-full object-cover transition-transform duration-500"
        onError={e => {
          (e.currentTarget as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&auto=format&fit=crop&q=80';
        }}
      />

      {/* Dark Overlay Scrim for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 pointer-events-none" />

      {/* Top Header: Flag / Report Icon at top-right (Screenshot match) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() =>
            openReportModal({
              type: 'video',
              targetId: video.id,
              targetName: `${video.creator.displayName}'s video`,
              targetSubtitle: video.caption.slice(0, 30),
              targetThumbnail: video.thumbnailUrl,
            })
          }
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-neutral-300 hover:text-red-400 hover:bg-black/60 transition-all cursor-pointer"
          title="Report Video"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Top Left: Sound and Play/Pause Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* Right Action Rail (Screenshot match: Avatar, Like, Comment, Share) */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5">
        {/* Creator Avatar with click to navigate */}
        <div
          onClick={() => navigateToUserProfile(video.creator.id)}
          className="relative cursor-pointer group/avatar"
        >
          <img
            src={video.creator.avatar}
            alt={video.creator.displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover/avatar:border-[#ff007a] transition-all"
          />
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => toggleLikeVideo(video.id)}
            className={`p-2.5 rounded-full transition-all cursor-pointer transform active:scale-125 ${
              video.isLiked
                ? 'text-[#ff007a] bg-pink-500/20'
                : 'text-white hover:text-[#ff007a] bg-black/40 backdrop-blur-md hover:bg-black/60'
            }`}
            title="Like"
          >
            <Heart
              className={`w-6 h-6 ${video.isLiked ? 'fill-[#ff007a]' : ''}`}
            />
          </button>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow">
            {formatCount(video.likesCount)}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setCommentsVideoId(video.id)}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-cyan-400 hover:bg-black/60 transition-all cursor-pointer"
            title="Comments"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow">
            {formatCount(video.commentsCount)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => onShare(video)}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-emerald-400 hover:bg-black/60 transition-all cursor-pointer"
            title="Share"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <span className="text-[11px] font-semibold text-white mt-1 drop-shadow">
            {formatCount(video.sharesCount)}
          </span>
        </div>

        {/* Report Video Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() =>
              openReportModal({
                type: 'video',
                targetId: video.id,
                targetName: `${video.creator.displayName}'s video`,
                targetSubtitle: video.caption.slice(0, 35),
                targetThumbnail: video.thumbnailUrl,
              })
            }
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-red-400 hover:bg-black/60 transition-all cursor-pointer"
            title="Report Video"
          >
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Details Overlay: Creator, Caption, Hashtags, Audio */}
      <div className="absolute bottom-4 left-4 right-16 z-20 text-left">
        {/* Creator Handle */}
        <button
          onClick={() => navigateToUserProfile(video.creator.id)}
          className="text-sm font-bold text-white hover:text-[#ff007a] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>{video.creator.displayName}</span>
          <span className="text-xs text-neutral-300 font-normal">
            @{video.creator.username}
          </span>
        </button>

        {/* Caption */}
        <p className="text-xs sm:text-sm text-neutral-100 mt-1 line-clamp-2 leading-snug drop-shadow-md">
          {video.caption}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {video.hashtags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(tag);
                setActiveTab('explore');
              }}
              className="text-xs font-semibold text-[#ff007a] hover:underline cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Audio Track Ticker */}
        {video.audioTrack && (
          <div className="flex items-center gap-2 text-[11px] text-neutral-300 mt-2">
            <Music className="w-3.5 h-3.5 text-[#ff007a] animate-spin" />
            <span className="truncate">
              {video.audioTrack.title} — {video.audioTrack.artist}
            </span>
          </div>
        )}
      </div>

      {/* Animated Playing Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
        <div className="h-full bg-[#ff007a] w-3/4 animate-pulse" />
      </div>
    </div>
  );
};

export const HomeFeed: React.FC = () => {
  const {
    videos,
    shareVideo,
    setActiveTab,
    setSearchQuery,
    openLiveStreamAsViewer,
  } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Reference to the middle scrollable video container
  const videoFeedRef = useRef<HTMLDivElement>(null);

  const handleShare = (video: Video) => {
    shareVideo(video.id);
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // If user scrolls anywhere in the home feed area, ensure the video feed scrolls smoothly
  const handleContainerWheel = (e: React.WheelEvent) => {
    if (videoFeedRef.current && e.target !== videoFeedRef.current && !videoFeedRef.current.contains(e.target as Node)) {
      videoFeedRef.current.scrollBy({
        top: e.deltaY,
        behavior: 'auto',
      });
    }
  };

  return (
    <div
      onWheel={handleContainerWheel}
      className="w-full h-full overflow-hidden flex justify-center items-start gap-8 lg:gap-12 px-4 sm:px-8 py-3 select-none"
    >
      {/* Toast Notification when video link shared */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e2c] border border-[#ff007a]/40 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Share2 className="w-4 h-4 text-[#ff007a]" />
          <span>Link copied to clipboard & share notification sent!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MIDDLE: ONLY THIS SCROLLS (Scrollable Videos Feed Container with snap-y)    */}
      {/* ========================================================================= */}
      <div
        ref={videoFeedRef}
        className="flex-1 max-w-[430px] h-full overflow-y-auto snap-y snap-mandatory overscroll-contain no-scrollbar pt-1 pb-16"
      >
        {videos.map(video => (
          <VideoFeedCard
            key={video.id}
            video={video}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            onShare={handleShare}
          />
        ))}

        {videos.length === 0 && (
          <div className="flex items-center justify-center p-12 text-neutral-400 text-sm">
            No videos found in feed.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: COMPLETELY STATIC & FIXED (Live now & Trending do NOT scroll)  */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 space-y-6 pt-1 overflow-hidden pointer-events-auto">
        {/* "Live now" Widget matching Screenshot 6 bottom right */}
        <div className="bg-[#13131a] border border-neutral-800/80 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#ff007a] animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-brand">
                Live now
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('live')}
              className="text-xs text-[#ff007a] hover:underline font-semibold cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* Live stream preview card (Screenshot match: Late night music session - 1.2K watching) */}
          <div
            onClick={() => openLiveStreamAsViewer('stream_music')}
            className="relative rounded-2xl overflow-hidden aspect-[16/9] group cursor-pointer border border-neutral-800 hover:border-[#ff007a]/60 transition-all"
          >
            <img
              src="/src/assets/images/stream_music_session_1790766835492.jpg"
              alt="Late night music session"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Live Indicator Pill */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff007a] text-white text-[10px] font-bold shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </div>

            {/* Stream info */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
              <div className="text-xs font-bold text-white group-hover:text-[#ff007a] transition-colors truncate">
                Late night music session
              </div>
              <div className="text-[10px] text-neutral-300">1.2K watching</div>
            </div>
          </div>
        </div>

        {/* "Trending" Widget matching Screenshot 6 bottom right */}
        <div className="bg-[#13131a] border border-neutral-800/80 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-brand">
              Trending
            </h3>
          </div>

          <div className="space-y-3">
            {/* #WeekendVibes */}
            <button
              onClick={() => {
                setSearchQuery('#WeekendVibes');
                setActiveTab('explore');
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#181824] hover:bg-[#20202e] border border-neutral-800/80 transition-all cursor-pointer group text-left"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#ff007a] transition-colors">
                  #WeekendVibes
                </div>
                <div className="text-[11px] text-neutral-400">42.8K videos</div>
              </div>
              <span className="text-base">🔥</span>
            </button>

            {/* #CreatorLife */}
            <button
              onClick={() => {
                setSearchQuery('#CreatorLife');
                setActiveTab('explore');
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#181824] hover:bg-[#20202e] border border-neutral-800/80 transition-all cursor-pointer group text-left"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#ff007a] transition-colors">
                  #CreatorLife
                </div>
                <div className="text-[11px] text-neutral-400">18.2K videos</div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            {/* #Phoenix */}
            <button
              onClick={() => {
                setSearchQuery('#Phoenix');
                setActiveTab('explore');
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#181824] hover:bg-[#20202e] border border-neutral-800/80 transition-all cursor-pointer group text-left"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#ff007a] transition-colors">
                  #Phoenix
                </div>
                <div className="text-[11px] text-neutral-400">34.1K videos</div>
              </div>
              <span className="text-xs text-neutral-400">#Top1Agent</span>
            </button>

            {/* #Gaming */}
            <button
              onClick={() => {
                setSearchQuery('#Gaming');
                setActiveTab('explore');
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#181824] hover:bg-[#20202e] border border-neutral-800/80 transition-all cursor-pointer group text-left"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-[#ff007a] transition-colors">
                  #Gaming
                </div>
                <div className="text-[11px] text-neutral-400">55.4K videos</div>
              </div>
              <span className="text-xs text-neutral-400">🕹️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
