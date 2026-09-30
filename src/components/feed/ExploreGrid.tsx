import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, MessageCircle, Share2, Play, Flag } from 'lucide-react';

export const ExploreGrid: React.FC = () => {
  const {
    videos,
    toggleLikeVideo,
    shareVideo,
    setCommentsVideoId,
    openReportModal,
    setActiveTab,
    searchQuery,
    setSearchQuery,
  } = useApp();

  // Filter videos if there is a search query
  const filteredVideos = videos.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().replace('#', '');
    return (
      v.caption.toLowerCase().includes(q) ||
      v.creator.displayName.toLowerCase().includes(q) ||
      v.creator.username.toLowerCase().includes(q) ||
      v.hashtags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Header section with active search tags if any */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-brand text-white">Explore</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Discover viral creators, trending sounds, and featured videos
          </p>
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 bg-[#181824] px-3 py-1.5 rounded-full border border-neutral-700 text-xs">
            <span className="text-neutral-400">Filtering:</span>
            <span className="text-[#ff007a] font-semibold">{searchQuery}</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-neutral-400 hover:text-white ml-1 font-bold"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Video Grid matching Screenshot 4 top left */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            className="group relative bg-[#13131a] rounded-3xl overflow-hidden border border-neutral-800 hover:border-[#ff007a]/60 shadow-lg transition-all flex flex-col aspect-[9/14]"
          >
            {/* Thumbnail with overlay gradient */}
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={video.thumbnailUrl || video.mediaUrl}
                alt={video.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Play icon overlay on hover */}
              <button
                onClick={() => setActiveTab('home')}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#ff007a]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-xl cursor-pointer"
              >
                <Play className="w-5 h-5 ml-0.5 fill-white" />
              </button>

              {/* Action buttons on the right side of the card (Screenshot match) */}
              <div className="absolute right-3 bottom-14 flex flex-col items-center gap-3 z-10">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleLikeVideo(video.id);
                  }}
                  className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                    video.isLiked
                      ? 'bg-pink-500/20 text-[#ff007a]'
                      : 'bg-black/40 text-white hover:text-[#ff007a]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${video.isLiked ? 'fill-[#ff007a]' : ''}`}
                  />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setCommentsVideoId(video.id);
                  }}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    shareVideo(video.id);
                  }}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    openReportModal({
                      type: 'video',
                      targetId: video.id,
                      targetName: `${video.creator.displayName}'s video`,
                      targetSubtitle: video.caption.slice(0, 35),
                      targetThumbnail: video.thumbnailUrl || video.mediaUrl,
                    });
                  }}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-red-400 transition-colors cursor-pointer"
                  title="Report Video"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Caption and Hashtags (Screenshot match) */}
              <div className="absolute bottom-3 left-3 right-12 z-10 text-left">
                <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                  {video.caption}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {video.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold text-[#ff007a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-20 text-neutral-400 text-sm">
          No videos matched "{searchQuery}". Try searching for #Phoenix, #Selfcare, or #Cute!
        </div>
      )}
    </div>
  );
};
