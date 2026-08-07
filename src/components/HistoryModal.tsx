import React, { useEffect } from 'react';
import { X, Calendar, ArrowRight } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';
import { getAllSavedDates, loadPlannerData } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dateKey: string) => void;
  currentDateKey: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
  currentDateKey,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const savedDates = getAllSavedDates();

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div
        className="modal-card relative w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن تاریخچه"
          className="absolute top-4 left-4 p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 id="history-modal-title" className="text-xl font-bold text-white">تاریخچه روزهای ثبت شده</h3>
        </div>
        <p className="text-xs text-purple-300/70 mb-6">
          تمام روزهایی که برنامه‌ریزی کرده‌اید به طور خودکار در مرورگر شما ذخیره شده است:
        </p>

        {savedDates.length === 0 ? (
          <div className="py-12 text-center text-purple-400/60 text-sm">
            هنوز روزی ثبت نشده است. با پر کردن پلنر امروز، به طور خودکار ذخیره می‌شود!
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedDates.map((dKey) => {
              const data = loadPlannerData(dKey);
              const totalItems = (data.priorities?.length || 0) + (data.routines?.length || 0);
              const doneItems =
                (data.priorities?.filter((item) => item.completed)?.length || 0) +
                (data.routines?.filter((item) => item.completed)?.length || 0);
              const percent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;
              const isCurrent = dKey === currentDateKey;

              return (
                <button
                  type="button"
                  key={dKey}
                  onClick={() => {
                    onSelectDate(dKey);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-right transition flex items-center justify-between group cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-900/60 border-purple-400 text-white shadow-md shadow-purple-950'
                      : 'bg-[#140c38]/60 border-purple-500/30 hover:border-purple-400/60 text-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <div>
                      <div className="text-sm font-bold text-white">
                        {data.customDateText || dKey} ({data.selectedDayOfWeek || 'نامشخص'})
                      </div>
                      <div className="text-xs text-purple-300/60">
                        {formatPersianNumber(doneItems)} مورد انجام شده از {formatPersianNumber(totalItems)} تسک و روتین
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-300 bg-purple-950 px-2 py-1 rounded-lg border border-purple-500/30">
                      {formatPersianNumber(percent)}٪
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition" />
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
