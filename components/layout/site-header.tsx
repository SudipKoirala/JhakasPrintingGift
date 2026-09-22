"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconClose, IconMenu } from "@/components/brand/icons";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/customize", label: "Customize" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/customize") return pathname.startsWith("/customize");
    if (href === "/gallery") return pathname.startsWith("/gallery");
    if (href === "/#how-it-works") {
      return pathname === "/" && hash === "#how-it-works";
    }
    if (href === "/#contact") return pathname === "/" && hash === "#contact";
    return false;
  }

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <div
        className={cn(
          "page-shell flex items-center justify-between gap-3 rounded-full bg-white px-4 shadow-[0_8px_24px_rgba(41,38,36,0.08)] ring-1 ring-charcoal/6 sm:gap-5 sm:px-6 lg:px-8",
          compact ? "h-16" : "h-16 sm:h-[72px] lg:h-[76px]",
        )}
      >
        <Link href="/" className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center rounded-full bg-cream-deep p-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-[13px] font-semibold transition-colors lg:px-4 lg:text-sm",
                isActive(link.href)
                  ? "bg-charcoal text-white"
                  : "text-charcoal/70 hover:bg-white hover:text-charcoal",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/customize">
              <span className="lg:hidden">Customize</span>
              <span className="hidden lg:inline">Customize Your T-Shirt</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm">
            <Link href="/customize">Customize</Link>
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full bg-charcoal text-white"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="page-shell mt-2 rounded-[28px] bg-white p-4 shadow-[0_8px_24px_rgba(41,38,36,0.08)] ring-1 ring-charcoal/6 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-full px-4 py-3 text-base font-semibold",
                  isActive(link.href)
                    ? "bg-charcoal text-white"
                    : "bg-cream-deep text-charcoal",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
