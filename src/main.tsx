import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'

// PWA: ثبت سرویس‌ورکر برای نصب روی دسکتاپ و کار آفلاین (لپ‌تاپ)
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      immediate: true,
      onRegisteredSW(_url: string, r: ServiceWorkerRegistration | undefined) {
        // برای آپدیت خودکار هر ساعت چک کن (مثل اپ واقعی)
        if (r) {
          setInterval(() => r.update(), 60 * 60 * 1000)
        }
      },
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
