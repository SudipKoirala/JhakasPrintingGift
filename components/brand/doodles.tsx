import { cn } from "@/lib/utils";

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 text-mustard", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1.4 13.6 8.2 20.6 10 13.6 11.8 12 18.6 10.4 11.8 3.4 10 10.4 8.2Z" />
    </svg>
  );
}

export function StarBurst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6 text-terracotta", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 13.2 8.8 20 10 13.2 11.2 12 18 10.8 11.2 4 10 10.8 8.8Z" />
      <circle cx="19" cy="5" r="1.2" />
      <circle cx="5" cy="6" r="0.9" />
    </svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 18"
      className={cn("h-4 w-20 text-terracotta", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 11c8-10 14 10 24 0s14 10 24 0 14 10 26 0"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CurvedArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      className={cn("h-8 w-14 text-sage", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 28c10-16 34-20 46-8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M44 12l12 8-10 8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThreadSpool({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 text-charcoal/70", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="6"
        width="16"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 11h16M8 16h16M8 21h16"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.45"
      />
      <path
        d="M16 24c6 2 10 6 10 6"
        stroke="#E87852"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Blob({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn("size-20 text-mustard/50", className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M40 6c12 0 28 10 30 24 2 14-10 30-24 34s-32-4-36-18c-4-14 6-40 30-40Z"
      />
    </svg>
  );
}

export function SmileCurve({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 20"
      className={cn("h-4 w-10 text-terracotta", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6c8 12 32 12 40 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
