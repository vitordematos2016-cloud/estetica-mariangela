import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-cream-light/60 px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-brown">
      {children}
    </span>
  );
}
