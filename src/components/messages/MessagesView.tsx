import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Conversation, User } from '../../types';
import {
  Search,
  Send,
  CheckCheck,
  MoreVertical,
  Flag,
  User as UserIcon,
  Phone,
  Video as VideoCall,
  ArrowLeft,
  Ban,
  ArrowRightLeft
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    currentUser,
    users,
    conversations,
    activeConversationId,
    openConversation,
    sendMessage,
    messagesMobileView,
    setMessagesMobileView,
    navigateToUserProfile,
    openReportModal,
    quickLoginAs,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Determine the other participant in a conversation based on currentUser
  const getParticipant = (conv: Conversation): User => {
    if (!currentUser) return conv.participant;
    if (conv.participantIds && conv.participantIds.length > 0) {
      const otherId = conv.participantIds.find(id => id !== currentUser.id) || conv.participantIds[0];
      const found = users.find(u => u.id === otherId);
      if (found) return found;
    }
    if (conv.participant.id !== currentUser.id) {
      return conv.participant;
    }
    const fallback = users.find(u => u.id !== currentUser.id) || users[1];
    return fallback;
  };

  // Determine unread count for current user
  const getUnreadCount = (conv: Conversation): number => {
    if (!currentUser) return conv.unreadCount || 0;
    if (conv.unreadCounts && typeof conv.unreadCounts[currentUser.id] === 'number') {
      return conv.unreadCounts[currentUser.id];
    }
    return conv.unreadCount || 0;
  };

  const activeConv =
    conversations.find(c => c.id === activeConversationId) || conversations[0];

  const activeParticipant = activeConv ? getParticipant(activeConv) : null;

  const filteredConversations = conversations.filter(conv => {
    const p = getParticipant(conv);
    return (
      p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleSelectConversation = (convId: string) => {
    openConversation(convId);
    setMessagesMobileView('chat');
  };

  return (
    <div className="flex-1 p-2 sm:p-6 max-w-7xl mx-auto w-full h-[calc(100vh-4rem)] flex flex-col">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1e1e2c] border border-neutral-700 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Ban className="w-4 h-4 text-[#ff007a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 min-h-0">
        {/* ========================================================================= */}
        {/* Left Column (4 cols on desktop): Conversations List                       */}
        {/* On mobile: Shown when messagesMobileView === 'list', hidden when 'chat'   */}
        {/* ========================================================================= */}
        <div
          className={`${
            messagesMobileView === 'chat' ? 'hidden md:flex' : 'flex'
          } md:col-span-4 bg-[#13131a] rounded-3xl border border-neutral-800 p-4 sm:p-5 flex-col shadow-xl min-h-0 w-full`}
        >
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-brand text-white text-left">
                Messages
              </h2>
              <span className="text-xs text-neutral-400 font-medium">
                {conversations.length} chats
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mt-3 flex items-center">
              <div className="absolute left-3.5 text-neutral-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#181824] text-xs text-white placeholder-neutral-500 pl-9 pr-4 py-2.5 rounded-2xl border border-neutral-700/80 focus:border-[#ff007a] outline-none transition-all"
              />
            </div>
          </div>

          {/* Conversations Item List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-left">
            {filteredConversations.map(conv => {
              const participant = getParticipant(conv);
              const unread = getUnreadCount(conv);
              const isSelected = activeConv?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1e1e2c] border border-[#ff007a]/40 shadow-sm'
                      : 'hover:bg-[#181822]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={participant.avatar}
                        alt={participant.displayName}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#13131a]" />
                      )}
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {participant.displayName}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Timestamp & Unread Badge / Checkmark */}
                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <div className="text-[10px] text-neutral-500 font-medium">
                      {conv.lastMessageTime}
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                      {unread > 0 ? (
                        <span className="w-5 h-5 rounded-full bg-[#ff0033] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,0,51,0.6)] animate-pulse">
                          {unread}
                        </span>
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5 text-pink-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-xs">
                No conversations found.
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column (8 cols on desktop): Active Chat Session                     */}
        {/* On mobile: Shown when messagesMobileView === 'chat', hidden when 'list'   */}
        {/* Includes Back Arrow on mobile to return to conversations                  */}
        {/* ========================================================================= */}
        {activeConv && activeParticipant ? (
          <div
            className={`${
              messagesMobileView === 'list' ? 'hidden md:flex' : 'flex'
            } md:col-span-8 bg-[#13131a] rounded-3xl border border-neutral-800 p-4 sm:p-5 flex-col justify-between shadow-xl min-h-0 relative w-full`}
          >
            {/* Header: Back Arrow (on mobile) + Participant Info + Switch Account & Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* Mobile Back Arrow: lets user return to conversation list */}
                <button
                  type="button"
                  onClick={() => setMessagesMobileView('list')}
                  className="md:hidden p-2 -ml-1 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title="Back to conversations"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div
                  onClick={() => navigateToUserProfile(activeParticipant.id)}
                  className="relative cursor-pointer shrink-0"
                >
                  <img
                    src={activeParticipant.avatar}
                    alt={activeParticipant.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';
                    }}
                  />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#13131a]" />
                  )}
                </div>

                <div className="text-left min-w-0">
                  <h3
                    onClick={() => navigateToUserProfile(activeParticipant.id)}
                    className="text-sm font-bold text-white hover:text-[#ff007a] transition-colors cursor-pointer truncate"
                  >
                    {activeParticipant.displayName}
                  </h3>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {activeConv.isOnline ? 'Online' : 'Offline'} · Last seen, {activeConv.lastSeen || 'recently'}
                  </div>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
                <button
                  onClick={() => alert(`Calling ${activeParticipant.displayName} in demo mode...`)}
                  className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Starting video call with ${activeParticipant.displayName} in demo mode...`)}
                  className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Video Call"
                >
                  <VideoCall className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute top-10 right-0 w-44 bg-[#181824] border border-neutral-700 rounded-2xl p-1.5 shadow-xl z-40 text-left backdrop-blur-xl animate-fadeIn">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigateToUserProfile(activeParticipant.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#ff007a]" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          openReportModal({
                            type: 'user',
                            targetId: activeParticipant.id,
                            targetName: `${activeParticipant.displayName}'s profile`,
                            targetSubtitle: `@${activeParticipant.username}`,
                            targetThumbnail: activeParticipant.avatar,
                          });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-200 hover:text-[#ff007a] hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5 text-[#ff007a]" />
                        <span>Report User</span>
                      </button>
                      <div className="h-px bg-neutral-700/60 my-0.5" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          const msg = `${activeParticipant.displayName} has been blocked.`;
                          setToastMessage(msg);
                          setTimeout(() => setToastMessage(''), 3000);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5 text-red-400" />
                        <span>Block User</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Messages Bubbles Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-left min-h-0">
              {activeConv.messages.map(msg => {
                // Dynamically evaluate isMe based on currentUser
                const isMe = currentUser ? msg.senderId === currentUser.id : msg.isMine;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {/* Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-[#ff007a] text-white rounded-br-xs'
                          : 'bg-[#2a2a38] text-neutral-100 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Timestamp & Status */}
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-neutral-500">
                        {msg.timestamp}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-pink-400" />}
                    </div>
                  </div>
                );
              })}

              {activeConv.messages.length === 0 && (
                <div className="py-16 text-center text-xs text-neutral-500">
                  No messages yet. Say hello to {activeParticipant.displayName}!
                </div>
              )}
            </div>

            {/* Bottom Send Input Bar: "Type your message here..." + pink "Send" button */}
            <form onSubmit={handleSend} className="pt-3 border-t border-neutral-800 shrink-0">
              <div className="flex items-center gap-2 bg-[#181824] rounded-2xl px-4 py-2.5 border border-neutral-700/80 focus-within:border-[#ff007a] transition-all">
                <input
                  type="text"
                  placeholder={`Message ${activeParticipant.displayName}...`}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-xl transition-all ${
                    inputText.trim()
                      ? 'bg-[#ff007a] text-white hover:bg-[#e0006c] cursor-pointer shadow-[0_0_12px_rgba(255,0,122,0.4)]'
                      : 'text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex md:col-span-8 bg-[#13131a] rounded-3xl border border-neutral-800 p-8 items-center justify-center text-neutral-500 text-sm">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};
