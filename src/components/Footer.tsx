import React from 'react';

export const Footer: React.FC = () => (
  <footer className="app-footer w-full mt-6 pt-4 pb-2 border-t flex flex-wrap items-center justify-between text-xs gap-2">
    <div className="font-medium tracking-wide text-slate-500">
      روز صفر تا قله
    </div>
    <div className="flex items-center gap-2 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,.8)]" />
      <span className="text-slate-300">برنامه‌ریز صعود</span>
      <span className="text-slate-600">— روزانه</span>
    </div>
  </footer>
);
