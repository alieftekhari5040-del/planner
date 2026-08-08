import React, { useEffect } from 'react';
import { X, Clock, ArrowLeft, CalendarDays } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';
import { getAllSavedDates, loadPlannerData } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dateKey: string) => void;
  currentDateKey: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen, onClose, onSelectDate, currentDateKey,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const savedDates = getAllSavedDates();

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation" onClick={onClose}>
      <div className="modal-card relative w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
        role="dialog" aria-modal="true" aria-labelledby="history-title"
        onClick={(e) => e.stopPropagation()}>

        {/* دکمه بستن */}
        <button type="button" onClick={onClose} aria-label="بستن"
          className="absolute top-4 left-4 p-2 rounded-xl border transition cursor-pointer text-slate-400 hover:text-white"
          style={{ background: 'rgba(13,18,38,.7)', borderColor: 'rgba(139,92,246,.25)' }}>
          <X className="w-5 h-5" />
        </button>

        {/* هدر */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.4),rgba(67,56,202,.3))', border: '1px solid rgba(139,92,246,.35)' }}>
            <Clock className="w-4 h-4 text-violet-300" />
          </div>
          <h3 id="history-title" className="text-xl font-bold text-white">تاریخچه روزها</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5 pr-10">
          تمام روزهایی که ثبت کرده‌اید اینجا نمایش داده می‌شوند.
        </p>

        {savedDates.length === 0 ? (
          <div className="py-14 text-center">
            <CalendarDays className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">هنوز روزی ثبت نشده</p>
            <p className="text-slate-700 text-xs mt-1">با پر کردن پلنر امروز، خودکار ذخیره می‌شود.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {savedDates.map((dKey) => {
              const data = loadPlannerData(dKey);
              const pDone  = data.priorities?.filter((p) => p.completed).length || 0;
              const pTotal = data.priorities?.filter((p) => p.text?.trim()).length || 0;
              const sDone  = data.schedule?.filter((s) => s.completed).length || 0;
              const sTotal = data.schedule?.filter((s) => s.task?.trim()).length || 0;
              const total  = pTotal + sTotal;
              const done   = pDone  + sDone;
              const pct    = total > 0 ? Math.round((done / total) * 100) : 0;
              const isCurrent = dKey === currentDateKey;

              return (
                <button key={dKey} type="button"
                  onClick={() => { onSelectDate(dKey); onClose(); }}
                  className="w-full p-3.5 rounded-xl border text-right transition-all flex items-center justify-between group cursor-pointer"
                  style={{
                    background: isCurrent ? 'rgba(109,40,217,.22)' : 'rgba(13,18,38,.55)',
                    borderColor: isCurrent ? 'rgba(167,139,250,.5)' : 'rgba(139,92,246,.14)',
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: pct >= 80 ? '#34d399' : pct >= 40 ? '#a78bfa' : '#475569' }} />
                    <div>
                      <div className="text-sm font-bold text-slate-200">
                        {data.customDateText || dKey}
                        {data.selectedDayOfWeek && <span className="text-slate-500 font-normal mr-1.5">({data.selectedDayOfWeek})</span>}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {formatPersianNumber(done)} مورد انجام شده از {formatPersianNumber(total)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(109,40,217,.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,.25)' }}>
                      {formatPersianNumber(pct)}٪
                    </span>
                    <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:-translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
