import React from 'react';

const FooterComponent: React.FC = () => {
  return (
    <footer className="app-footer w-full mt-6 pt-4 pb-2 border-t flex flex-wrap items-center justify-between text-xs">
      {/* Right side in Persian (Left in RTL): روز صفر تا قله */}
      <div className="font-medium tracking-wide">
        روز صفر تا قله
      </div>

      {/* نشان برنامه */}
      <div className="flex items-center gap-2 font-medium tracking-wide">
        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]" />
        <span className="text-white/90">برنامه‌ریز صعود</span>
        <span className="text-purple-400">— روزانه</span>
      </div>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
Footer.displayName = 'Footer';
