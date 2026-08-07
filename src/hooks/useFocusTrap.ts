import { useEffect, useRef } from 'react';

/**
 * فوکوس ترپ سبک بدون وابستگی — برای مودال‌ها
 * همگام با بقیه کد: فقط useEffect و querySelector
 */
export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    if (!container) return;

    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // فوکوس اولیه روی اولین عنصر
    const focusable = getFocusable();
    if (focusable.length > 0) {
      // تاخیر کوتاه تا مودال در DOM قرار گیرد
      setTimeout(() => focusable[0].focus(), 30);
    }

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return containerRef;
}
