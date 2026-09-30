import React from 'react';
import { useApp } from '../../context/AppContext';
import { Radio, Users, Sparkles, PlusCircle } from 'lucide-react';

export const LiveBrowse: React.FC = () => {
  const { setActiveTab, openLiveStreamAsViewer } = useApp();

  const mockStreams = [
    {
      id: 'stream_waylay',
      title: 'Valorant Ranked & Road to Immortal 3',
      creatorName: 'Waylay Soriano',
      creatorHandle: '@waylay',
      avatar: '/src/assets/images/streamer_gaming_live_1790766798791.jpg',
      thumbnail: '/src/assets/images/streamer_gaming_live_1790766798791.jpg',
      viewers: 67,
      category: 'Gaming',
    },
    {
      id: 'stream_music',
      title: 'Music Session',
      creatorName: 'Wizz_chips',
      creatorHandle: '@wizz_chips',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
      thumbnail: '/src/assets/images/stream_music_session_1790766835492.jpg',
      viewers: 1240,
      category: 'Music',
    },
    {
      id: 'stream_drag',
      title: 'Drag Race Queens Mukbang',
      creatorName: 'Trixie Mattel',
      creatorHandle: '@trixiemattel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80',
      viewers: 3410,
      category: 'Entertainment',
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Top Banner with "GO LIVE NOW!" button matching Screenshot 4 top right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-brand text-white flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-[#ff007a] animate-pulse" />
            <span>Live Streams</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Join real-time interactive streams or start your own broadcast studio
          </p>
        </div>

        {/* Hot Pink "GO LIVE NOW!" Button (Screenshot match) */}
        <button
          onClick={() => setActiveTab('live_host_setup')}
          className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#ff007a] to-[#d00062] hover:from-[#ff1a8c] hover:to-[#e6006c] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(255,0,122,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95 animate-pulse"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>GO LIVE NOW!</span>
        </button>
      </div>

      {/* Featured Stream Cards matching Screenshot 4 top right */}
      <div className="space-y-6">
        {mockStreams.map(stream => (
          <div
            key={stream.id}
            onClick={() => openLiveStreamAsViewer(stream.id)}
            className="group relative bg-[#13131a] rounded-3xl overflow-hidden border border-neutral-800 hover:border-[#ff007a]/60 shadow-xl transition-all cursor-pointer aspect-[21/9] sm:aspect-[24/9]"
          >
            {/* Background Stream Visual */}
            <img
              src={stream.thumbnail}
              alt={stream.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

            {/* Top-Left Red Live Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007a] text-white text-xs font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>Live</span>
            </div>

            {/* Viewers Counter Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium">
              <Users className="w-3.5 h-3.5 text-[#ff007a]" />
              <span>{stream.viewers.toLocaleString()} watching</span>
            </div>

            {/* Bottom Stream Details */}
            <div className="absolute bottom-4 left-4 right-4 text-left flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-[#ff007a] transition-colors drop-shadow-md">
                  {stream.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={stream.avatar}
                    alt={stream.creatorName}
                    className="w-5 h-5 rounded-full object-cover border border-white"
                  />
                  <span className="text-xs text-neutral-200 font-medium">
                    {stream.creatorName}
                  </span>
                  <span className="text-xs text-neutral-400 font-normal">
                    {stream.creatorHandle}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#ff007a] bg-pink-500/10 border border-[#ff007a]/30 px-4 py-2 rounded-xl group-hover:bg-[#ff007a] group-hover:text-white transition-all">
                <span>Join Stream</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
