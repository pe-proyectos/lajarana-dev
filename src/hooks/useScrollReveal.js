import { useEffect, useRef } from 'react';

export function useScrollReveal(selector = '.reveal', staggerMs = 80) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let observer;
    let mutation;

    function setup() {
      const elements = container.querySelectorAll(selector + ':not(.revealed)');
      if (elements.length === 0) return;

      // Mark elements for animation only after they exist
      elements.forEach(el => el.classList.add('will-animate'));

      if (observer) observer.disconnect();

      observer = new IntersectionObserver(
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
    }

    // Initial setup with small delay for React hydration
    const timer = setTimeout(setup, 100);

    // Re-observe when children change
    mutation = new MutationObserver(() => {
      setTimeout(setup, 100);
    });
    mutation.observe(container, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      if (mutation) mutation.disconnect();
      if (observer) observer.disconnect();
    };
  }, [selector, staggerMs]);

  return containerRef;
}
