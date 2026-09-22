import { IconChat, IconSpin, IconUser } from "@/components/brand/icons";
import { Reveal } from "@/components/motion/reveal";

const items = [
  {
    title: "No account needed",
    body: "Upload and preview in the browser. Nothing to sign up for.",
    icon: IconUser,
  },
  {
    title: "Live 3D preview",
    body: "Spin the shirt, place your art, and see it before you send.",
    icon: IconSpin,
  },
  {
    title: "Order on WhatsApp",
    body: "No cart. No checkout maze. Just a message with your design.",
    icon: IconChat,
  },
];

export function TrustStrip() {
  return (
    <section className="px-4 pb-6 sm:px-6 md:px-8 lg:px-10">
      <div className="page-shell grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 110}>
            <article className="flex items-start gap-4 rounded-[28px] bg-white/80 px-5 py-5 shadow-[0_10px_30px_rgba(41,38,36,0.05)] ring-1 ring-charcoal/6 backdrop-blur-sm sm:px-6 sm:py-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cream-deep text-terracotta">
                <item.icon className="size-6" />
              </span>
              <div>
                <p className="font-display font-bold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-charcoal/60">
                  {item.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
