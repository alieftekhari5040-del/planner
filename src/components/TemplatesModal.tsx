import React, { useEffect } from 'react';
import { X, Briefcase, GraduationCap, Rocket, Coffee, Sparkles } from 'lucide-react';
import type { DailyPlannerData } from '../types/planner';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: Partial<DailyPlannerData>) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
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

  const templates = [
    {
      id: 'deep-work',
      title: 'روز کاری فوق متمرکز و برنامه‌نویسی',
      icon: <Briefcase className="w-5 h-5 text-indigo-400" />,
      desc: 'مناسب برای برنامه‌نویسان، طراحان و مدیران محصول با بلاک‌های عمیق کاری و تسک‌های اولویت‌دار.',
      data: {
        priorities: [
          { id: 'p-1', text: 'پیاده‌سازی فیچر اصلی محصول / حل باگ بحرانی', completed: false },
          { id: 'p-2', text: 'جلسه بازبینی کد و هماهنگی با تیم', completed: false },
          { id: 'p-3', text: 'مستندسازی و تست‌های واحد پروژه', completed: false },
          { id: 'p-4', text: 'پاسخ به ایمیل‌ها و هماهنگی‌های پیام‌رسان', completed: false },
          { id: 'p-5', text: 'مرور اهداف هفته و اولویت‌های فردا', completed: false },
        ],
        goals: [
          { id: 'g-1', text: 'اتمام حداقل ۳ بلاک تمرکز عمیق (۹۰ دقیقه‌ای)', completed: false },
          { id: 'g-2', text: 'عدم چک کردن شبکه‌های اجتماعی در ساعات کاری', completed: false },
          { id: 'g-3', text: 'نوشیدن حداقل ۲ لیتر آب در طول روز', completed: false },
        ],
        routines: [
          { id: 'r-reading', title: 'مطالعه', icon: 'book' as const, completed: false, detail: '۳۰ صفحه از کتاب «طراحی برنامه‌های داده‌محور»' },
          { id: 'r-growth', title: 'تسک رشد فردی', icon: 'play' as const, completed: false, detail: 'مشاهده دوره معماری سیستم و میکروسرویس' },
          { id: 'r-workout', title: 'تمرین / بدنسازی', icon: 'dumbbell' as const, completed: false, detail: 'تمرین عضلات سینه و ۳۰ دقیقه پیاده‌روی سریع' }
        ]
      }
    },
    {
      id: 'study-master',
      title: 'روز مطالعه و کنکور / آزمون بین‌المللی',
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      desc: 'برنامه‌ریزی دقیق برای یادگیری، تست‌زنی، مرور لغات زبان یا آمادگی آزمون‌های سخت.',
      data: {
        priorities: [
          { id: 'p-1', text: 'مرور مبحث تئوری درس اصلی و خلاصه‌نویسی', completed: false },
          { id: 'p-2', text: 'حل حداقل ۵۰ تست با تحلیل پاسخنامه', completed: false },
          { id: 'p-3', text: 'مرور فلش‌کارت‌های لغات تخصصی / انگلیسی', completed: false },
          { id: 'p-4', text: 'رفع اشکال نکات علامت‌دار آزمون قبلی', completed: false },
          { id: 'p-5', text: 'جمع‌بندی و تست زمان‌دار شبانه', completed: false },
        ],
        goals: [
          { id: 'g-1', text: 'رسیدن به ۸ ساعت مطالعه خالص مفید', completed: false },
          { id: 'g-2', text: 'تحلیل دقیق اشتباهات بدون به تعویق انداختن', completed: false },
          { id: 'g-3', text: 'خواب منظم ساعت ۲۳:۳۰ شب', completed: false },
        ]
      }
    },
    {
      id: 'startup-builder',
      title: 'روز استارتاپ و خلق محصول',
      icon: <Rocket className="w-5 h-5 text-rose-400" />,
      desc: 'تمرکز روی جذب کاربر، توسعه محصول، مارکتینگ، تولید محتوا و تحلیل داده‌ها.',
      data: {
        priorities: [
          { id: 'p-1', text: 'صحبت با ۳ کاربر واقعی و دریافت بازخورد محصول', completed: false },
          { id: 'p-2', text: 'بهینه‌سازی لندینگ پیج و فرآیند آنبوردینگ', completed: false },
          { id: 'p-3', text: 'انتشار پست بلاگ / ترد آموزشی در توییتر و لینکدین', completed: false },
          { id: 'p-4', text: 'بررسی شاخص‌های ثبت‌نام و مسیر فروش', completed: false },
          { id: 'p-5', text: 'برنامه‌ریزی کمپین هفته آینده', completed: false },
        ]
      }
    },
    {
      id: 'weekend-flow',
      title: 'روز ریکاوری، آخر هفته و آرامش ذهن',
      icon: <Coffee className="w-5 h-5 text-teal-400" />,
      desc: 'تنظیم روتین‌های آرامش‌بخش، مطالعه آزاد، ورزش هوازی، طبیعت‌گردی و تجدید قوا.',
      data: {
        priorities: [
          { id: 'p-1', text: 'پیاده‌روی یا کوهنوردی در هوای آزاد', completed: false },
          { id: 'p-2', text: 'مطالعه کتاب داستان یا فلسفی مورد علاقه', completed: false },
          { id: 'p-3', text: 'تماس با خانواده و دوستان صمیمی', completed: false },
          { id: 'p-4', text: 'پاکسازی و مرتب کردن اتاق و میز کار', completed: false },
          { id: 'p-5', text: 'مرور دستاوردهای هفته و نوشتن شکرگزاری', completed: false },
        ]
      }
    }
  ];

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div
        className="modal-card relative w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="templates-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن قالب‌ها"
          className="absolute top-4 left-4 p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 id="templates-modal-title" className="text-xl font-bold text-white">قالب‌های آماده روزانه</h3>
        </div>
        <p className="text-xs text-purple-300/70 mb-6">
          یک قالب از پیش طراحی شده را انتخاب کنید تا سریعاً فیلدهای پلنر شما پر شود:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl border border-purple-500/30 bg-[#130b3a]/70 hover:border-purple-400/80 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/30">
                    {tpl.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-200">
                    {tpl.title}
                  </h4>
                </div>
                <p className="text-xs text-purple-300/70 line-clamp-2 mb-4 leading-relaxed">
                  {tpl.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onApplyTemplate(tpl.data);
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-purple-900/60 hover:bg-purple-700/80 border border-purple-500/30 text-xs font-bold text-white transition shadow-sm cursor-pointer"
              >
                اعمال این قالب به امروز
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
