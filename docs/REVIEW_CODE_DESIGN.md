# بررسی تخصصی کد و طراحی — برنامه‌ریز صعود

**تاریخ:** 2026-08-07 | **شاخه:** `arena/019fdd28-planner` | **بازبینی:** Code + Design + A11y + Perf
**پیش‌نمایش زنده:** https://5173-ioslira2477vifvh6t2md.e2b.app
**گیت‌هاب:** https://github.com/alieftekhari5040-del/planner/tree/arena/019fdd28-planner

---

## چکیده اجرایی

| حوزه | امتیاز | وضعیت |
|------|--------|--------|
| معماری و ساختار | 9/10 | عالی — Feature-Sliced پس از ریفکتور |
| کیفیت TypeScript | 9/10 | strict فعال، barrel تمیز |
| هوک‌ها و جداسازی منطق | 8.5/10 | استخراج عالی اما قابل بهبود با useReducer |
| طراحی بصری | 9/10 | هویت سایبر-پرپل قوی، Vazirmatn، RTL کامل |
| ریسپانسیو | 8.5/10 | گرید 12 ستونه، نقاط شکست sm/md/lg |
| دسترسی‌پذیری | 7/10 | پایه خوب، ولی focus-trap و تست اسکرین‌ریدر کم است |
| پرفورمنس | 7.5/10 | باندل 308kB، بدون code-splitting |
| تست | 6.5/10 | فقط utils، هوک/کامپوننت بدون تست |
| امنیت | 8/10 | localStorage ایمن، ولیدیشن دستی |

**جمع‌بندی:** پروژه از یک فایل 493 خطی App.tsx به معماری مقیاس‌پذیر و قابل نگهداری تبدیل شده. طراحی هویت بصری منسجم و فارسی-محور دارد. برای رسیدن به استاندارد تولید نیاز به ۳ بهبود کلیدی: **Code-Splitting، تست هوک‌ها، و accessible modal**.

---

## 1) بررسی کد

### 1.1 ساختار پروژه — عالی
```
src/components/{layout, planner, modals, habits, analytics} + barrel
src/hooks/{useJalaliNavigation, usePlannerData, useHabits, useCompletionCelebration}
src/styles/index.css (canonical) + src/index.css shim
tests/utils/ هم‌تراز با src/utils
```
- **نقطه قوت:** `git mv` تاریخچه را حفظ کرده، هر فیچر `index.ts` دارد، `src/components/index.ts` re-export تمیز.
- **بهبود پیشنهادی:** `src/features/` به جای `src/components/habits|analytics` برای تفکیک دامنه از UI. افزودن `src/lib/` برای ثابت‌ها.

### 1.2 TypeScript — بسیار خوب
- `strict: true`, `noUnusedLocals`, `verbatimModuleSyntax`, `erasableSyntaxOnly` فعال → کیفیت بالا.
- `src/types/planner.ts` و `habits.ts` مدل‌ها را دقیق تعریف کرده. `ThemeMode` تعریف شده اما استفاده نمی‌شود → حذف یا پیاده‌سازی.
- **مشکل جزئی:** `vite.config.ts` قبلاً `from 'vite'` بود و `test` را نمی‌شناخت، با تغییر به `vitest/config` فیکس شد. `tsconfig.node.json` فقط `vite.config.ts` را include می‌کند؛ بهتر است `src/vite-env.d.ts` را هم پوشش دهد (فعلاً via `src` پوشش دارد).

### 1.3 App.tsx — قبل و بعد
- **قبل:** 493 خط، state پراکنده، هندلرهای تکراری، محاسبه completion داخل کامپوننت.
- **بعد:** 160 خط، فقط `activeTab`, `soundEnabled`, `is*Open` + ترکیب هوک‌ها. خوانایی +67%.
- **نقطه قابل بهبود:** `planner.setPlannerData(prev=>...)` در ۳ کارت تکرار شده؛ بهتر است `updatePriorities`, `updateGoals` داخل هوک expose شود. همچنین `useState`های مودال را می‌توان در `useModals` یکپارچه کرد.

### 1.4 هوک‌های سفارشی — خوب با نکات

