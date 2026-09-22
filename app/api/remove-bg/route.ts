import { NextResponse } from "next/server";
import { MAX_IMAGE_BYTES } from "@/lib/constants";
import {
  hasCloudBackgroundRemoval,
  removeBackgroundOnServer,
} from "@/lib/remove-bg-server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!hasCloudBackgroundRemoval()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const form = await request.formData();
  const image = form.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const buffer = await removeBackgroundOnServer(image);
    if (!buffer) {
      return NextResponse.json({ error: "failed" }, { status: 502 });
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "too_large") {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
