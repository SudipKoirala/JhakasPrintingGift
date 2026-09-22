import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

function Icon({
  className,
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconShirt({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M8.2 5.2 4.4 7.4l1.7 3.6 2.2-1.2v8.4c0 .9.7 1.5 1.6 1.5h4.4c.9 0 1.5-.6 1.5-1.5V9.8l2.2 1.2 1.7-3.6-3.8-2.2c-.3-1.6-1.9-2.7-3.6-2.7h-.7c-1.7 0-3.3 1.1-3.6 2.7Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 4.8c.2-.7.9-1.1 1.8-1.1s1.6.4 1.8 1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconImage({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect
        x="3.4"
        y="4.6"
        width="17.2"
        height="14.8"
        rx="4"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.6" cy="9.2" r="1.5" fill="currentColor" />
      <path
        d="M4.8 16.2 9 12.4l3.2 2.6 3.1-3.8 4 4.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconUpload({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M6.2 16.6c-2 0-3.4-1.6-3.4-3.4 0-1.5 1-2.8 2.4-3.3.2-2.6 2.3-4.6 5-4.6 2 0 3.7 1 4.6 2.5.4-.2.9-.3 1.4-.3 1.8 0 3.2 1.4 3.2 3.2 0 .3 0 .6-.1.8 1.4.4 2.4 1.7 2.4 3.2 0 1.9-1.5 3.4-3.4 3.4H6.2Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.2V9.6M9.6 11.4 12 8.8l2.4 2.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconChat({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M5.2 16.8c-1.2-1.2-1.8-2.7-1.8-4.4C3.4 8 7.2 4.6 12 4.6s8.6 3.4 8.6 7.8-3.8 7.8-8.6 7.8c-.9 0-1.8-.1-2.6-.4L5 20.2l.2-3.4Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 11.6h.2M12 11.6h.2M15.6 11.6h.2"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconUser({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle
        cx="12"
        cy="8.2"
        r="3.2"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5.2 19.2c.6-3.2 3.2-5 6.8-5s6.2 1.8 6.8 5"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 8c.3.5 1.5.6 2.8 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconSpin({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M7.2 8.2 4.8 6.4 6.2 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 6.8c1.4-2 3.8-3.2 6.6-3.2 4.6 0 8.2 3.4 8.4 7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.8 15.8 19.2 17.6 17.8 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8 17.2c-1.4 2-3.8 3.2-6.6 3.2-4.6 0-8.2-3.4-8.4-7.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.4 10.2h5.2l-1.1 6.2H10.5L9.4 10.2Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconEraser({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M13.6 4.8 19 10.2c.7.7.7 1.8 0 2.5l-6.4 6.4c-.7.7-1.8.7-2.5 0L4.7 13.7c-.7-.7-.7-1.8 0-2.5l6.4-6.4c.7-.7 1.8-.7 2.5 0Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 10.4 13.6 15.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4.4 19.6h8.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconHand({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M9.2 11.2V6.6c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v4.2M12 10.4V5.8c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v5.2M14.8 10.8V7.2c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4v7.2c0 3-2.2 5.2-5.2 5.2h-.6c-2.2 0-3.8-1-4.8-2.6L5.4 13c-.4-.6-.2-1.4.4-1.8.6-.4 1.4-.2 1.8.4l1.6 2.4"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconPhone({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect
        x="7"
        y="2.8"
        width="10"
        height="18.4"
        rx="3.2"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10.4 5.2h3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.8" r="1" fill="currentColor" />
    </Icon>
  );
}

export function IconQuestion({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle
        cx="12"
        cy="12"
        r="8.2"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9.6 9.4c.3-1.5 1.5-2.4 3-2.4 1.6 0 2.8.9 2.8 2.4 0 1.6-1.4 2.1-2.2 2.6-.6.4-.8 1-.8 1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12.2" cy="16.6" r="1" fill="currentColor" />
    </Icon>
  );
}

export function IconLock({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect
        x="5.2"
        y="10.4"
        width="13.6"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.2 10.4V8.2c0-2.2 1.6-4 3.8-4s3.8 1.8 3.8 4v2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.2" r="1.2" fill="currentColor" />
    </Icon>
  );
}

export function IconUnlock({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect
        x="5.2"
        y="10.4"
        width="13.6"
        height="10"
        rx="3"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.2 10.4V8c0-2.2 1.6-4 3.8-4 1.6 0 3 .9 3.6 2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.2" r="1.2" fill="currentColor" />
    </Icon>
  );
}

export function IconReset({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M6.2 8.6C7.6 6 9.8 4.6 12.6 4.6c4.2 0 7.4 3.4 7.4 7.4s-3.2 7.4-7.4 7.4c-3 0-5.6-1.8-6.8-4.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4.4 5.2 6.4 9.2 10.2 7.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconExpand({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M9.2 4.8H5.4v3.8M14.8 4.8h3.8v3.8M5.4 15.4v3.8h3.8M18.6 15.4v3.8h-3.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconClose({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M7 7 17 17M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconChevronLeft({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M14.6 5.6 8.2 12l6.4 6.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconChevronRight({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M9.4 5.6 15.8 12l-6.4 6.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconMenu({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M5 7.2h14M5 12h11.2M5 16.8h13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function IconInstagram({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect
        x="3.6"
        y="3.6"
        width="16.8"
        height="16.8"
        rx="5.4"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="3.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="16.8" cy="7.2" r="1.15" fill="currentColor" />
    </Icon>
  );
}

export function IconCover({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect
        x="4"
        y="5.2"
        width="16"
        height="13.6"
        rx="3.4"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 8.2 12.8 10.4 15.2 10.8 13.4 12.4 13.8 14.8 12 13.6 10.2 14.8 10.6 12.4 8.8 10.8 11.2 10.4Z"
        fill="currentColor"
      />
    </Icon>
  );
}
