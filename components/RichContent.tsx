"use client";

import { useEffect, useRef } from "react";

type Props = {
  html: string;
  className?: string;
};

export default function RichContent({ html, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = html || "";

    function onClick(e: Event) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const actionEl = target.closest<HTMLElement>('[data-faq-action]');
      if (!actionEl) return;
      const action = actionEl.getAttribute('data-faq-action');
      // TS no puede garantizar que `el` siga no-nulo dentro del closure.
      // Volvemos a leer del ref y validamos.
      const container = ref.current;
      const group = actionEl.closest<HTMLElement>('[data-faq-group]') || container?.querySelector('[data-faq-group]');
      if (!group) return;
      const items = Array.from(group.querySelectorAll<HTMLDetailsElement>('details.faq-item'));
      if (action === 'open-all') {
        items.forEach((d) => (d.open = true));
      } else if (action === 'close-all') {
        items.forEach((d) => (d.open = false));
      }
    }

    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('click', onClick);
    };
  }, [html]);

  return <div ref={ref} className={className} />;
}
