"use client";

import { useRef, useCallback, type ReactNode } from "react";

export function FaqAccordion({ children }: { children: ReactNode }) {
  const openRef = useRef<HTMLDetailsElement | null>(null);

  const handleToggle = useCallback(
    (e: React.SyntheticEvent<HTMLDetailsElement>) => {
      const target = e.currentTarget;

      if (target.open) {
        // Close the previously open one
        if (openRef.current && openRef.current !== target) {
          openRef.current.open = false;
        }
        openRef.current = target;
      } else {
        if (openRef.current === target) {
          openRef.current = null;
        }
      }
    },
    [],
  );

  const items = Array.isArray(children) ? children : [children];

  return (
    <div className="flex flex-col">
      {items.map((child, i) => (
        <details
          key={i}
          className="landing-faq-item"
          onToggle={handleToggle}
        >
          {child}
        </details>
      ))}
    </div>
  );
}