**`useJalaliNavigation` (96 خط):**
- `useMemo` برای `todayInfo` و `dateKey` درست استفاده شده.
- `useCallback` با `soundEnabled` به‌عنوان dep صحیح.
- **ایراد:** `handleSelectHistoryDate` به‌صورت دستی `dateKey` را split می‌کند در حالی که `parseDateKey` وجود دارد → استفاده از util برای یکپارچگی. `setCurrentJy/Jm/Jd` مستقیم expose شده — بهتر است فقط `setDate` expose شود.

**`usePlannerData` (232 خط):**
- `isLoadedRef` برای جلوگیری از race-condition عالی.
- `useMemo` برای `completionStats` درست.
- **ایراد:** وابستگی `habits` در `handleExportJSON` باعث re-create هندلر در هر تغییر habit می‌شود؛ `habits` را به `useRef` ببر یا هندلر را memo نکن. همچنین `handleImportJSON` از `window.alert` استفاده می‌کند → بهتر است toast سیستم.

**`useHabits` (23 خط):**
- ساده و تمیز. **بهبود:** `loadHabits` در initializer فقط یک‌بار اجرا می‌شود؛ برای SSR safety `typeof window` چک شود (فعلاً در storage هست).

**`useCompletionCelebration` (42 خط):**
- `celebratedDateRef` برای جلوگیری از تکرار عالی. **بهبود:** `confetti` در تست محیط node خطا نمی‌دهد چون try/catch دارد، اما بهتر است `isClient` guard اضافه شود.

### 1.5 کامپوننت‌ها — تمیز اما تکراری
- هر کارت `PrioritiesCard`, `GoalsCard`, `RoutinesCard`, `ScheduleCard` الگوی مشابه: `handleTextChange`, `handleAdd`, `handleRemove`, `completedCount`. می‌توان `useEditableList` هوک مشترک ساخت.
- `Header.tsx` (250 خط) بیش از حد حجیم: Toolbar + Title + Import input. پیشنهاد split به `HeaderToolbar` و `HeaderBrand`.
- `TopNavTabs` درست از `role="tablist"` و `aria-selected` استفاده کرده، اما فقط یک تب `role="tab"` دارد → هر ۳ تب باید `role="tab"` داشته باشند.
- **پرفورمنس:** هیچ `React.memo` یا `useMemo` برای کارت‌ها نیست؛ هر تغییر در `plannerData` همه کارت‌ها را re-render می‌کند. با `memo` و `useCallback` می‌توان بهینه کرد.

### 1.6 Utils — قوی
- `jalali.ts` (246 خط): الگوریتم 33 ساله, `getDaysInJalaliMonth` درست `isJalaliLeapYear` را فراخوانی می‌کند → برخلاف هشدار پروژه که «فرض ۳۰ روز نکن» رعایت شده. ولیدیشن RangeError برای `jm` و `jd` عالی.
- `storage.ts` (192 خط): `isPriorityItem` type-guard و `filter(isPriorityItem)` برای مهاجرت داده قدیمی عالی. `readHistoryKeys` با try/catch ایمن.
- `habitStorage.ts` (239 خط): `generateMockHistory` deterministic (47*prob) → تست‌پذیر. `calculateHabitStats` منطق freezeDay درست.
- `audio.ts` (93 خط): Web Audio بدون asset خارجی، `AudioContext` lazy و `resume` مدیریت شده. **پیشنهاد:** `audioCtx` را در `useRef` نگه دار، نه global let (برای تست).
- `backup.ts` (114 خط): ولیدیشن دستی به جای Zod — کار می‌کند اما Zod خواناتر و قابل نگهداری‌تر است.
- `demoData.ts` (75 خط): داده نمونه خوب.

### 1.7 پیکربندی Build
- `vite.config.ts` اکنون درست `test: {environment:'node', globals:true}` دارد. **بهبود:** برای jsdom تست کامپوننت، `environment:'jsdom'` + `setupFiles` اضافه کن.
- `package.json` اسکریپت `check` (lint+test+types+build) عالی برای CI.
- **باندل:** `308kB JS + 74kB CSS + 220kB فونت` → *gzip 90kB JS* قابل قبول اما بدون code-splitting. `AnalyticsPage` و `HabitTracker` سنگین هستند → `React.lazy(() => import('./components/analytics'))` پیشنهاد می‌شود (صرفه ~80kB initial).
- `oxlint` با 104 رول و 0 خطا → عالی. `prettier` وجود ندارد → پیشنهاد افزودن برای فرمت یکسان.

