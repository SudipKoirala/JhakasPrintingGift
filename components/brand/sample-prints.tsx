import { cn } from "@/lib/utils";

const prints = {
  sun: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <circle cx="60" cy="60" r="28" fill="#F4C95D" />
      <circle cx="50" cy="54" r="4" fill="#292624" />
      <circle cx="70" cy="54" r="4" fill="#292624" />
      <path
        d="M48 70c8 10 16 10 24 0"
        stroke="#292624"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 60 + Math.cos(angle) * 36;
        const y1 = 60 + Math.sin(angle) * 36;
        const x2 = 60 + Math.cos(angle) * 48;
        const y2 = 60 + Math.sin(angle) * 48;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#E87852"
            strokeWidth="5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" rx="16" fill="#9BB89C" />
      <path d="M8 92 46 40 68 68 86 52 112 92Z" fill="#FFF9F2" />
      <path d="M46 40 56 52 40 52Z" fill="#F4C95D" />
      <circle cx="92" cy="28" r="10" fill="#F4C95D" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" rx="16" fill="#E87852" />
      <path
        d="M64 16 44 58h22L50 104l40-52H68L80 16Z"
        fill="#F4C95D"
      />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" rx="16" fill="#292624" />
      <path
        d="M10 70c16-22 28 22 50 0s28 22 50 0"
        stroke="#9BB89C"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 88c16-22 28 22 50 0s28 22 50 0"
        stroke="#E87852"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" rx="16" fill="#FFF9F2" />
      <path
        d="M60 96C28 74 18 54 32 40c10-10 22-6 28 4 6-10 18-14 28-4 14 14 4 34-28 56Z"
        fill="#E87852"
      />
      <path d="M78 28 82 40 94 44 82 48 78 60 74 48 62 44 74 40Z" fill="#F4C95D" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="120" rx="16" fill="#F4C95D" />
      <path
        d="M38 44h40v28c0 12-10 22-20 22s-20-10-20-22V44Z"
        fill="#FFF9F2"
      />
      <path
        d="M78 52h10c8 0 12 8 8 14s-12 8-16 6"
        stroke="#292624"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 28c2 6 0 10 0 14M62 26c2 6 0 10 0 16"
        stroke="#E87852"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export type SamplePrintName = keyof typeof prints;

export function SamplePrint({
  name,
  className,
}: {
  name: SamplePrintName;
  className?: string;
}) {
  return <div className={cn("overflow-hidden", className)}>{prints[name]}</div>;
}
