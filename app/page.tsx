import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { HowItWorks } from "@/components/home/how-it-works";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { ContactCta } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <GalleryPreview />
      <ContactCta />
    </main>
  );
}
