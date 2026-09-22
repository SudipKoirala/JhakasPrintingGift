import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.16em] text-terracotta">
        404
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
        That page wandered off.
      </h1>
      <p className="mt-3 text-charcoal/65">
        Let’s get you back to designing a T-shirt.
      </p>
      <Button asChild className="mt-8">
        <Link href="/customize">Customize Your T-Shirt</Link>
      </Button>
    </main>
  );
}
