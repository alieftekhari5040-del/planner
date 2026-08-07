# برنامه‌ی اجرای استاندارد بالا — Planner Refactor

> تاریخ: 2026-08-07 (Asia/Tehran) — شاخه: `arena/019fdd28-planner`
> هدف: اجرای مرحله‌ای با استاندارد تولید، بدون نیاز به ترمینال دستی برای کاربر نهایی، و اطمینان از ذخیره‌سازی روی GitHub

---

## فاز 0 — تایید ماندگاری (Persistence Verification)
**هدف:** اطمینان از اینکه تغییرات فقط در سندباکس نمانده و روی GitHub ذخیره شده.

- [x] بررسی `git remote -v` → `origin https://github.com/alieftekhari5040-del/planner.git`
- [x] بررسی `git branch -a` و `gh api repos/.../branches/arena/019fdd28-planner` → کامیت `caf6558` روی origin
- [x] مقایسه `origin/main (82ce404)` vs `HEAD (caf6558)` → 78 فایل، 7834+ خط تفاوت، پوش موفق
- [x] لینک مستقیم:
  - درخت شاخه: https://github.com/alieftekhari5040-del/planner/tree/arena/019fdd28-planner
  - مقایسه با main: https://github.com/alieftekhari5040-del/planner/compare/main...arena/019fdd28-planner
  - PR پیشنهادی: `gh pr create --head arena/019fdd28-planner --base main --title "refactor: بهبود ساختار"`

**نتیجه:** تغییرات روی origin ذخیره شده، نه فقط سندباکس. سندباکس موقتی است اما push دائمی است.

---

## فاز 1 — برنامه‌ریزی (Planning)
**اصول:** Feature-Sliced، Barrel Exports، Separation of Concerns، تست‌پذیری، دسترسی‌پذیری

1.  **کشف:** `ls -R src`, `package.json`, `vite.config.ts`, `tsconfig.*`, `src/App.tsx` (493 خط)
2.  **تحلیل:** وابستگی‌ها (React 19, Vite 8, Tailwind 4), عدم وجود `vite-env.d.ts`, نبود `.vscode`, تست‌های flat
3.  **طراحی:** ساختار هدف:
    ```
    src/components/{layout,planner,modals,habits,analytics}/ + barrel
    src/hooks/{useJalaliNavigation,usePlannerData,useHabits,useCompletionCelebration}
    src/styles/index.css (canonical)
    tests/utils/ (هم‌تراز با src/utils)
    .vscode/, src/vite-env.d.ts, vite test config
    ```
4.  **خروجی برنامه:** این فایل `docs/PLAN_HIGH_STANDARD.md` + چک‌لیست Focus Chain

---

## فاز 2 — اجرا (Implementation) — انجام‌شده با استاندارد بالا
### 2.1 ساختار پوشه
- `mkdir -p src/components/{layout,planner,modals,habits,analytics} src/hooks src/styles tests/utils .vscode`

### 2.2 جابجایی با حفظ تاریخچه (`git mv`)
- layout: Header, Footer, TopNavTabs
- planner: DateSection, PrioritiesCard, GoalsCard, RoutinesCard, ScheduleCard, LessonsCard
- modals: CalendarModal, PomodoroModal, TemplatesModal, HistoryModal
- habits: HabitTrackerPage, HabitWeeklyMatrix (از HabitTracker)
- analytics: AnalyticsPage (از Analytics)
- styles: `src/index.css` → `src/styles/index.css` + shim برای سازگاری
- tests: `tests/*.test.ts` → `tests/utils/*.test.ts`

### 2.3 Barrel Exports
- هر فیچر `index.ts` + `src/components/index.ts`, `src/types/index.ts`, `src/utils/index.ts`, `src/hooks/index.ts`

### 2.4 به‌روزرسانی Imports
- اصلاح عمق: `../utils` → `../../utils` برای فایل‌های جابجا شده (11 فایل)
- `App.tsx` به importهای barrel مهاجرت کرد (کاهش وابستگی مستقیم)

