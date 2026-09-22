import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-sm font-semibold text-terracotta",
            align === "center" && "justify-center",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.9rem] xl:text-[3.15rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-charcoal/62 lg:max-w-2xl lg:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
