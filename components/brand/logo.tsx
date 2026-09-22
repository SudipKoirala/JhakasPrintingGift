import { cn } from "@/lib/utils";

export function Logo({
  className,
  wordmark = true,
}: {
  className?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid size-10 place-items-center rounded-2xl bg-terracotta text-white">
        <svg
          viewBox="0 0 32 32"
          className="size-6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10.2 9.2 7 11.2 8.6 15.2 11.2 13.8v8.6c0 .8.6 1.4 1.4 1.4h6.8c.8 0 1.4-.6 1.4-1.4v-8.6L23.4 15.2 25 11.2l-3.2-2c-.4-2-2.4-3.4-4.6-3.4h-2.4c-2.2 0-4.2 1.4-4.6 3.4Z"
            fill="currentColor"
          />
          <path
            d="M14.4 8.4c0-.8.8-1.2 1.6-1.2s1.6.4 1.6 1.2"
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {wordmark ? (
        <span className="font-display text-xl font-extrabold tracking-tight">
          Sparktee
        </span>
      ) : null}
    </span>
  );
}
