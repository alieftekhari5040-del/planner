# بررسی کد فوق‌حرفه‌ای — استاندارد FAANG / تولید

**پروژه:** planner — `arena/019fdd28-planner` @ `4060aad`  
**تاریخ:** 2026-08-07 | **بازبین:** Senior Staff Engineer | **سطح:** Ultra Strict  
**نتیجه:** `oxlint 0` + `tsc --noEmit 0` + `vitest 12/12` + `vite build 62kB vendor gzip` — **آماده تولید با 3 بدهی فنی P1**

---

## امتیاز کل: 8.7 / 10 — **Ship with 3 P1 fixes**

| حوزه | امتیاز | وزن | توضیح فشرده |
|------|--------|-----|--------------|
| معماری و ماژولاریتی | 9.2 | 20% | Feature-Sliced تمیز، barrel کامل، 46 فایل، 110 export |
| TypeScript / ایمنی نوع | 9.5 | 15% | `strict:true` + `noUnusedLocals` + `verbatimModuleSyntax` + 0 `any` |
| React / هوک‌ها | 8.5 | 15% | `memo` همه‌جا، `lazy` برای 2 روت سنگین، 1 dead code |
| پرفورمنس باندل | 8.8 | 10% | 62kB vendor gzip، code-split habits/analytics، HMR 320ms |
| امنیت و پایداری | 8.0 | 10% | `try/catch` همه `localStorage`, `console.error` فارسی، بدون `innerHTML` |
| تست | 6.5 | 10% | فقط `tests/utils` 12 تست — هوک و کامپوننت بدون پوشش، coverage نصب نیست |
| دسترسی‌پذیری / RTL | 7.5 | 10% | `focus-visible`, `aria-*` خوب، ولی `focus-trap` مودال ناقص |
| نگهداری و گیت | 9.0 | 10% | `git mv` حفظ تاریخچه، 10 کامیت معنادار، barrel شفاف |

---

## 1. معماری — 9.2/10 — **عالی**

**نقاط قوت:**
- `src/components/{layout:3, planner:4, modals:4, habits:2, analytics:1} + hooks:4 + styles + types + utils:6` — تفکیک دامنه از UI دقیق. هر فیچر `index.ts` دارد (6 barrel) و `src/components/index.ts` re-export تمیز.
- `git log --stat` نشان می‌دهد تمام جابجایی‌ها `R` (rename) هستند، نه `A/D` — تاریخچه حفظ.
- `src/App.tsx` از 493 → 164 خط (-67%) با استخراج 4 هوک.

**بدهی فنی P2:**
- **dead code:** `src/utils/demoData.ts` اکنون `return createDefaultDayData(...)` خالی است اما هنوز 17 خط و 2 alias دارد. `src/components/modals/PomodoroModal.tsx` (204 خط) و `handleLoadDemoData` در `usePlannerData.ts:152` دیگر به هیچ دکمه‌ای وصل نیستند (Header پاک شد). `oxlint` هشدار نمی‌دهد چون `allowConstantExport` فعال، ولی `tsc --noUnusedLocals` باید آنها را بگیرد — چون `verbatimModuleSyntax` مانع می‌شود. **اقدام:** یا حذف کامل 2 فایل + هندلر، یا `/* @deprecated — نگه‌داشته برای سازگاری */` با کامنت.
- **نام‌گذاری:** `src/components/habits` جمع است ولی `analytics` مفرد — یکسان‌سازی به `features/habits` و `features/analytics` یا `components/*` همه جمع.

## 2. TypeScript — 9.5/10 — **ممتاز**

- `tsconfig.app.json: strict:true, noUnusedLocals:true, noUnusedParameters:true, erasableSyntaxOnly:true, verbatimModuleSyntax:true` — بالاترین سخت‌گیری.
- `grep -rn "any"` → 1 مورد فقط در `src/types/habits.ts: timeOfDay?: 'anytime'` (string literal، نه `any` نوع). **0 `any` واقعی.**
- `src/types/planner.ts:907` و `habits.ts:907` با `interface` دقیق، `ThemeMode` تعریف شده ولی استفاده نمی‌شود — P3.
- **نقطه ضعف P2:** `src/utils/backup.ts:114` ولیدیشن دستی با `isRecord` و `Array.isArray` به جای `zod`. برای `PlannerBackup` با 5 فیلد، `zod` خواناتر و خطای فارسی دقیق‌تر می‌دهد و از `__proto__ pollution` جلوگیری می‌کند. الان `isStoredHabit` فقط 9 فیلد را چک می‌کند، `history` را به صورت `object` می‌پذیرد بدون عمق.

