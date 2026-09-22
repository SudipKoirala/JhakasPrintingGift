import type { ShirtColorId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type MockupView = "front" | "back" | "side";

export function TShirtMockup({
  color,
  view,
  className,
}: {
  color: ShirtColorId;
  view: MockupView;
  className?: string;
  showShadow?: boolean;
  light?: number;
}) {
  return (
    <Image
      src={`/mockups/${color}-${view}.png`}
      alt={`${color} t-shirt ${view} view`}
      width={1024}
      height={1536}
      data-shirt-face={view}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
