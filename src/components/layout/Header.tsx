import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    activeTab,
    setActiveTab,
    totalUnreadNotifications,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('explore');
    }
  };

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-neutral-800/80 bg-[#0d0d12]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Mobile Hamburger Menu Toggle */}
      <button
        onClick={onToggleMobileNav}
        className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/80 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center Search Input */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-xl relative flex items-center"
      >
        <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search creators, videos, hashtags..."
          className="w-full bg-[#181822] text-xs sm:text-sm text-white placeholder-neutral-500 pl-10 pr-4 py-2 sm:py-2.5 rounded-full border border-neutral-700/80 focus:border-[#ff007a] focus:ring-1 focus:ring-[#ff007a] outline-none transition-all"
        />
      </form>

      {/* Right Controls: Notification Bell + "+ Upload" Button */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Notification Bell */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`relative p-2.5 rounded-full transition-colors cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#ff007a]/20 text-[#ff007a]'
              : 'text-neutral-300 hover:text-white hover:bg-[#181822]'
          }`}
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-amber-400" />
          {totalUnreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#ff007a] shadow-[0_0_8px_rgba(255,0,122,0.8)] animate-pulse" />
          )}
        </button>

        {/* Hot Pink "+ Upload" Button (Screenshot match) */}
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-[#ff007a] to-[#d00062] hover:from-[#ff1a8c] hover:to-[#e6006c] text-white font-semibold text-xs sm:text-sm shadow-[0_0_15px_rgba(255,0,122,0.35)] transition-all cursor-pointer transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
};
