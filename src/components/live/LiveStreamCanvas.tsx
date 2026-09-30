import React, { useRef, useEffect } from 'react';

export type LayoutMode = 'split' | 'pip' | 'game_only' | 'camera_only';
export type GamePreset = 'genshin' | 'valorant' | 'cyberpunk' | 'custom_screen';

export interface LiveStreamCanvasProps {
  layoutMode: LayoutMode;
  splitRatio: number; // e.g. 50 (50% camera, 50% game)
  cameraEnabled: boolean;
  cameraSource: 'webcam' | 'preset';
  pipPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  gameSource: GamePreset;
  gameCustomStream?: MediaStream | null;
  cameraRealStream?: MediaStream | null;
  showOverlays?: boolean;
  showMusicBanner?: boolean;
  showChatOverlay?: boolean;
  showGoalBar?: boolean;
  streamTitle?: string;
  hostName?: string;
  hostAvatar?: string;
  timerText?: string;
  isLive?: boolean;
}

export const LiveStreamCanvas: React.FC<LiveStreamCanvasProps> = ({
  layoutMode = 'split',
  splitRatio = 50,
  cameraEnabled = true,
  cameraSource = 'preset',
  pipPosition = 'top-right',
  gameSource = 'genshin',
  gameCustomStream = null,
  cameraRealStream = null,
  showOverlays = true,
  showMusicBanner = true,
  showChatOverlay = true,
  showGoalBar = true,
  hostName = 'Waylay Soriano',
  timerText = '28:67',
  isLive = true,
}) => {
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const gameVideoRef = useRef<HTMLVideoElement>(null);

  // Hook up real camera stream if provided
  useEffect(() => {
    if (cameraVideoRef.current && cameraRealStream) {
      cameraVideoRef.current.srcObject = cameraRealStream;
    }
  }, [cameraRealStream]);

  // Hook up real screen capture if provided
  useEffect(() => {
    if (gameVideoRef.current && gameCustomStream) {
      gameVideoRef.current.srcObject = gameCustomStream;
    }
  }, [gameCustomStream]);

  const getGameImage = () => {
    switch (gameSource) {
      case 'valorant':
        return '/src/assets/images/video_flame_agent_1790766811867.jpg';
      case 'cyberpunk':
        return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
      case 'genshin':
      default:
        return '/src/assets/images/game_fantasy_rpg_1790767871349.jpg';
    }
  };

  const getPipPositionClass = () => {
    switch (pipPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-12 left-4';
      case 'bottom-right':
        return 'bottom-12 right-4';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col select-none group">
      {/* ========================================================================= */}
      {/* 1. STACKED SPLIT LAYOUT (Matching Screenshot 2 & 3: Top Camera, Bottom Game) */}
      {/* ========================================================================= */}
      {layoutMode === 'split' && (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
          {/* Top Half: Camera Feed */}
          <div
            style={{ height: `${splitRatio}%` }}
            className="w-full relative overflow-hidden bg-neutral-900 border-b-2 border-[#ff007a]/60 transition-all duration-200"
          >
            {cameraEnabled ? (
              cameraSource === 'webcam' && cameraRealStream ? (
                <video
                  ref={cameraVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/src/assets/images/streamer_gaming_live_1790766798791.jpg"
                  alt="Host Camera"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#13131c] text-neutral-400">
                <span className="text-xs font-semibold">Camera is Turned Off</span>
                <span className="text-[10px] text-neutral-500 mt-1">
                  Click 'Add Source &gt; Camera' to put your camera into the layout
                </span>
              </div>
            )}

            {/* In-camera overlays matching Screenshots 2 & 3 */}
            {cameraEnabled && showOverlays && (
              <>
                {/* Follower Goal box on webcam (Screenshot: Follower goal 4083/4100 99%) */}
                {showGoalBar && (
                  <div className="absolute bottom-2 left-4 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-300">Follower goal</span>
                      <span className="text-[#ff007a] font-mono font-bold">4083 / 4100</span>
                      <span className="text-emerald-400 font-bold">99%</span>
                    </div>
                  </div>
                )}

                {/* UID Watermark on webcam (Screenshot: UID: 89476193) */}
                <div className="absolute bottom-2 right-4 z-10 text-[11px] font-mono font-bold text-white drop-shadow-md">
                  UID: 89476193
                </div>

                {/* Streamer In-cam Chat overlay snippets on left */}
                {showChatOverlay && (
                  <div className="absolute top-12 left-4 z-10 space-y-1 pointer-events-none max-w-[200px] hidden sm:block">
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-neutral-300 truncate">
                      <span className="text-[#ff007a] font-bold">Gekko: </span>Sawadeeka
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-neutral-300 truncate">
                      <span className="text-cyan-400 font-bold">Yoru: </span>What game is this
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Divider tag */}
          <div className="h-0.5 bg-[#ff007a] shadow-[0_0_8px_rgba(255,0,122,0.8)] z-20" />

          {/* Bottom Half: Game Display (Genshin / Valorant / Cyberpunk / Screen Share) */}
          <div
            style={{ height: `${100 - splitRatio}%` }}
            className="w-full relative overflow-hidden bg-neutral-950 transition-all duration-200"
          >
            {gameCustomStream ? (
              <video
                ref={gameVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={getGameImage()}
                alt="Game Display"
                className="w-full h-full object-cover"
              />
            )}

            {/* Game Screen Overlays matching Screenshot 2 & 3 */}
            {showOverlays && (
              <>
                {/* Music banner bottom-left: [MUSIC] Late Night Genshin (Screenshot match) */}
                {showMusicBanner && (
                  <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[10px] text-white">
                    <span className="text-[#ff007a] font-bold">[MUSIC]</span>
                    <span className="text-neutral-200 font-medium">Late Night Genshin</span>
                    <span className="text-neutral-400">· Billy Joel / Lofi</span>
                  </div>
                )}

                {/* Top Likers / Gifters widget on bottom right (Screenshot match) */}
                <div className="absolute bottom-3 right-4 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] text-white hidden sm:flex items-center gap-2">
                  <span className="text-[#ff007a] font-bold text-[9px]">TOP LIKERS/GIFTERS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PICTURE-IN-PICTURE (PiP) LAYOUT (Full Game + Floating Corner Camera)  */}
      {/* ========================================================================= */}
      {layoutMode === 'pip' && (
        <div className="w-full h-full relative overflow-hidden">
          {/* Main Full-Screen Game Display */}
          {gameCustomStream ? (
            <video
              ref={gameVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={getGameImage()}
              alt="Game Display"
              className="w-full h-full object-cover"
            />
          )}

          {/* Floating Corner Facecam Overlay */}
          {cameraEnabled && (
            <div
              className={`absolute ${getPipPositionClass()} z-20 w-36 sm:w-44 aspect-video rounded-2xl overflow-hidden border-2 border-[#ff007a] shadow-[0_0_15px_rgba(255,0,122,0.5)] bg-neutral-900`}
            >
              {cameraSource === 'webcam' && cameraRealStream ? (
                <video
                  ref={cameraVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/src/assets/images/streamer_gaming_live_1790766798791.jpg"
                  alt="Host Camera"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                Live Cam
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GAME ONLY LAYOUT                                                      */}
      {/* ========================================================================= */}
      {layoutMode === 'game_only' && (
        <div className="w-full h-full relative overflow-hidden">
          {gameCustomStream ? (
            <video
              ref={gameVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={getGameImage()}
              alt="Game Display"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CAMERA ONLY LAYOUT                                                    */}
      {/* ========================================================================= */}
      {layoutMode === 'camera_only' && (
        <div className="w-full h-full relative overflow-hidden bg-neutral-900">
          {cameraEnabled ? (
            cameraSource === 'webcam' && cameraRealStream ? (
              <video
                ref={cameraVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/src/assets/images/streamer_gaming_live_1790766798791.jpg"
                alt="Host Camera"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              Camera is Off
            </div>
          )}
        </div>
      )}

      {/* Global Stream Header Overlay (Host info + Live timer) */}
      {showOverlays && (
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          {/* Host Tag */}
          <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 pointer-events-auto">
            <div className="w-7 h-7 rounded-full bg-[#ff007a] flex items-center justify-center font-bold text-xs text-white overflow-hidden border border-[#ff007a]">
              {hostName.charAt(0)}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{hostName}</span>
                {isLive && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-white bg-[#ff007a] px-1.5 py-0.2 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timer & Live state */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white">
              {timerText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
