import React, { useEffect, useRef, useCallback } from 'react';

const INTERACTIVE_SELECTORS = 'a, button, input, textarea, select, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"]), label, .sidebar-nav-item, .card, .btn, .btn-icon';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Apply position via RAF for maximum smoothness
  const applyPosition = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
    }
  }, []);

  const setHovered = useCallback((hovered: boolean) => {
    if (isHoveredRef.current === hovered) return;
    isHoveredRef.current = hovered;
    if (cursorRef.current) {
      cursorRef.current.classList.toggle('cursor--hovered', hovered);
    }
  }, []);

  const attachListeners = useCallback((root: Document | Element = document) => {
    const elements = root.querySelectorAll(INTERACTIVE_SELECTORS);
    elements.forEach(el => {
      if ((el as HTMLElement).dataset.cursorBound) return;
      (el as HTMLElement).dataset.cursorBound = '1';
      el.addEventListener('mouseenter', () => setHovered(true));
      el.addEventListener('mouseleave', () => setHovered(false));
    });
  }, [setHovered]);

  useEffect(() => {
    // Hide native cursor
    document.documentElement.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(applyPosition);

      // Show cursor on first move
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Initial attach
    attachListeners();

    // MutationObserver for dynamically added elements (route changes, modals, etc.)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            attachListeners(node as Element);
            // Also check the node itself
            const el = node as HTMLElement;
            if (el.matches && el.matches(INTERACTIVE_SELECTORS) && !el.dataset.cursorBound) {
              el.dataset.cursorBound = '1';
              el.addEventListener('mouseenter', () => setHovered(true));
              el.addEventListener('mouseleave', () => setHovered(false));
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyPosition, attachListeners]);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
    />
  );
};
