import { useEffect, useRef, useCallback } from 'react';

export function useScrollReveal(selector = '.reveal', staggerMs = 80) {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const observe = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (observerRef.current) observerRef.current.disconnect();

    const elements = container.querySelectorAll(selector + ':not(.revealed)');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const allEls = container.querySelectorAll(selector);
            const index = Array.from(allEls).indexOf(el);
            setTimeout(() => {
              el.classList.add('revealed');
            }, index * staggerMs);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;
  }, [selector, staggerMs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observe();

    const mutation = new MutationObserver(() => {
      setTimeout(observe, 50);
    });
    mutation.observe(container, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [observe]);

  return containerRef;
}
