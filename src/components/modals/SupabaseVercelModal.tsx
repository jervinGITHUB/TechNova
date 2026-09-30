import React, { useState } from 'react';
import { getSupabaseConfig, SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import { Database, Cloud, Copy, Check, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface SupabaseVercelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseVercelModal: React.FC<SupabaseVercelModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const config = getSupabaseConfig();

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#13131a] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col max-h-[90vh] text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-brand">
                Supabase & Vercel Integration Guide
              </h2>
              <p className="text-xs text-neutral-400">
                Plug into your Supabase database and deploy seamlessly to Vercel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 text-xs">
          {/* Status Section */}
          <div className="p-4 rounded-2xl bg-[#181824] border border-neutral-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Connection State: {config.isConnected ? 'Cloud Connected' : 'Local Persistent Storage Mode (Active)'}
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Zero Configuration Required
              </span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              ViralHub is currently fully functional with instantaneous local persistence for videos, comments, direct messages, unread counters, reports, and livestreaming. When you're ready to connect your production Supabase database, simply add your credentials below.
            </p>
          </div>

          {/* Environment Variables Needed */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#ff007a]" />
              <span>1. Vercel & Supabase Environment Variables</span>
            </h3>
            <p className="text-neutral-400 mb-2">
              Set these environment variables in your Vercel Project Settings or local <code className="text-neutral-200">.env</code>:
            </p>
            <div className="bg-[#0c0c10] p-3 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1 select-all">
              <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
            </div>
          </div>

          {/* Supabase Schema SQL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2. Supabase SQL Schema (BR-001 through BR-027)</span>
              </h3>
              <button
                onClick={handleCopySchema}
                className="py-1 px-3 rounded-lg bg-[#ff007a] hover:bg-[#ff1a8c] text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <div className="bg-[#0c0c10] p-3 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-400 max-h-48 overflow-y-auto leading-relaxed">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>

          {/* Vercel Deployment Checklist */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>3. Deploy to Vercel in 2 Minutes</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-300">
              <li>Push this repository to your GitHub or GitLab.</li>
              <li>Go to <span className="text-white font-semibold">Vercel.com</span> → Add New Project → Import repository.</li>
              <li>Framework Preset is automatically detected as <span className="text-[#ff007a] font-semibold">Vite</span>.</li>
              <li>Add the environment variables in Vercel settings and click <span className="text-white font-semibold">Deploy</span>!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
