import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  UserPlus,
  Check,
  MoreVertical,
  Flag,
  Ban,
  Lock,
  Play,
  Sliders,
  ShieldAlert
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    selectedUserId,
    users,
    videos,
    toggleFollowUser,
    openReportModal,
    openConversationWithUser,
    setActiveTab,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'videos' | 'liked'>('videos');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Identify target profile: either selected user or current user
  const isSelf = !selectedUserId || (currentUser && selectedUserId === currentUser.id);
  const targetUser = isSelf
    ? (users.find(u => u.id === currentUser?.id) || currentUser)
    : (users.find(u => u.id === selectedUserId) || users[1]);

  if (!targetUser) {
    return <div className="p-8 text-neutral-400">User not found</div>;
  }

  // Videos associated with this user
  const userVideos = videos.filter(v => v.creatorId === targetUser.id);
  const likedVideos = videos.filter(v => v.isLiked);

  // Private profile check (BR-002 matching Screenshot 5 top right)
  const isPrivateLocked = !isSelf && targetUser.isPrivate && !targetUser.isFollowing;

  const handleMessageUser = () => {
    openConversationWithUser(targetUser.id);
  };

  const handleBlockUser = () => {
    setMenuOpen(false);
    setIsBlocked(prev => !prev);
    const msg = !isBlocked
      ? `${targetUser.displayName} has been blocked.`
      : `${targetUser.displayName} has been unblocked.`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleReportUser = () => {
    setMenuOpen(false);
    openReportModal({
      type: 'user',
      targetId: targetUser.id,
      targetName: `${targetUser.displayName}'s profile`,
      targetSubtitle: `@${targetUser.username}`,
      targetThumbnail: targetUser.avatar,
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full text-left relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e2c] border border-neutral-700 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Ban className="w-4 h-4 text-red-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header matching Screenshot 5 & Screenshot 1 top right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-neutral-800">
        {/* Avatar */}
        <div className="relative">
          <img
            src={targetUser.avatar}
            alt={targetUser.displayName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-neutral-700/80 shadow-2xl"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
            }}
          />
          {targetUser.isPrivate && (
            <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-brand text-white">
                {targetUser.displayName}
              </h1>
              {/* @user placed below display name */}
              <div className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
                @{targetUser.username}
              </div>
            </div>

            {/* Action Buttons */}
            {isSelf ? (
              <button
                onClick={() => setActiveTab('edit_profile')}
                className="py-1.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 relative self-start sm:self-auto">
                {/* Follow Button */}
                <button
                  onClick={() => toggleFollowUser(targetUser.id)}
                  className={`py-1.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    targetUser.isFollowing
                      ? 'bg-neutral-800 border border-neutral-600 text-neutral-300 hover:text-white'
                      : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                >
                  {targetUser.isFollowing ? 'Following' : 'Follow'}
                </button>

                {/* Message Button */}
                <button
                  onClick={handleMessageUser}
                  className="py-1.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Message
                </button>

                {/* 3 Dots Menu Button on the right corner after Follow and Message */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors border border-neutral-700 cursor-pointer flex items-center justify-center"
                    title="More options"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown with Report and Block */}
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="absolute top-10 right-0 w-36 bg-[#181824] border border-neutral-700 rounded-2xl p-1.5 shadow-2xl z-40 flex flex-col gap-1 backdrop-blur-xl animate-fadeIn">
                        {/* Report Option */}
                        <button
                          onClick={handleReportUser}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-neutral-200 hover:text-[#ff007a] hover:bg-[#222232] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5 text-[#ff007a]" />
                          <span>Report</span>
                        </button>

                        <div className="h-px bg-neutral-700/60 my-0.5" />

                        {/* Block Option */}
                        <button
                          onClick={handleBlockUser}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5 text-red-400" />
                          <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-xl">
            {targetUser.bio}
          </p>

          {/* Stats: Following, Followers, Likes */}
          <div className="flex items-center gap-6 pt-1 text-sm font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{targetUser.followingCount}</span>
              <span className="text-neutral-400 text-xs font-normal">Following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">
                {targetUser.followersCount >= 1000
                  ? `${(targetUser.followersCount / 1000).toFixed(0)}K`
                  : targetUser.followersCount}
              </span>
              <span className="text-neutral-400 text-xs font-normal">Followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{targetUser.likesCount}</span>
              <span className="text-neutral-400 text-xs font-normal">Likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked notice banner if user is blocked */}
      {isBlocked && (
        <div className="my-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 shrink-0" />
            <span>You have blocked this account. You won't receive messages or see new updates from them.</span>
          </div>
          <button
            onClick={handleBlockUser}
            className="text-white underline hover:no-underline font-semibold"
          >
            Unblock
          </button>
        </div>
      )}

      {/* Tabs: Videos vs Liked */}
      <div className="flex items-center gap-8 border-b border-neutral-800 mt-6 mb-6">
        <button
          onClick={() => setActiveTabSub('videos')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            activeTabSub === 'videos'
              ? 'text-white border-b-2 border-[#ff007a]'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          Videos
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTabSub('liked')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTabSub === 'liked'
                ? 'text-white border-b-2 border-[#ff007a]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Liked
          </button>
        )}
      </div>

      {/* Content Display: Private notice OR Blocked notice OR Video Grid */}
      {isBlocked ? (
        <div className="py-20 text-center space-y-2 text-neutral-400 text-xs">
          <Ban className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
          <p>Content hidden because this user is blocked.</p>
        </div>
      ) : isPrivateLocked ? (
        /* Private Profile POV matching Screenshot 5 top right */
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Only approved followers can see these videos.
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            This account is private. Follow {targetUser.displayName} to send a follow request and view their content.
          </p>
        </div>
      ) : (
        /* Public Video Grid matching Screenshot 5 */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(activeTabSub === 'videos' ? (userVideos.length > 0 ? userVideos : videos) : likedVideos).map(
            (video, idx) => (
              <div
                key={`${video.id}_${idx}`}
                onClick={() => setActiveTab('home')}
                className="group relative aspect-[9/13] bg-[#181824] rounded-2xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-[#ff007a]/60 transition-all shadow-md"
              >
                <img
                  src={video.thumbnailUrl || video.mediaUrl}
                  alt={video.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* View count at bottom-left */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                  <Play className="w-3 h-3 fill-white" />
                  <span>{video.viewsCount || '103K'}</span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