### 2.5 استخراج هوک‌ها
- `useJalaliNavigation` (190 خط منطق تاریخ)
- `useHabits` (load/save)
- `useCompletionCelebration` (confetti یک‌بار در هر روز)
- `usePlannerData` (232 خط: load/save, completionStats, تمام handlers)
- `App.tsx` از 493 → 160 خط (−67%)

### 2.6 استایل و پیکربندی
- `main.tsx` → `import './styles/index.css'`
- `src/vite-env.d.ts`
- `vite.config.ts` → `from 'vitest/config'` + `test:{globals, environment:'node', include}`
- `.vscode/extensions.json` + `settings.json`
- `README.md` نمودار جدید

---

## فاز 3 — دیباگ و تست (Debug & Test) — حلقه‌ی کیفیت
**استاندارد:** هر تغییر باید `npm run check` را پاس کند

- [x] `npm run lint` (oxlint) → 0 warning/error روی 45 فایل
- [x] `npm test` (vitest) → 4 فایل، 12 تست پاس
- [x] `npm run test:types` (tsc -p tsconfig.tests.json) → پاس
- [x] `npm run build` (tsc -b + vite) → 1819 ماژول، 308kB JS، 74kB CSS
- [x] اصلاح خطای `TS6133` (حذف `loadHabits` استفاده‌نشده) و `TS2769` (تغییر import به `vitest/config`)
- [x] بررسی دستی imports: `grep -rn "from.*utils|types"` بدون مسیر شکسته
- [x] تست پیش‌نمایش: `npm run dev -- --host 0.0.0.0 --port 5173` → Preview فعال

**معیارهای تکمیلی:**
- `strict: true`, `noUnusedLocals: true`, `verbatimModuleSyntax`
- پوشش تست فعلی فقط utils — پیشنهاد فاز آینده: تست هوک‌ها و کامپوننت‌ها با `@testing-library/react`

---

## فاز 4 — تحویل بدون ترمینال (Delivery)
**هدف:** کاربر بدون زدن دستور ترمینال بتواند مستقیم وارد شود

- [x] سرور پیش‌نمایش دائمی با `start_process`:
  - Local: `http://localhost:5173/`
  - Network: `http://169.254.0.21:5173/`
  - **Preview URL (کلیک مستقیم):** https://5173-ioslira2477vifvh6t2md.e2b.app
- [x] لینک GitHub (بدون ترمینال):
  - کد روی شاخه: https://github.com/alieftekhari5040-del/planner/tree/arena/019fdd28-planner
  - مقایسه: https://github.com/alieftekhari5040-del/planner/compare/main...arena/019fdd28-planner
- [x] دستور پیشنهادی PR (اختیاری):
  ```bash
  gh pr create --head arena/019fdd28-planner --base main --title "refactor: بهبود ساختار پروژه" --body "ساختار feature-based + هوک‌ها + barrel + تست"
  ```
- [x] فایل `.github/workflows/ci.yml` محلی ساخته شد (به دلیل محدودیت token پوش نشد — برای فعال‌سازی، فایل را از طریق وب‌GitHub دستی کامیت کن)

---

## فاز 5 — نگهداری و نقشه‌ی راه
- تست‌های هوک و کامپوننت تعاملی
- تنظیمات تم روشن/تیره
- PWA کامل‌تر
- همگام‌سازی اختیاری رمزنگاری‌شده

---

## چک‌لیست نهایی استاندارد
- [x] تاریخچه git حفظ شد (`git mv`)
- [x] هیچ import شکسته‌ای نیست
- [x] `npm run check` سبز است
- [x] پیش‌نمایش بدون ترمینال فعال است
- [x] تغییرات روی origin ذخیره شده (نه فقط سندباکس)
- [x] مستندات به‌روز (README, PLAN, FOCUS_CHAIN)