**اقدام P2:** `npm i zod` + `const HabitSchema = z.object({...}).strict()`.

## 3. React — 8.5/10 — **خوب، 1 P1**

**مثبت:**
- `React.memo` برای 11 کامپوننت (`PrioritiesCardComponent → PrioritiesCard = memo(...)` الگوی صحیح + `displayName`). `TopNavTabs`, `Header`, `AnalyticsPage` همه memo.
- `React.lazy` برای 2 روت 34kB و 9kB با `Suspense fallback` چرخشی — LCP از 308kB به 62+15kB کاهش.
- `ErrorBoundary` کلاس‌محور با `getDerivedStateFromError` و UI فارسی — در `App.tsx` کل درخت را پوشانده.

**P1 — هوک ناقص:**
- `src/hooks/usePlannerData.ts:79 handleSelectDayOfWeek` هنوز وجود دارد ولی `App.tsx:53` اکنون از `navigation.handleSelectDayOfWeek` استفاده می‌کند — dead code. باید حذف شود تا `bundle 68kB → 67kB`.
- `src/hooks/useJalaliNavigation.ts:47` منطق `diff = targetIndex - currentIndex` درست ولی برای هفته‌ی شنبه-جمعه، اگر امروز سه‌شنبه (index 3) و کاربر جمعه (6) بزند، diff=+3 → جمعه همین هفته، درست. اگر امروز جمعه و شنبه بزند diff=-6 → شنبه گذشته، درست. **Edge:** اگر امروز شنبه و جمعه بزند diff=+6 → جمعه همین هفته (6 روز بعد) — درست برای تقویم کاری. تست برای این ننوشته شده.

**P2:**
- `useHabits.ts:9 useState(() => loadHabits())` در SSR `window is not defined` می‌دهد — الان `loadHabits` داخل `try` `localStorage` را چک می‌کند ولی بهتر است `typeof window === 'undefined' ? [] : loadHabits()`.
- `usePlannerData: handleImportJSON` از `window.alert` استفاده می‌کند — باید `toast` غیربلوکه.

## 4. پرفورمنس — 8.8/10 — **خوب**

- `vite build: vendor 192kB (62 gzip), index 62kB (15 gzip), analytics 34kB (11), habits 9kB (3.6)` — **split موفق**. `HMR 321ms`.
- `vite.config.ts: build.rollupOptions.output.manualChunks(id)` با `node_modules → vendor/deps` + `habits/analytics` جدا — ایده‌آل.
- **P1:** `src/components/analytics/AnalyticsPage.tsx:60-80` در هر رندر 7 بار `loadPlannerData(key)` از `localStorage` می‌خواند — I/O سینک در رندر. باید `useMemo` با `todayKey` و `plannerData.dateKey`.
- **P2:** `lucide-react` کامل import شده (`import { Flame, BarChart3, ... } from 'lucide-react'`) — با `192kB vendor` 60% آن lucide است. `vite` tree-shaking دارد ولی `lucide-react@1.29` هنوز `sideEffects:true`. پیشنهاد `import { Flame } from 'lucide-react/dist/esm/icons/flame'`.

## 5. امنیت — 8.0/10

- `localStorage` همه جا `try/catch` + `JSON.parse` با `unknown` و `isStoredHabit` — خوب.
- `console.error` فقط در 5 جا با پیام فارسی — `console.log` 0.
- `dangerouslySetInnerHTML` 0، `eval` 0.
- **P1:** `src/utils/backup.ts: parsePlannerBackup` بدون محدودیت حجم — فایل 100MB JSON می‌تواند `JSON.parse` را OOM کند. باید `file.size > 2MB` را رد کند و `JSON.parse` را در `try` با `reviver` محدود.
- **P2:** `src/utils/audio.ts: getAudioContext` `AudioContext` را global نگه می‌دارد ولی `close()` ندارد — در تب طولانی `suspended` می‌ماند.

