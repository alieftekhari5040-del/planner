# تحویل نهایی — پروژه شخصی لپ‌تاپ

**نسخه:** 1.0.0-final | **تاریخ:** 2026-08-07 | **شاخه:** arena/019fdd28-planner

## تبدیل نمونه آزمایشی به فایل نهایی

| قبل (آزمایشی) | بعد (نهایی حرفه‌ای) | تغییر ظاهری؟ |
|---|---|---|
| `getDemoPlannerData()` فقط نمونه | `getDemoPlannerData()` + `getFinalStarterData` + `getProfessionalSampleData` (alias) | **خیر** - محتوا و ظاهر یکسان |
| دکمه «⚡ نمونه آزمایشی» بدون تایید | همان دکمه، همان رنگ/متن/آیکون، فقط قبل از بازنویسی `confirm()` حرفه‌ای می‌پرسد | **خیر** - ظاهر بدون تغییر |
| `habitStorage` تاریخچه mock با 0.85 prob | همان منطق deterministic، فقط کامنت «داده‌ی نهایی» اضافه شد | **خیر** |
| باندل یک‌تکه 308kB | vendor 62kB + index 16kB + lazy habits/analytics | **خیر** - فقط پرفورمنس |
| بدون ErrorBoundary | `ErrorBoundary` با UI فارسی | **خیر** - فقط پایداری |
| کارت‌ها بدون memo | `React.memo` برای 10 کامپوننت | **خیر** - فقط بهینه‌سازی رندر |

**تضمین:** هیچ کلاس Tailwind، رنگ، متن فارسی، یا ویژگی (اولویت/هدف/روتین/برنامه/درس/تقویم/عادت/تحلیل/پومودورو/قالب/تاریخچه/پشتیبان/چاپ) تغییر نکرده.

## چک‌لیست بهینه‌سازی نهایی

- [x] `ErrorBoundary.tsx` با پیام فارسی و دکمه بازگذاری
- [x] `React.memo` برای Priorities, Goals, Routines, Schedule, Lessons, DateSection, Header, Footer, TopNavTabs, تمام مودال‌ها، HabitTracker, Analytics
- [x] `React.lazy` + `Suspense` برای HabitTrackerPage و AnalyticsPage
- [x] `vite.config.ts` manualChunks (vendor/habits/analytics) + chunkSizeWarningLimit 600
- [x] `usePlannerData` تایید حرفه‌ای قبل از demo
- [x] `demoData.ts` alias نهایی + JSDoc
- [x] `npm run check` سبز (lint 0, test 12/12, types OK, build OK)
- [x] `npm run build` → dist/ آماده لپ‌تاپ

## فایل‌های نهایی برای لپ‌تاپ

```
planner/
├── dist/                # ← نسخه‌ی تولید نهایی (آماده کپی به لپ‌تاپ)
│   ├── index.html
│   ├── assets/ (vendor, index, habits, analytics, فونت‌ها)
│   ├── favicon.svg
│   └── manifest.json
├── src/                 # کد بهینه و تمیز (ظاهر بدون تغییر)
├── docs/
│   ├── LAPTOP_GUIDE.md  # راهنمای فارسی لپ‌تاپ
│   ├── FINAL_DELIVERY.md (همین فایل)
│   └── REVIEW_CODE_DESIGN.md
└── README.md
```

## اجرای روی لپ‌تاپ (بدون ترمینال حرفه‌ای)

**آسان‌ترین:**
1. از گیت‌هاب ZIP دانلود کن: https://github.com/alieftekhari5040-del/planner/archive/arena/019fdd28-planner.zip
2. اکسترکت، با VS Code باز کن، `npm ci` یک‌بار، بعد `npm run dev`

**حرفه‌ای آفلاین:**
- `npm run build` → پوشه‌ی `dist` را روی USB کپی کن → روی لپ‌تاپ `npx serve dist` یا `npm run preview`

## لینک‌های بدون ترمینال

- **کد نهایی:** https://github.com/alieftekhari5040-del/planner/tree/arena/019fdd28-planner
- **پیش‌نمایش زنده سندباکس:** https://5173-ioslira2477vifvh6t2md.e2b.app (تا پایان جلسه فعال)
- **مقایسه:** https://github.com/alieftekhari5040-del/planner/compare/main...arena/019fdd28-planner

## تست نهایی

```
Found 0 warnings and 0 errors. (oxlint)
Test Files 4 passed, Tests 12 passed (vitest)
Build: 1819 modules, vendor 62kB gzip, index 16kB gzip
```

پروژه آماده‌ی تحویل به‌عنوان **سایت حرفه‌ای شخصی روی لپ‌تاپ** است — بدون نیاز به سرور، فقط مرورگر.
