import Link from "next/link";
import { IconChat, IconInstagram } from "@/components/brand/icons";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion/reveal";
import { SITE, getInstagramUrl, getWhatsAppNumber } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsapp = buildWhatsAppUrl(
    "Hi Jhakash Printing Gift! I have a question about a custom T-shirt.",
  );

  return (
    <footer className="mt-6 border-t border-charcoal/8 bg-white/70">
      <div className="page-shell grid gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:px-8 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-10 lg:py-16">
        <Reveal className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-charcoal/62">
            {SITE.tagline} Upload an idea, see it on a shirt, and send it to us
            on WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={90}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/40">
            Explore
          </p>
          <div className="flex flex-col gap-2.5 text-sm text-charcoal/70">
            <Link href="/customize" className="transition hover:text-charcoal">
              Customize
            </Link>
            <Link
              href="/#how-it-works"
              className="transition hover:text-charcoal"
            >
              How It Works
            </Link>
            <Link href="/gallery" className="transition hover:text-charcoal">
              Gallery
            </Link>
            <Link href="/#contact" className="transition hover:text-charcoal">
              Contact
            </Link>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-charcoal/40">
            Say hello
          </p>
          <div className="flex flex-col gap-2.5 text-sm text-charcoal/70">
            <a
              href={getInstagramUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-charcoal"
            >
              <IconInstagram className="size-4" />
              Instagram
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-charcoal"
            >
              <IconChat className="size-4" />
              WhatsApp{getWhatsAppNumber() ? "" : " chat"}
            </a>
          </div>
        </Reveal>
      </div>
      <div className="border-t border-charcoal/6 py-5 text-center text-xs text-charcoal/45">
        © {year} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
