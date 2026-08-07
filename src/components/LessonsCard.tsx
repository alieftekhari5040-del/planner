import React from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface LessonsCardProps {
  lessons: string[];
  onChange: (lessons: string[]) => void;
}

export const LessonsCard: React.FC<LessonsCardProps> = ({ lessons, onChange }) => {
  const handleLineChange = (index: number, value: string) => {
    const updated = [...lessons];
    updated[index] = value;
    onChange(updated);
  };

  const handleAddLine = () => {
    onChange([...lessons, '']);
  };

  const handleDeleteLine = (index: number) => {
    if (lessons.length <= 1) return;
    onChange(lessons.filter((_, idx) => idx !== index));
  };

  return (
    <div className="surface-card w-full mt-6 p-4 md:p-5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -bottom-10 left-1/3 w-64 h-24 bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Header with Red/Coral Accent Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            درس‌هایی که امروز گرفتم
          </h2>
        </div>

        <span className="text-[11px] text-purple-300/80 flex items-center gap-1.5 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>تأمل و بازبینی شبانه</span>
        </span>
      </div>

      {/* Lined Note Box matching bottom section */}
      <div className="surface-inset p-3.5 rounded-2xl space-y-3">
        {lessons.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2.5 group">
            <span className="text-xs font-bold text-purple-400/60 w-4 text-center">
              {formatPersianNumber(idx + 1)}
            </span>
            <input
              type="text"
              value={line}
              onChange={(e) => handleLineChange(idx, e.target.value)}
              placeholder={
                idx === 0
                  ? 'مهم‌ترین دستاورد یا نکته آموزنده‌ای که امروز یاد گرفتم...'
                  : idx === 1
                  ? 'چه چیزی را فردا می‌توانم بهتر و با انرژی‌تر انجام دهم؟'
                  : 'یک حس رضایت یا شکرگزاری بابت اتفاقات خوب امروز...'
              }
              className="w-full py-1 text-sm md:text-base text-purple-100 bg-transparent border-b border-purple-500/30 focus:border-purple-300 focus:outline-none transition placeholder-purple-400/30 font-medium"
            />
            <button
              type="button"
              onClick={() => handleDeleteLine(idx)}
              className="no-print opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-purple-400 hover:text-rose-400 transition cursor-pointer"
              title="حذف این خط"
              aria-label="حذف این خط"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Line button */}
      <div className="no-print mt-3 pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddLine}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-purple-100 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن سطر تامل جدید</span>
        </button>

        <span className="text-[10px] text-purple-400/50">
          امکان ویرایش آنلاین و نامحدود
        </span>
      </div>
    </div>
  );
};