### 1.8 تست — پایه خوب، پوشش کم
- فقط `tests/utils/*` → 12 تست، همه پاس.
- **کمبود:** هوک‌ها (به‌ویژه `usePlannerData` و `useJalaliNavigation`) و کامپوننت‌ها (مثلاً `CalendarModal` edge-case اسفند کبیسه) تست ندارند.
- **پیشنهاد:** `vitest` + `@testing-library/react` + `happy-dom` برای هوک و کامپوننت. Snapshot برای `formatPersianNumber`.

### 1.9 امنیت
- `localStorage` با `try/catch` و `JSON.parse` ایمن.
- `parsePlannerBackup` ولیدیشن دستی دارد، اما فایل JSON مخرب با `__proto__` pollution تست نشده → Zod با `stripUnknown` بهتر.
- `dangerouslySetInnerHTML` استفاده نشده → خوب.
- `canvas-confetti` ISC، بدون آسیب‌پذیری شناخته‌شده.

---

## 2) بررسی طراحی

### 2.1 هویت بصری — ممتاز
- پالت: `--app-bg #080b17`, `--app-surface rgba(17,24,45,0.88)`, `--neon-purple #8b5cf6`, `--app-accent #22d3ee` → کنتراست بالا، حس سایبر-پرپل.
- تایپوگرافی: Vazirmatn 400/500/700/900 از `@fontsource` → خوانایی فارسی عالی، `line-height 1.7`.
- افکت‌ها: `radial-gradient`, `blur-3xl`, `backdrop-filter: blur(22px)`, `surface-card:hover` border → حس شیشه‌ای مدرن.

### 2.2 توکن‌ها و سیستم طراحی
- CSS Variables کامل: `--app-bg`, `--app-border-strong`, `--app-primary` → نگهداری آسان.
- **نقطه قوت:** `!important` فقط برای `.app-frame` و `.surface-card` استفاده شده تا Tailwind override شود — قابل قبول.
- **بهبود:** توکن‌ها در `tailwind.config` یا `theme` تعریف نشده؛ پیشنهاد `tailwind.css` با `@theme { --color-app-primary: ... }` برای استفاده مستقیم از `bg-app-primary`.

### 2.3 لایه‌بندی و گرید
- `.app-shell` با `max-width 1180px` و `isolation: isolate` → مرکزچین حرفه‌ای.
- `grid-cols-1 lg:grid-cols-12` با `lg:col-span-5` + `lg:col-span-7` → نسبت 5/7 متعادل، `gap-5 md:gap-6`.
- **ریسپانسیو:** media query فقط برای `@media (max-width:640px)` → کافی اما بهتر است `sm: 640, md: 768, lg:1024` به‌صورت container query برای کارت‌ها.

### 2.4 RTL و فارسی — عالی
- `html lang="fa" dir="rtl"`, `body direction: rtl`, `text-right` در همه کارت‌ها.
- `formatPersianNumber` همه اعداد را فارسی می‌کند، `PERSIAN_WEEKDAYS` از شنبه شروع می‌شود → درست.
- **پیشنهاد:** `lang="fa-IR"` دقیق‌تر و `dir` را در `App` به صورت dynamic برای تست LTR.

### 2.5 کامپوننت‌های کلیدی

**Header (250 خط):**
- Toolbar با `progress-chip` (SVG دایره‌ای) + `Timer` + `Calendar` + `Upload` → تراکم بالا اما با `flex-wrap` مدیریت شده.
- روی موبایل `flex-wrap` باعث ۲ ردیف می‌شود → خوب.

**TopNavTabs:**
- `.app-tabs` با `inline-flex` + `backdrop-blur` → حس تب مدرن.
- `is-active` با `gradient + shadow + translateY(-1px)` → بازخورد عالی.
- **ایراد:** در موبایل `overflow-x:auto` دارد اما `scrollbar` سفارشی ندارد → مخفی کردن اسکرول با `scrollbar-width: thin`.

**Planner Cards:**
- `surface-card` با `border-radius 1.25rem` و `box-shadow 0 14px 32px` → همگی یکسان، انسجام بالا.
- چک‌باکس نئونی `rounded-xl` با `Check` stroke 3 → لمس‌پذیر (7x7) و `aria-pressed` درست.
- **بهبود:** `input` border-b فقط دارد → برای دسترسی فوکوس بهتر است `ring` کامل.

