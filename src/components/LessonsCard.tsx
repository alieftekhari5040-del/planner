import React from 'react';
import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface Props {
  lessons: string[];
  onChange: (l: string[]) => void;
}

const HINTS = [
  'مهم‌ترین چیزی که امروز یاد گرفتم...',
  'چه کاری را فردا بهتر انجام می‌دهم؟',
  'یک لحظه مثبت یا شکرگزاری از امروز...',
  'ایده‌ای که می‌خواهم دنبال کنم...',
];

export const LessonsCard: React.FC<Props> = ({ lessons, onChange }) => {
  const set = (i: number, v: string) => { const u = [...lessons]; u[i] = v; onChange(u); };
  const add = () => onChange([...lessons, '']);
  const del = (i: number) => lessons.length > 1 && onChange(lessons.filter((_, j) => j !== i));

  return (
    <div className="card flex flex-col">
      {/* head */}
      <div className="card-head">
        <div className="card-head-left">
          <span className="accent accent-a" />
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span className="card-title">درس‌های امروز</span>
        </div>
        <span className="text-xs text-slate-600">تأمل شبانه</span>
      </div>

      {/* body */}
      <div className="card-body flex-1 space-y-0.5 py-2">
        {lessons.map((line, i) => (
          <div key={i} className="row-item group">
            <span className="num">{formatPersianNumber(i + 1)}</span>
            <input
              type="text" value={line}
              onChange={(e) => set(i, e.target.value)}
              placeholder={HINTS[i] ?? 'درس یا ایده...'}
              className="field"
              style={{ borderBottomColor: 'rgba(251,191,36,.2)' }}
            />
            <button type="button" onClick={() => del(i)}
              className="icon-btn no-print opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* foot */}
      <div className="card-foot no-print">
        <button type="button" onClick={add} className="btn btn-add text-xs">
          <Plus className="w-3.5 h-3.5" /> افزودن درس
        </button>
      </div>
    </div>
  );
};
