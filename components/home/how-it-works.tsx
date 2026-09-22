import { IconChat, IconShirt, IconUpload } from "@/components/brand/icons";
import { SectionHeading } from "@/components/brand/section-heading";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    n: "01",
    title: "Upload Your Design",
    description: "Drop in a photo, logo, or doodle from your phone or computer.",
    icon: IconUpload,
    tint: "bg-mustard/35 text-charcoal",
  },
  {
    n: "02",
    title: "Make It Yours",
    description:
      "Pick a shirt, place the print anywhere, and spin the 3D preview.",
    icon: IconShirt,
    tint: "bg-terracotta/15 text-terracotta",
  },
  {
    n: "03",
    title: "Send Your Order",
    description:
      "Preview it, then send the design straight to us on WhatsApp.",
    icon: IconChat,
    tint: "bg-sage/35 text-charcoal",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-24">
      <Reveal variant="scale" className="page-shell rounded-[36px] bg-white/55 px-5 py-12 shadow-[0_16px_50px_rgba(41,38,36,0.05)] ring-1 ring-charcoal/6 sm:px-10 md:px-12 lg:px-16 lg:py-16">
        <SectionHeading
          align="center"
          eyebrow="Three easy steps"
          title="How it works"
          description="From a file on your phone to a T-shirt in a few taps."
        />
        <div className="relative mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:mt-16 lg:gap-8">
          <div className="reveal-line pointer-events-none absolute top-10 right-16 left-16 hidden h-px bg-gradient-to-r from-transparent via-charcoal/12 to-transparent md:block" />
          {steps.map((step, index) => (
            <Reveal key={step.n} delay={120 + index * 140}>
              <article className="group relative overflow-hidden rounded-[28px] bg-cream p-6 ring-1 ring-charcoal/6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(41,38,36,0.08)] lg:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`grid size-14 place-items-center rounded-2xl ${step.tint}`}
                  >
                    <step.icon className="size-7" />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-charcoal/12 transition group-hover:text-terracotta/30">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
