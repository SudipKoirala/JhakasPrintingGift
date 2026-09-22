"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { cn, compressDataUrl, dataUrlToBlob, fileToDataUrl } from "@/lib/utils";
import { removeImageBackground } from "@/lib/remove-background";
import {
  loadAdminShirts,
  saveAdminShirts,
  type ShirtPrint,
  type ShirtProduct,
} from "@/lib/shirts";
import { extractShirtPrint } from "@/lib/extract-print";
import { FilePickButton } from "@/components/ui/file-pick-button";
import type { InspirationItem } from "@/lib/catalog";
import {
  inspirationCover,
  inspirationPhotos,
  loadLocalInspiration,
  MAX_INSPIRATION_PHOTOS,
  saveLocalInspiration,
} from "@/lib/inspiration";
import { IconCover, IconImage } from "@/components/brand/icons";
import { ShirtStage } from "@/components/tshirt/ShirtStage";
import { StageMoveBar } from "@/components/tshirt/StageMoveBar";
import { DEFAULT_DESIGN, type MoveTarget } from "@/types/tshirt";

const TShirtCanvas = dynamic(
  () =>
    import("@/components/tshirt/TShirtCanvas").then((mod) => mod.TShirtCanvas),
  { ssr: false },
);

type Tab = "shirts" | "inspiration";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [catalog, setCatalog] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("shirts");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/admin/session");
      const json = (await response.json()) as {
        configured?: boolean;
        ok?: boolean;
        catalog?: boolean;
      };
      setConfigured(Boolean(json.configured));
      setAuthed(Boolean(json.ok));
      setCatalog(Boolean(json.catalog));
      setChecking(false);
    })();
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoginError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setLoginError("That password didn’t match.");
      return;
    }
    setAuthed(true);
    setPassword("");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  }

  if (checking) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center text-charcoal/60">
        Checking admin access…
      </main>
    );
  }

  if (!configured) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <Logo />
        <h1 className="mt-6 font-display text-3xl font-extrabold">Admin is locked</h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
          Visitors cannot add T-shirts or gallery photos. Set{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">ADMIN_PASSWORD</code>{" "}
          in your environment, then come back to{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">/admin</code>.
        </p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <Logo />
        <h1 className="mt-6 font-display text-3xl font-extrabold">Admin</h1>
        <p className="mt-2 text-sm text-charcoal/65">
          Only you can add T-shirt colors and inspiration photos.
        </p>
        <form onSubmit={(event) => void login(event)} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-full bg-white px-4 ring-1 ring-charcoal/10 outline-none focus:ring-terracotta/50"
              autoComplete="current-password"
            />
          </label>
          {loginError ? (
            <p className="text-sm text-terracotta">{loginError}</p>
          ) : null}
          <Button type="submit" className="w-full">
            Open studio
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 py-10 sm:px-6 md:px-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Logo />
          <h1 className="mt-4 font-display text-3xl font-extrabold">Studio</h1>
          <p className="mt-2 max-w-xl text-sm text-charcoal/65">
            Upload a photo of a printed T-shirt — we place the artwork on the
            3D model. Color can wait. Also add gallery looks with photos and a
            description.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/customize">Open customizer</Link>
          </Button>
          <Button variant="outline" onClick={() => void logout()}>
            Log out
          </Button>
        </div>
      </div>

      {!catalog ? (
        <p className="mb-6 rounded-[24px] bg-mustard/30 px-4 py-3 text-sm text-charcoal/75">
          No Blob token yet — saves stay on this browser only. Add{" "}
          <code className="text-xs">BLOB_READ_WRITE_TOKEN</code> so every visitor
          sees your shirts and inspiration photos.
        </p>
      ) : null}

      <div className="mb-8 inline-flex rounded-full bg-white p-1 ring-1 ring-charcoal/8">
        {(
          [
            ["shirts", "T-shirts"],
            ["inspiration", "Inspiration"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold",
              tab === id ? "bg-terracotta text-white" : "text-charcoal/60",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "shirts" ? (
        <ShirtAdmin catalog={catalog} />
      ) : (
        <InspirationAdmin catalog={catalog} />
      )}
    </main>
  );
}

async function uploadDataUrl(dataUrl: string, filename: string) {
  const compact = dataUrl.startsWith("data:")
    ? await compressDataUrl(dataUrl)
    : dataUrl;
  try {
    const form = new FormData();
    form.append("file", dataUrlToBlob(compact), filename);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    if (response.ok) {
      const json = (await response.json()) as { url?: string };
      if (json.url) return json.url;
    }
  } catch {
    // Keep a compressed local copy when Blob is not set up.
  }
  return compact;
}

async function persistShirts(items: ShirtProduct[], useCatalog: boolean) {
  saveAdminShirts(items);
  if (!useCatalog) return;
  const response = await fetch("/api/catalog/shirts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) {
    throw new Error("catalog");
  }
}

async function persistInspiration(items: InspirationItem[], useCatalog: boolean) {
  saveLocalInspiration(items);
  if (!useCatalog) return;
  const response = await fetch("/api/catalog/inspiration", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error("catalog");
}

function ShirtAdmin({ catalog }: { catalog: boolean }) {
  const [shirts, setShirts] = useState<ShirtProduct[]>([]);
  const [name, setName] = useState("");
  const [frontPrint, setFrontPrint] = useState<ShirtPrint | null>(null);
  const [backPrint, setBackPrint] = useState<ShirtPrint | null>(null);
  const [hex, setHex] = useState("#FFFFFF");
  const [side, setSide] = useState<"front" | "back">("front");
  const [moveTarget, setMoveTarget] = useState<MoveTarget>("image");
  const [locked, setLocked] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/catalog/shirts");
      const json = (await response.json()) as { items?: ShirtProduct[] };
      setShirts(json.items?.length ? json.items : loadAdminShirts());
    })();
  }, []);

  const activePrint = side === "back" ? backPrint : frontPrint;
  const previewDesign = useMemo(
    () =>
      activePrint
        ? {
            ...DEFAULT_DESIGN,
            image: activePrint.image,
            side,
            x: activePrint.x,
            y: activePrint.y,
            scale: activePrint.scale,
          }
        : DEFAULT_DESIGN,
    [activePrint, side],
  );

  async function handleFile(file: File, nextSide: "front" | "back") {
    setBusy(true);
    setSide(nextSide);
        setMessage("Finding the design on the T-shirt…");
    try {
      const original = await fileToDataUrl(file);
      const isolated = await removeImageBackground(original);
      const print = await extractShirtPrint(isolated);
      if (nextSide === "front") {
        setFrontPrint(print);
        setHex(print.hex);
      } else {
        setBackPrint(print);
      }
      setMoveTarget("image");
      setLocked(true);
      setMessage(
        "The design is off the shirt and on the model. Drag it if you want to nudge it.",
      );
    } catch {
      setMessage("Couldn’t read that photo. Try a clearer shot of the T-shirt.");
    } finally {
      setBusy(false);
    }
  }

  async function saveShirt() {
    if (!frontPrint) {
      setMessage("Add a front photo first.");
      return;
    }
    setBusy(true);
    try {
      const frontImage = await uploadDataUrl(frontPrint.image, "print-front.png");
      const backImage = backPrint
        ? await uploadDataUrl(backPrint.image, "print-back.png")
        : undefined;
      const next: ShirtProduct = {
        id: `admin-${Date.now()}`,
        name: name.trim() || "Printed shirt",
        hex,
        featured: true,
        frontPrint: { ...frontPrint, image: frontImage },
        backPrint: backPrint && backImage ? { ...backPrint, image: backImage } : undefined,
      };
      const list = [next, ...shirts.map((item) => ({ ...item, featured: false }))];
      try {
        await persistShirts(list, catalog);
      } catch {
        saveAdminShirts(list);
      }
      setShirts(list);
      setName("");
      setFrontPrint(null);
      setBackPrint(null);
      setHex("#FFFFFF");
      setMessage(
        "Saved. Open the homepage — this look is now on the 3D T-shirt.",
      );
    } catch {
      setMessage("Couldn’t save that shirt. Try a smaller photo, then save again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeShirt(id: string) {
    const list = shirts.filter((item) => item.id !== id);
    await persistShirts(list, catalog);
    setShirts(list);
  }

  function movePrint(next: { x: number; y: number }) {
    if (side === "back") {
      setBackPrint((current) => (current ? { ...current, ...next } : current));
      return;
    }
    setFrontPrint((current) => (current ? { ...current, ...next } : current));
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Look name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Cafe logo tee"
              className="h-12 w-full rounded-full bg-white px-4 ring-1 ring-charcoal/10 outline-none focus:ring-terracotta/50"
            />
          </label>
          <div>
            <p className="mb-2 text-sm font-semibold">Front photo</p>
            <p className="mb-3 text-sm text-charcoal/55">
              Upload a photo of the T-shirt. We keep only the design — text,
              logo, or any graphic — and leave the shirt itself out.
            </p>
            <FilePickButton
              label="Choose front photo"
              disabled={busy}
              onFiles={(files) => {
                if (files[0]) void handleFile(files[0], "front");
              }}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Back photo (optional)</p>
            <FilePickButton
              label="Choose back photo"
              disabled={busy}
              className="bg-charcoal hover:bg-charcoal/90"
              onFiles={(files) => {
                if (files[0]) void handleFile(files[0], "back");
              }}
            />
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Shirt color
            </span>
            <p className="mb-2 text-sm text-charcoal/55">
              Picked from the photo. Change it if we missed the fabric.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(event) => setHex(event.target.value)}
                className="h-12 w-16 cursor-pointer rounded-xl bg-transparent"
              />
              <span className="text-sm font-semibold uppercase tracking-wide text-charcoal/60">
                {hex}
              </span>
            </div>
          </label>
          <Button onClick={() => void saveShirt()} disabled={busy || !frontPrint}>
            Save this look
          </Button>
          {message ? <p className="text-sm text-charcoal/65">{message}</p> : null}
        </div>
        <div>
          <div className="mb-3 inline-flex rounded-full bg-white p-1 ring-1 ring-charcoal/8">
            {(["front", "back"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSide(value)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold capitalize",
                  side === value ? "bg-terracotta text-white" : "text-charcoal/60",
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <ShirtStage showLiveBadge>
            <div className="relative">
              <TShirtCanvas
                className="h-[420px] w-full cursor-grab active:cursor-grabbing"
                color={hex}
                design={previewDesign}
                side={side}
                autoRotate={false}
                onPlace={movePrint}
                enableDesignDrag={Boolean(activePrint)}
                moveTarget={moveTarget}
                locked={locked}
                onMoveTarget={setMoveTarget}
              />
              {busy ? (
                <div className="absolute inset-0 grid place-items-center bg-white/60 text-sm font-semibold">
                  Reading the T-shirt photo…
                </div>
              ) : null}
            </div>
          </ShirtStage>
          {activePrint ? (
            <div className="mt-3">
              <StageMoveBar
                moveTarget={moveTarget}
                locked={locked}
                hasDesign
                onMoveTarget={setMoveTarget}
                onLocked={setLocked}
              />
              <label className="mt-3 block px-1">
                <span className="mb-1 block text-xs font-semibold text-charcoal/50">
                  Print size
                </span>
                <input
                  type="range"
                  min={0.45}
                  max={2.7}
                  step={0.01}
                  value={activePrint.scale}
                  onChange={(event) => {
                    const scale = Number(event.target.value);
                    if (side === "back") {
                      setBackPrint((current) =>
                        current ? { ...current, scale } : current,
                      );
                      return;
                    }
                    setFrontPrint((current) =>
                      current ? { ...current, scale } : current,
                    );
                  }}
                  className="w-full accent-terracotta"
                />
              </label>
              <p className="mt-2 text-center text-xs font-semibold text-charcoal/50">
                Drag on the shirt to move the print. Switch to Move T-shirt to
                spin.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {shirts.length ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Your looks</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {shirts.map((shirt) => (
              <article
                key={shirt.id}
                className="rounded-[24px] bg-white p-3 ring-1 ring-charcoal/8"
              >
                {shirt.frontPrint?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shirt.frontPrint.image}
                    alt=""
                    className="mb-3 aspect-square w-full rounded-2xl bg-cream object-contain p-3"
                  />
                ) : (
                  <div className="mb-3 h-16 rounded-2xl bg-cream" />
                )}
                <p className="font-semibold">{shirt.name}</p>
                <button
                  type="button"
                  className="mt-2 text-sm text-terracotta"
                  onClick={() => void removeShirt(shirt.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function InspirationAdmin({ catalog }: { catalog: boolean }) {
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/catalog/inspiration");
      const json = (await response.json()) as { items?: InspirationItem[] };
      setItems(json.items?.length ? json.items : loadLocalInspiration());
    })();
  }, []);

  async function handleFiles(files: FileList | File[]) {
    const remaining = MAX_INSPIRATION_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, remaining);
    if (!picked.length) {
      setMessage(`You can add up to ${MAX_INSPIRATION_PHOTOS} photos.`);
      return;
    }
    const urls = await Promise.all(picked.map((file) => fileToDataUrl(file)));
    setPhotos((current) => [...current, ...urls]);
    if (!title && picked[0]) {
      setTitle(picked[0].name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
    setCoverIndex((current) => {
      if (index === current) return 0;
      return index < current ? current - 1 : current;
    });
  }

  async function saveItem() {
    if (!photos.length) {
      setMessage("Add at least one photo — the first can be the cover.");
      return;
    }
    setBusy(true);
    try {
      const images = await Promise.all(
        photos.map((photo, index) =>
          uploadDataUrl(photo, `inspiration-${index + 1}.png`),
        ),
      );
      const cover = Math.min(coverIndex, images.length - 1);
      const copy = description.trim();
      const next: InspirationItem = {
        id: `insp-${Date.now()}`,
        title: title.trim() || "Inspiration",
        description: copy || undefined,
        note: copy || undefined,
        images,
        coverIndex: cover,
        imageUrl: images[cover],
      };
      const list = [next, ...items];
      await persistInspiration(list, catalog);
      setItems(list);
      setTitle("");
      setDescription("");
      setPhotos([]);
      setCoverIndex(0);
      setMessage(
        catalog
          ? "Saved. Visitors can open it in the gallery for details and full-screen photos."
          : "Saved on this browser. Add a Blob token so the public gallery can show it.",
      );
    } catch {
      setMessage("Couldn’t save those photos. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(id: string) {
    const list = items.filter((item) => item.id !== id);
    await persistInspiration(list, catalog);
    setItems(list);
  }

  const slotsLeft = MAX_INSPIRATION_PHOTOS - photos.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Night market tee"
            className="h-12 w-full rounded-full bg-white px-4 ring-1 ring-charcoal/10 outline-none focus:ring-terracotta/50"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What this tee is, who it was for, fabric, print notes…"
            rows={4}
            className="w-full resize-y rounded-[22px] bg-white px-4 py-3 ring-1 ring-charcoal/10 outline-none focus:ring-terracotta/50"
          />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <IconImage className="size-4 text-terracotta" />
            Photos · {photos.length}/{MAX_INSPIRATION_PHOTOS}
          </span>
          <p className="mb-2 text-sm text-charcoal/55">
            Add 5–6 shots if you can — front, back, sides, and details. Pick one
            cover for the gallery grid.
          </p>
          <FilePickButton
            label={
              slotsLeft <= 0
                ? "Photo limit reached"
                : `Choose from files · ${slotsLeft} left`
            }
            multiple
            disabled={slotsLeft <= 0 || busy}
            onFiles={(files) => void handleFiles(files)}
          />
        </label>
        <Button onClick={() => void saveItem()} disabled={busy || !photos.length}>
          Add to inspiration
        </Button>
        {message ? <p className="text-sm text-charcoal/65">{message}</p> : null}
      </div>

      <div className="space-y-4">
        {photos.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <article
                key={`${photo.slice(0, 24)}-${index}`}
                className="overflow-hidden rounded-[22px] bg-white p-2 ring-1 ring-charcoal/8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => setCoverIndex(index)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      coverIndex === index
                        ? "bg-terracotta text-white"
                        : "bg-cream text-charcoal/70 ring-1 ring-charcoal/10",
                    )}
                  >
                    <IconCover className="size-3.5" />
                    {coverIndex === index ? "Cover" : "Set cover"}
                  </button>
                  <button
                    type="button"
                    className="text-xs font-semibold text-terracotta"
                    onClick={() => removePhoto(index)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid h-64 place-items-center rounded-[28px] bg-white text-sm text-charcoal/50 ring-1 ring-charcoal/8">
            Add photos to preview them here.
          </div>
        )}

        {items.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const cover = inspirationCover(item);
              const count = inspirationPhotos(item).length;
              return (
                <article
                  key={item.id}
                  className="rounded-[24px] bg-white p-3 ring-1 ring-charcoal/8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={item.title}
                    className="mb-2 aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-charcoal/50">
                    {count} photo{count === 1 ? "" : "s"}
                  </p>
                  <button
                    type="button"
                    className="mt-1 text-sm text-terracotta"
                    onClick={() => void removeItem(item.id)}
                  >
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
