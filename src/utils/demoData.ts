import type { DailyPlannerData } from '../types/planner';
import type { JalaliDate } from './jalali';
import { getTodayJalali, getDateKey, formatPersianDateString } from './jalali';

export function getDemoPlannerData(referenceDate: JalaliDate = getTodayJalali()): DailyPlannerData {
  const today = referenceDate;
  const dateKey = getDateKey(today.jy, today.jm, today.jd);
  const formattedDate = formatPersianDateString(today.jy, today.jm, today.jd);

  return {
    dateKey,
    selectedDayOfWeek: today.dayName,
    customDateText: formattedDate,
    daySubtitle: 'هر روز یک قدم جلوتر به سمت اهداف بزرگ',
    mainFocus: 'پیاده‌سازی ماژول ردیاب عادت‌ها و بهینه‌سازی کامل نسخه دسکتاپ لپ‌تاپ',
    quickNotes: 'جلسه بازبینی نیازمندی‌ها ساعت ۱۴:۳۰ • خرید کتاب طراحی سیستم • تماس با هم‌بنیان‌گذار',
    waterGlasses: 6,
    priorities: [
      { id: 'demo-p1', text: 'طراحی معماری پایگاه‌داده و اتصال به سیستم احراز هویت', completed: true },
      { id: 'demo-p2', text: 'پیاده‌سازی ماژول ردیاب عادت‌ها و هیت‌مپ گیت‌هابی', completed: true },
      { id: 'demo-p3', text: 'جلسه هماهنگی تیم و بازبینی نیازمندی‌های مشتری', completed: false },
      { id: 'demo-p4', text: 'بهینه‌سازی ریسپانسیو برای لپ‌تاپ و صفحات موبایل', completed: false },
      { id: 'demo-p5', text: 'مرور اهداف مالی و برنامه‌ریزی ۳ ماهه آینده', completed: false },
    ],
    goals: [
      { id: 'demo-g1', text: 'اتمام حداقل ۵ ساعت کار عمیق و متمرکز بدون حواس‌پرتی', completed: true },
      { id: 'demo-g2', text: 'نوشیدن حداقل ۲ لیتر آب در طول روز', completed: true },
      { id: 'demo-g3', text: 'عدم باز کردن شبکه‌های اجتماعی قبل از ساعت ۱۸:۰۰', completed: false },
      { id: 'demo-g4', text: 'خواب منظم و خاموشی صفحات نمایش قبل از ساعت ۲۳:۳۰', completed: false },
    ],
    routines: [
      {
        id: 'r-reading',
        title: 'مطالعه تخصصی',
        icon: 'book',
        completed: true,
        detail: '۳۰ صفحه از کتاب «عادتهای اتمی» اثر جیمز کلیر'
      },
      {
        id: 'r-growth',
        title: 'تسک رشد فردی',
        icon: 'play',
        completed: true,
        detail: 'مشاهده یک اپیزود از دوره معماری سیستم‌های توزیع‌شده'
      },
      {
        id: 'r-workout',
        title: 'تمرین / بدنسازی',
        icon: 'dumbbell',
        completed: false,
        detail: '۴۵ دقیقه تمرین عضلات سینه و ۲۰ دقیقه هوازی'
      }
    ],
    schedule: [
      { id: 'demo-s1', task: 'بیدارباش، نوشیدن آب، ورزش کششی و مدیتیشن صبحگاهی', completed: true },
      { id: 'demo-s2', task: 'صبحانه مقوی و اولویت‌بندی تسک‌های کاری روز', completed: true },
      { id: 'demo-s3', task: 'بلاک کار عمیق ۱ (توسعه فیچرهای اصلی و کدنویسی بک‌اند)', completed: true },
      { id: 'demo-s4', task: 'استراحت فعال، نوشیدن چای و پیاده‌روی کوتاه', completed: true },
      { id: 'demo-s5', task: 'بلاک کار عمیق ۲ (پیاده‌سازی رابط کاربری و رفع باگ‌ها)', completed: false },
      { id: 'demo-s6', task: 'ناهار سبک، تنفس عمیق و استراحت چشم‌ها', completed: false },
      { id: 'demo-s7', task: 'پاسخ به تیکت‌ها، ایمیل‌ها و هماهنگی پروژه‌ها', completed: false },
      { id: 'demo-s8', task: 'مطالعه تخصصی و یادگیری تکنولوژی‌های جدید', completed: false },
      { id: 'demo-s9', task: 'باشگاه بدنسازی و دوش آب گرم', completed: false },
      { id: 'demo-s10', task: 'شام سالم و زمان با کیفیت با خانواده و دوستان', completed: false },
      { id: 'demo-s11', task: 'مرور دستاوردهای روز، شکرگزاری و برنامه‌ریزی فردا', completed: false },
      { id: 'demo-s12', task: 'مطالعه کتاب غیرداستانی و خاموشی وسایل الکترونیکی', completed: false },
    ],
    lessons: [
      'تمرکز روی یک کار در هر لحظه (تک‌کاری) بازدهی را ۲ برابر می‌کند.',
      'شروع روز با نوشیدن آب و تنفس عمیق، انرژی پایدار تا عصر را تضمین می‌کند.',
      'نوشتن اولویت‌های فردا در شب قبل، اضطراب خواب را از بین می‌برد.',
      'پیوستگی کوچک و روزانه بسیار قدرتمندتر از تلاش‌های نامنظم و خسته‌کننده است.'
    ],
  };
}
