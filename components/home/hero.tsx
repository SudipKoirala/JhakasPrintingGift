import Link from "next/link";
import { Squiggle } from "@/components/brand/doodles";
import { Button } from "@/components/ui/button";
import { HeroShirt } from "@/components/home/hero-shirt";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="page-shell relative grid items-center gap-10 px-4 py-12 sm:px-6 md:gap-12 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24 xl:gap-20 xl:py-28">
        <div className="relative max-w-xl lg:max-w-none">
          <Reveal>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-medium text-charcoal/70 shadow-[0_8px_20px_rgba(41,38,36,0.06)] ring-1 ring-charcoal/8">
              Custom tees, made from your idea
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-5xl font-extrabold leading-[0.92] text-charcoal sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.4rem]">
              Put Your
              <span className="mt-1 block">
                Design On It.
                <Squiggle className="mt-2 w-40 text-terracotta sm:w-48" />
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/68 sm:text-lg lg:max-w-lg">
              Upload any image, see it on a real 3D T-shirt, then send the order
              on WhatsApp. No account. No checkout maze.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/customize">Start Designing</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/gallery">See inspiration</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["No login", "PNG · JPG · WEBP", "Front & back print"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-charcoal/60 ring-1 ring-charcoal/8"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={140} className="relative mx-auto w-full max-w-lg md:max-w-xl lg:max-w-none">
          <HeroShirt />
        </Reveal>
      </div>
    </section>
  );
}
