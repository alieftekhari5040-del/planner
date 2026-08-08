# تغییرات

این فایل تغییرات مهم پروژه را ثبت می‌کند. نسخه‌بندی بر اساس [SemVer](https://semver.org/lang/fa/) — هر چت یک نسخه می‌گیرد تا مثل گیت بتوان به عقب برگشت.

## [1.1.0] - ۱۴۰۵/۰۵/۱۷

### افزوده‌شده
- PWA نصب‌پذیر: `vite-plugin-pwa` + `workbox`، آیکون‌های 192/512، `manifest` و `sw.js` با precache 42 فایل (895 KiB) — نصب روی دسکتاپ اوبونتو
- اجرای خودکار بدون ترمینال: `scripts/setup-autostart.sh` + `deploy/planner.service` (systemd) برای `npm run preview -- --host 0.0.0.0 --port 4173`
- هوک‌های جدید: `useJalaliNavigation`, `usePlannerData`, `useHabits`, `useCompletionCelebration`, `useFocusTrap`
- تست ناوبری روزهای هفته: `tests/hooks/useJalaliNavigation.test.ts`

### تغییر یافته
- ساختار به Feature-Sliced: `components/{layout,planner,modals,habits,analytics}` + `hooks/` + `styles/` + barrelها
- `App.tsx` از 493 به 164 خط با `React.memo` و `React.lazy` برای habits/analytics
- `vite.config.ts` با `manualChunks` (vendor/habits/analytics) — باندل اولیه از 308kB به 57kB
- `Header`: حذف «نمونه آزمایشی» و «تایمر تمرکز» برای سایت واقعی
- `TopNavTabs`: حذف برچسب «ویژه»
- `App` گرید: برنامه امروز تنها بالا (7 ستون وسط)، اولویت/اهداف 6/6 پایین — عرض قشنگ اول حفظ شد
- `ScheduleCard`: `input` به `textarea` با auto-resize، `min-h 52px` برای خالی و کش تا 96px برای متن بلند
- `habitStorage` و `storage` کلید `v3` + پاکسازی خودکار `v1/v2` تا شروع 0/7 واقعی
- `useJalaliNavigation`: کلیک روزهای هفته اکنون با `addDaysToJalali(diff)` واقعاً به تاریخ می‌رود (قبلاً فقط هایلایت)
- `usePlannerData`: `completionStats` دیگر روتین‌ها را نمی‌شمارد (همگام با حذف کارت)
- `AnalyticsPage`: حذف روتین‌ها از KPI و بخش‌ها
- `storage`: اولویت‌ها از 5 به 4 در شروع

### حذف شده
- `PomodoroModal.tsx` و `demoData.ts` (دیگر به هیچ UI وصل نبود)
- `RoutinesCard.tsx` (بخش «اولویت امروز (عادت‌های کلیدی)») — کامل حذف

### رفع اشکال
- ماتریس عادت: حذف `generateMockHistory` نمایشی — تاریخچه اکنون واقعی و خالی
- ناوبری هفته: فیکس باگ هایلایت بدون جابجایی تاریخ
- `vite.config`: رفع `manualChunks` با تابع و `VitePWA` single manifest

## [1.0.0] - ۱۴۰۵/۰۵/۱۶

### افزوده‌شده

- برنامه‌ریز روزانه‌ی فارسی با تقویم شمسی
- ردیاب عادت و ماتریس هفتگی
- داشبورد تحلیل بهره‌وری
- تایمر پومودورو، قالب‌ها، تاریخچه و خروجی JSON
- ساختار استاندارد متن‌باز شامل مجوز، راهنمای مشارکت، سیاست امنیتی، منشور رفتار و CI
- تست واحد برای منطق تاریخ شمسی و ذخیره‌سازی محلی

[1.1.0]: https://github.com/alieftekhari5040-del/planner/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/alieftekhari5040-del/planner/releases/tag/v1.0.0

## [1.1.1] - ۱۴۰۵/۰۵/۱۸

### رفع اشکال
- استانداردسازی برنامه امروز: هر ردیف 56px یک‌دست (h-14) با input تک‌خط
