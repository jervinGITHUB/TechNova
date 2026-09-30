import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Heart } from 'lucide-react';

interface CommentEntry {
  id: string;
  name: string;
  avatar: string;
  text: string;
  replyTo?: string;
  replies?: {
    id: string;
    name: string;
    avatar: string;
    text: string;
  }[];
}

const INITIAL_COMMENTS: CommentEntry[] = [
  {
    id: 'c1',
    name: 'Gekko Oriola',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    text: 'Unc, what are you yapping about?',
    replies: [
      {
        id: 'c1_r1',
        name: 'Waylay Soriano',
        avatar: '/src/assets/images/streamer_gaming_live_1790766798791.jpg',
        text: 'stfu',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Yoru Belga',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&auto=format&fit=crop&q=80',
    text: 'Boss tumalna ka man',
  },
  {
    id: 'c3',
    name: 'Reyna Catan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    text: 'Your flames are loud. Your performance is not good enough',
  },
  {
    id: 'c4',
    name: 'Waylay Soriano',
    avatar: '/src/assets/images/streamer_gaming_live_1790766798791.jpg',
    text: '0/13/2',
  },
];

export const CommentsDrawer: React.FC = () => {
  const { commentsVideoId, setCommentsVideoId, currentUser, addCommentToVideo } = useApp();
  const [commentList, setCommentList] = useState<CommentEntry[]>(INITIAL_COMMENTS);
  const [inputVal, setInputVal] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  if (!commentsVideoId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !currentUser) return;

    if (replyingTo) {
      setCommentList(prev =>
        prev.map(c => {
          if (c.id === replyingTo) {
            return {
              ...c,
              replies: [
                ...(c.replies || []),
                {
                  id: `r_${Date.now()}`,
                  name: currentUser.displayName,
                  avatar: currentUser.avatar,
                  text: inputVal.trim(),
                },
              ],
            };
          }
          return c;
        })
      );
      setReplyingTo(null);
    } else {
      const newEntry: CommentEntry = {
        id: `c_${Date.now()}`,
        name: currentUser.displayName,
        avatar: currentUser.avatar,
        text: inputVal.trim(),
      };
      setCommentList(prev => [...prev, newEntry]);
    }

    addCommentToVideo(commentsVideoId, inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={() => setCommentsVideoId(null)}
      />

      {/* Comments Container matching Screenshot 6 bottom left */}
      <div className="relative w-full max-w-md bg-[#13131a] border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] z-10">
        {/* Header: Comments + Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white font-brand">Comments</h2>
          <button
            onClick={() => setCommentsVideoId(null)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Comments List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {commentList.map(comment => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-700"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">
                      {comment.name}
                    </span>
                    <button className="text-neutral-500 hover:text-[#ff007a] transition-colors p-1">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                    {comment.text}
                  </p>
                  <button
                    onClick={() => {
                      setReplyingTo(comment.id);
                      setInputVal(`@${comment.name} `);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-[#ff007a] font-medium mt-1 cursor-pointer"
                  >
                    reply
                  </button>
                </div>
              </div>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-10 space-y-2">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex items-start gap-2.5">
                      <img
                        src={reply.avatar}
                        alt={reply.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-700"
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-white">
                          {reply.name}
                        </span>
                        <p className="text-xs text-neutral-300 mt-0.5">
                          {reply.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Replying banner */}
        {replyingTo && (
          <div className="px-3 py-1.5 bg-[#1b1b26] rounded-xl text-[11px] text-[#ff007a] flex items-center justify-between mb-2">
            <span>Replying to comment...</span>
            <button
              onClick={() => {
                setReplyingTo(null);
                setInputVal('');
              }}
              className="text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Form matching Screenshot 6: "Add comment" with hot pink send icon */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2 bg-[#181824] rounded-2xl px-4 py-2 border border-neutral-700 focus-within:border-[#ff007a] transition-all">
            <input
              type="text"
              placeholder="Add comment"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-1.5 text-[#ff007a] hover:text-[#ff3399] disabled:opacity-30 disabled:hover:text-[#ff007a] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
