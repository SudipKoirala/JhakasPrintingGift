import { IconChat, IconPhone } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { ContactShirt } from "@/components/home/contact-shirt";
import { Reveal } from "@/components/motion/reveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getPhoneNumber } from "@/lib/constants";

export function ContactCta() {
  const whatsapp = buildWhatsAppUrl(
    "Hi Sparktee! I have an idea for a custom T-shirt.",
  );
  const phone = getPhoneNumber();

  return (
    <section id="contact" className="scroll-mt-24 px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-24">
      <Reveal variant="scale" className="page-shell relative overflow-hidden rounded-[36px] bg-charcoal text-cream shadow-[0_24px_60px_rgba(41,38,36,0.18)]">
        <div className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-terracotta/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 size-56 rounded-full bg-mustard/15 blur-3xl" />
        <div className="relative grid items-center gap-8 p-8 sm:p-10 md:grid-cols-[1.3fr_0.9fr] md:gap-12 md:p-12 lg:p-16">
          <Reveal variant="left" delay={80}>
            <p className="mb-3 text-sm font-semibold text-mustard">
              Let’s print it
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Have an idea? Let’s print it.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-cream/68">
              Send us your design and we’ll take care of the rest — fabric,
              print, and a quick reply on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="whatsapp" size="lg">
                <a href={whatsapp} target="_blank" rel="noreferrer">
                  <IconChat className="size-5" />
                  Chat with us on WhatsApp
                </a>
              </Button>
              {phone ? (
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="bg-white text-charcoal hover:bg-cream-deep"
                >
                  <a href={`tel:+${phone}`}>
                    <IconPhone className="size-4" />
                    Call Us
                  </a>
                </Button>
              ) : null}
            </div>
          </Reveal>
          <Reveal variant="right" delay={180} className="relative mx-auto w-52 sm:w-56 md:w-64 lg:w-72">
            <div className="absolute -top-3 -right-4 rounded-2xl bg-mustard px-3 py-2 text-xs font-bold text-charcoal shadow-lg">
              We got it!
            </div>
            <div className="overflow-hidden rounded-[28px] bg-white/8 ring-1 ring-white/10">
              <ContactShirt />
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
