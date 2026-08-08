import React from 'react';

export const Footer: React.FC = () => (
  <footer className="app-footer w-full mt-8 pt-4 pb-1 border-t flex flex-wrap items-center justify-between text-xs gap-2">
    <span className="text-slate-700">روز صفر تا قله</span>
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 opacity-70" />
      <span className="text-slate-500 font-medium">برنامه‌ریز صعود</span>
    </div>
  </footer>
);