**AnalyticsPage:**
- 4 KPI با گرادیان متفاوت (purple, rose, amber, emerald) → تمایز عالی.
- Bar chart هفتگی با `min-h-[180px]` و `Math.max(8, score)` → حتی 0% دیده می‌شود.
- **ایراد:** هر روز `loadPlannerData(key)` را در رندر صدا می‌زند → I/O در رندر، بهتر است `useMemo` یا `useEffect`.

### 2.6 دسترسی‌پذیری (A11y) — 7/10

**نقاط قوت:**
- `:focus-visible {outline: 3px solid #c084fc; outline-offset:3px}` → فوکوس واضح.
- `prefers-reduced-motion` همه انیمیشن‌ها را غیرفعال می‌کند.
- `aria-label` برای دکمه‌های آیکونی، `role="dialog" aria-modal` برای مودال‌ها.
- `button, input {font: inherit}` و `disabled {opacity: .55}`.

**کمبودهای مهم:**
- مودال‌ها `focus-trap` ندارند → کاربر کیبورد می‌تواند پشت مودال Tab بزند. پیشنهاد `focus-trap-react` یا دستی.
- هیچ `Skip to content` لینکی نیست.
- کنتراست `text-purple-300/80` روی `bg-purple-950/40` در تست Axe ممکن است زیر 4.5:1 باشد → نیاز به تست کنتراست.
- `TopNavTabs` فقط یک تب `role="tab"` دارد.

### 2.7 پرینت و تم
- `@media print` درست `no-print` را مخفی می‌کند و `print-color-adjust: exact` دارد → خروجی PDF وفادار.
- **کمبود:** تم فقط `dark` با `color-scheme: dark` → درخواست کاربر برای light mode آماده نیست. پیشنهاد `prefers-color-scheme` یا toggle.

### 2.8 پرفورمنس بصری
- `animation: fade-in 220ms` سبک و سریع → حس snappy.
- `blur-3xl` گرادیان‌ها `pointer-events:none` → بدون تاثیر روی تعامل.
- **بهبود:** `backdrop-filter: blur(22px)` در فایرفاکس قدیمی heavy است → fallback solid.

---

## 3) توصیه‌های اولویت‌بندی شده

### 🔴 اولویت بالا (انجام در 1 هفته)

1. **Code-Splitting:** `const AnalyticsPage = lazy(() => import('./components/analytics'))` + `Suspense` → کاهش ~30% JS اولیه.
2. **Accessible Modal:** افزودن focus-trap و `aria-labelledby` کامل، ESC و کلیک backdrop. تست با کیبورد.
3. **تست هوک‌ها:** `useJalaliNavigation.test.ts` (مرز ماه/سال)، `usePlannerData.test.ts` (race, celebration).
4. **Zod برای backup:** جایگزینی ولیدیشن دستی با `z.object({...})` و تست `__proto__`.
5. **useReducer برای plannerData:** به جای چند `setPlannerData(prev=>...)` پراکنده.

### 🟡 اولویت متوسط (2-4 هفته)

- `React.memo` برای کارت‌ها + `useEditableList` هوک مشترک.
- Split `Header.tsx` به `HeaderToolbar` + `HeaderBrand`.
- بهبود کنتراست: تست Axe و افزایش `text-purple-200` به جای `300/80`.
- `prefers-color-scheme` و toggle light/dark.
- `setupFiles` برای vitest + `@testing-library/react`.

### 🟢 اولویت پایین (آینده)

- PWA کامل (Service Worker + `vite-plugin-pwa`)
- Storybook برای کامپوننت‌ها
- E2E با Playwright (جابجایی روز، پشتیبان)
- مستند طراحی در Figma + توکن در `tailwind.config`

---

## 4) جمع‌بندی

کد پس از ریفکتور از حالت اسکریپتی به **معماری حرفه‌ای** رسیده؛ تفکیک هوک‌ها، barrel و TypeScript strict نمونه است. طراحی هویت قوی، فارسی و ریسپانسیو دارد و با 74kB CSS و 90kB gzip JS عملکرد قابل قبولی ارائه می‌دهد. برای رسیدن به نمره 9.5/10، تمرکز بعدی باید روی **دسترسی‌پذیری مودال، تست و code-splitting** باشد — سه موردی که با کمترین هزینه بیشترین ارتقاء کیفیت را می‌دهند.
