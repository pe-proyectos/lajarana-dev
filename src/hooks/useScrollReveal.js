import { useEffect, useRef } from 'react';

export function useScrollReveal(selector = '.reveal', staggerMs = 80) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const index = Array.from(elements).indexOf(el);
            setTimeout(() => {
              el.classList.add('revealed');
            }, index * staggerMs);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, staggerMs]);

  return containerRef;
}
