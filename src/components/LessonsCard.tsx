import React from 'react';
import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface LessonsCardProps {
  lessons: string[];
  onChange: (lessons: string[]) => void;
}

export const LessonsCard: React.FC<LessonsCardProps> = ({ lessons, onChange }) => {
  const handleChange = (idx: number, val: string) => {
    const u = [...lessons]; u[idx] = val; onChange(u);
  };
  const handleAdd    = () => onChange([...lessons, '']);
  const handleRemove = (idx: number) => {
    if (lessons.length <= 1) return;
    onChange(lessons.filter((_, i) => i !== idx));
  };

  const placeholders = [
    'مهم‌ترین چیزی که امروز یاد گرفتم...',
    'چه کاری رو فردا بهتر انجام می‌دم؟',
    'یک نکته مثبت یا شکرگزاری از امروز...',
    'ایده‌ای که می‌خوام دنبال کنم...',
  ];

  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden">
      {/* glow */}
      <div className="absolute -bottom-8 left-1/3 w-64 h-24 bg-amber-600/8 blur-3xl pointer-events-none" />

      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="card-accent-bar accent-amber" />
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h2 className="text-base md:text-lg font-bold text-white">درس‌های امروز</h2>
        </div>
        <span className="badge badge-amber">
          <span>تأمل شبانه</span>
        </span>
      </div>

      {/* سطرها */}
      <div className="surface-inset p-3.5 rounded-xl space-y-3">
        {lessons.map((line, idx) => (
          <div key={idx} className="flex items-center gap-2.5 group">
            <span className="text-[11px] font-bold text-slate-600 w-4 text-center shrink-0">
              {formatPersianNumber(idx + 1)}
            </span>
            <input
              type="text"
              value={line}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder={placeholders[idx] ?? 'یک درس یا ایده...'}
              className="flex-1 py-1 text-sm text-slate-200 bg-transparent border-b border-slate-600/30 focus:border-amber-400/65 focus:outline-none transition placeholder-slate-700 font-medium"
            />
            <button type="button" onClick={() => handleRemove(idx)}
              className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-400 transition cursor-pointer"
              aria-label="حذف">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="no-print mt-3.5 pt-3 divider">
        <button type="button" onClick={handleAdd}
          className="btn mt-3 text-xs"
          style={{ background: 'rgba(217,119,6,.12)', borderColor: 'rgba(252,211,77,.22)', color: '#fcd34d' }}>
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن درس جدید</span>
        </button>
      </div>
    </div>
  );
};