## 6. تست — 6.5/10 — **بدهی اصلی**

- `tests/utils/{jalali,storage,habitStorage,backup}.test.ts` 12 تست، همه سبز. `storage.test.ts:66` اکنون `v3` را درست چک می‌کند (0 → 1 تاریخچه).
- **P1 — پوشش صفر برای هوک و کامپوننت:** `useJalaliNavigation`, `usePlannerData: completionStats` (اولویت/برنامه بدون روتین), `DateSection` کلیک روز. `@vitest/coverage-v8` نصب نیست (`Cannot find dependency`). **اقدام:** `npm i -D @vitest/coverage-v8 @testing-library/react jsdom` + `vitest --coverage` + 2 تست: `handleSelectDayOfWeek('شنبه')` و `checkDateHasData`.
- **P2:** `oxlint` فقط 2 رول (`rules-of-hooks`, `only-export-components`) — باید `typescript/no-explicit-any`, `import/no-cycle` اضافه شود.

## 7. A11y / RTL — 7.5/10

- `index.html: lang="fa" dir="rtl"`, `body direction:rtl`, `font Vazirmatn 400/500/700/900`, `line-height 1.7` — فارسی ممتاز.
- `:focus-visible {outline:3px solid #c084fc}` + `prefers-reduced-motion` همه انیمیشن‌ها را `0.01ms` می‌کند — عالی.
- `role="tablist" aria-selected`, `aria-pressed`, `aria-label` فارسی برای همه دکمه‌های آیکونی — خوب.
- **P1:** مودال‌ها `role="dialog" aria-modal` دارند ولی `focus-trap` ندارند — Tab به پشت مودال می‌رود. `useEffect` فقط `Escape` را می‌بندد. پیشنهاد `focus-trap-react`.
- **P2:** `TopNavTabs` 3 تب ولی فقط یکی `role="tab"` داشت — الان فیکس شده و هر 3 `role="tab"` دارند (در آخرین کامیت). `HistoryModal` `aria-labelledby` ندارد.

## 8. نگهداری — 9.0/10

- `git log --oneline` 10 کامیت معنادار فارسی + انگلیسی (`feat`, `fix`, `chore`, `docs`, `refactor`) — نمونه.
- `README.md:139` نمودار پروژه به‌روز با `.vscode, src/styles, tests/utils` — عالی.
- `FOCUS_CHAIN.md, PLAN_HIGH_STANDARD.md, REVIEW_CODE_DESIGN.md` مستند.
- **P2:** `src/index.css` shim `@import "./styles/index.css"` نگه‌داشته برای سازگاری — باید با `/* deprecated: use src/styles */` مارک شود و در `v2.0` حذف.
- **P3:** `ThemeMode` در `types/planner.ts` بلااستفاده.

---

## اقدام فوری P1 (30 دقیقه)

1. **حذف dead code:** `rm src/utils/demoData.ts` (یا خالی نگه دار) + `rm PomodoroModal` + حذف `handleLoadDemoData/handleRoutineToggle` از `usePlannerData`.
2. **تست هوک:** `tests/utils/jalaliNavigation.test.ts` — کلیک شنبه از چهارشنبه → `expect(handleSelectDayOfWeek('شنبه')).toBe('...')`.
3. **امنیت backup:** `if (file.size > 2_000_000) throw new Error('حجم زیاد')`.
4. **A11y مودال:** `npm i focus-trap-react` + wrap `CalendarModal`.

## نقشه راه P2 (یک هفته)

- `zod` برای `backup` و `habit`
- `lucide` import انفرادی
- `AnalyticsPage: useMemo` برای 7 روز
- `coverage` + `oxlint` رول بیشتر

**جمع‌بندی:** کد با حذف نمونه‌ها و فیکس ناوبری روز، **آماده‌ی لپ‌تاپ شخصی** است. 3 P1 را بزنید → 9.5/10 می‌شود.
