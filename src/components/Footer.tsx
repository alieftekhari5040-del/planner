import React from 'react';

export const Footer: React.FC = () => (
  <footer className="app-footer w-full mt-8 pt-4 pb-2 border-t flex flex-wrap items-center justify-between text-xs gap-2">
    <div className="font-medium text-slate-600 tracking-wide">
      روز صفر تا قله ✦
    </div>
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: 'linear-gradient(to bottom,#a78bfa,#7c3aed)', boxShadow: '0 0 6px rgba(139,92,246,.7)' }} />
      <span className="text-slate-400 font-semibold">برنامه‌ریز صعود</span>
      <span className="text-slate-700">— روزانه</span>
    </div>
  </footer>
);
