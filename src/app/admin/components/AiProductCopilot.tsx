"use client";

import {
  AdminSortableImageGrid,
  reorderByIndex,
} from "@/components/admin/AdminSortableImageGrid";
import {
  clearCopilotWorkbench,
  loadCopilotWorkbench,
  productAdminPreviewHref,
  saveCopilotWorkbench,
  storedProductToDraftFallback,
} from "@/lib/admin/copilot-workbench";
import type { AiProductDraft } from "@/lib/ai/product-schema";
import type { StoredProduct } from "@/lib/products/types";
import { formatPricePrecise } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const STARTER: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Περιγράψτε το κομμάτι ή το look — π.χ. υφάσματα, σιλουέτα, collection, τιμή. Μπορείτε να ανεβάσετε μία ή περισσότερες φωτογραφίες (μπροστά, πίσω, λεπτομέρεια).",
};

const MAX_UPLOAD_IMAGES = 10;

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

function ProductPreviewCard({
  product,
  draft,
  onPublish,
  publishing,
}: {
  product: StoredProduct;
  draft: AiProductDraft;
  onPublish: () => void;
  publishing: boolean;
}) {
  const priceLabel = formatPricePrecise(product.price_cents, product.currency);

  return (
    <div className="mt-4 rounded-sm border border-stone-200 bg-white p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
        Preview · {product.is_active ? "Δημοσιευμένο" : "Πρόχειρο"}
      </p>
      {product.image_urls?.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-xs">
          {product.image_urls.slice(0, 4).map((src, index) => (
            <div
              key={src}
              className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
            >
              <Image
                src={src}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-amber-800">
          Χωρίς ανεβασμένη φωτο — στο site εμφανίζεται προσωρινή εικόνα.
        </p>
      )}
      <h3 className="mt-2 font-serif text-xl text-neutral-950">{product.name}</h3>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
        {draft.subtitle} · {draft.category}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700 line-clamp-4">
        {draft.description}
      </p>
      <ul className="mt-3 space-y-1 text-sm text-neutral-600">
        {draft.features.slice(0, 4).map((feature) => (
          <li key={feature}>· {feature}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
        <span className="font-medium text-neutral-900">{priceLabel}</span>
        <span>{draft.sizes.join(" · ")}</span>
        {draft.colors.length > 0 && (
          <span>{draft.colors.join(" · ")}</span>
        )}
        {draft.is_bundle && (
          <span className="rounded-sm bg-neutral-100 px-2 py-0.5 uppercase tracking-wider">
            Bundle
          </span>
        )}
      </div>
      {product.is_active && (
        <p className="mt-4 text-xs text-emerald-800">
          Ζωντανό ·{" "}
          <Link href={`/product/${product.slug}`} className="underline">
            /product/{product.slug}
          </Link>{" "}
          ·{" "}
          <Link href="/shop#ai-catalog" className="underline">
            εμφάνιση στο Shop
          </Link>
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={productAdminPreviewHref(product.slug, product.is_active)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-neutral-900 px-4 py-2 text-[10px] uppercase tracking-[0.22em] hover:bg-neutral-950 hover:text-white"
        >
          Προεπισκόπηση (νέα καρτέλα)
        </Link>
        {!product.is_active && (
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className="bg-neutral-950 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {publishing ? "Δημοσίευση…" : "Δημοσίευση στο Shop"}
          </button>
        )}
        {product.is_active && (
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-400 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            Ζωντανό PDP
          </Link>
        )}
      </div>
    </div>
  );
}

type AiProductCopilotProps = {
  editProductId?: string;
  startFresh?: boolean;
};

export function AiProductCopilot({
  editProductId,
  startFresh = false,
}: AiProductCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER]);
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProduct, setLastProduct] = useState<StoredProduct | null>(null);
  const [lastDraft, setLastDraft] = useState<AiProductDraft | null>(null);
  const [workbenchHydrated, setWorkbenchHydrated] = useState(false);
  const [draftCatalog, setDraftCatalog] = useState<StoredProduct[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(
    editProductId ?? null,
  );
  const multiFileRef = useRef<HTMLInputElement>(null);
  const singleFileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [savedGallery, setSavedGallery] = useState<string[]>([]);
  const [galleryDirty, setGalleryDirty] = useState(false);
  const [gallerySaving, setGallerySaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingImagesRef = useRef(pendingImages);
  pendingImagesRef.current = pendingImages;

  useEffect(() => {
    return () => {
      for (const item of pendingImagesRef.current) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (startFresh) {
      clearCopilotWorkbench();
      setEditingProductId(null);
      setLastProduct(null);
      setLastDraft(null);
      setMessages([STARTER]);
      setInput("");
      setError(null);
    }

    const saved = startFresh ? null : loadCopilotWorkbench();

    void (async () => {
      try {
        if (editProductId) {
          const editRes = await fetch(`/api/admin/products/${editProductId}`, {
            credentials: "same-origin",
          });
          if (editRes.ok) {
            const data = (await editRes.json()) as { product?: StoredProduct };
            if (data.product) {
              setEditingProductId(data.product.id);
              setLastProduct(data.product);
              setLastDraft(storedProductToDraftFallback(data.product));
              setMessages([
                STARTER,
                {
                  id: "edit-mode",
                  role: "assistant",
                  text: `Λειτουργία επεξεργασίας: «${data.product.name}». Γράψε τι θέλεις να αλλάξει (τιμή, χρώματα, κείμενο, sizes) και πάτα «Ενημέρωση με AI».`,
                },
              ]);
            }
          }
        } else if (!startFresh && saved?.lastProduct) {
          setLastProduct(saved.lastProduct);
          setLastDraft(
            saved.lastDraft ?? storedProductToDraftFallback(saved.lastProduct),
          );
          if (saved.messages?.length) setMessages(saved.messages);
          if (saved.lastProduct.id) {
            setEditingProductId(saved.lastProduct.id);
          }
        }

        const response = await fetch("/api/admin/products/drafts", {
          credentials: "same-origin",
        });
        if (response.ok) {
          const data = (await response.json()) as { drafts?: StoredProduct[] };
          setDraftCatalog(data.drafts ?? []);
        }
      } finally {
        setWorkbenchHydrated(true);
        if (startFresh && typeof window !== "undefined") {
          window.history.replaceState(null, "", "/admin/products");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount / edit / fresh only
  }, [editProductId, startFresh]);

  useEffect(() => {
    if (!workbenchHydrated) return;
    saveCopilotWorkbench({
      messages,
      lastProduct,
      lastDraft,
    });
  }, [messages, lastProduct, lastDraft, workbenchHydrated]);

  useEffect(() => {
    if (!lastProduct) {
      setSavedGallery([]);
      setGalleryDirty(false);
      return;
    }
    if (!galleryDirty) {
      setSavedGallery([...(lastProduct.image_urls ?? [])]);
    }
  }, [lastProduct, galleryDirty]);

  const loadDraftIntoWorkbench = (product: StoredProduct) => {
    setEditingProductId(product.id);
    setLastProduct(product);
    setLastDraft(storedProductToDraftFallback(product));
    appendMessage(
      "assistant",
      `Επεξεργασία: «${product.name}» — περιγράψε τις αλλαγές και πάτα «Ενημέρωση με AI».`,
    );
  };

  const clearSelectedImages = () => {
    for (const item of pendingImages) {
      URL.revokeObjectURL(item.previewUrl);
    }
    setPendingImages([]);
    if (multiFileRef.current) multiFileRef.current.value = "";
    if (singleFileRef.current) singleFileRef.current.value = "";
  };

  const resetToNewProduct = () => {
    clearCopilotWorkbench();
    setEditingProductId(null);
    setLastProduct(null);
    setLastDraft(null);
    setMessages([STARTER]);
    setInput("");
    setError(null);
    clearSelectedImages();
    if (typeof window !== "undefined") {
      window.location.assign("/admin/products?new=1");
    }
  };

  const handleImagesPick = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    appendFiles(Array.from(fileList));
  };

  const removePendingImage = (id: string) => {
    setPendingImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const saveGalleryOrder = async () => {
    if (!lastProduct || gallerySaving) return;
    setGallerySaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${lastProduct.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_urls: savedGallery }),
      });
      const data = (await response.json()) as {
        product?: StoredProduct;
        error?: string;
      };
      if (response.status === 401) {
        window.location.assign("/admin");
        return;
      }
      if (!response.ok || !data.product) {
        setError("Δεν αποθηκεύτηκε η σειρά φωτογραφιών.");
        return;
      }
      setLastProduct(data.product);
      setSavedGallery([...(data.product.image_urls ?? [])]);
      setGalleryDirty(false);
      appendMessage(
        "assistant",
        "Ενημερώθηκε η σειρά / οι φωτογραφίες του προϊόντος — #1 είναι η κύρια στο Shop.",
      );
    } catch {
      setError("Σφάλμα αποθήκευσης gallery.");
    } finally {
      setGallerySaving(false);
    }
  };

  const appendFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    setPendingImages((prev) => {
      const next = [...prev];
      for (const file of incoming) {
        if (next.length >= MAX_UPLOAD_IMAGES) break;
        const duplicate = next.some(
          (item) =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified,
        );
        if (duplicate) continue;
        next.push({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
      return next;
    });

    if (multiFileRef.current) multiFileRef.current.value = "";
    if (singleFileRef.current) singleFileRef.current.value = "";
  };

  const appendMessage = (role: ChatRole, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, role, text },
    ]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setError(null);
    setLoading(true);
    appendMessage("user", prompt);
    setInput("");

    try {
      const form = new FormData();
      form.set("prompt", prompt);
      for (const item of pendingImages) {
        form.append("images", item.file);
      }
      if (editingProductId) {
        form.set("productId", editingProductId);
      }

      const response = await fetch("/api/admin/ai-product", {
        method: "POST",
        credentials: "same-origin",
        body: form,
      });

      const data = (await response.json()) as {
        error?: string;
        product?: StoredProduct;
        draft?: AiProductDraft;
        storage_warning?: string;
      };

      if (response.status === 401) {
        window.location.href = "/admin";
        return;
      }

      if (!response.ok) {
        const code = data.error ?? "generation_failed";
        if (code === "openai_not_configured") {
          setError(
            "Λείπει το OPENAI_API_KEY online — πρόσθεσέ το στο Railway (service magiw-magiw → Variables → production) όπως το ADMIN_PASSWORD, μετά Redeploy. Το .env.local του laptop δεν ανεβαίνει στο site.",
          );
        } else if (code === "image_too_large") {
          setError("Κάποια εικόνα ξεπερνά τα 4 MB — μίκρυνέ την και δοκίμασε ξανά.");
        } else if (code === "image_upload_failed") {
          setError(
            "Αποτυχία αποθήκευσης φωτογραφίας στο Supabase Storage — έλεγξε ότι τρέχει το migration 010 (bucket product-images) και τα Supabase env στο Railway.",
          );
        } else {
          setError("Δεν δημιουργήθηκε προϊόν. Δοκιμάστε ξανά με πιο συγκεκριμένο brief.");
        }
        appendMessage(
          "assistant",
          "Δεν ολοκληρώθηκε η δημιουργία — δοκιμάστε ξανά ή ελέγξτε τα env keys.",
        );
        return;
      }

      if (data.product && data.draft) {
        setLastProduct(data.product);
        setLastDraft(data.draft);
        appendMessage(
          "assistant",
          editingProductId
            ? `Ενημερώθηκε: «${data.product.name}» — έλεγξε preview και δημοσίευσε αν χρειάζεται.`
            : `Έτοιμο: «${data.product.name}» (${data.product.slug}). Αποθηκεύτηκε ως πρόχειρο — δημοσιεύστε όταν είστε έτοιμοι.`,
        );
        setEditingProductId(data.product.id);
        if (data.storage_warning === "ephemeral_disk") {
          appendMessage(
            "assistant",
            "Προσοχή: οι φωτό αποθηκεύτηκαν στον προσωρινό δίσκο του server (Railway) — μπορεί να μην φαίνονται μετά από redeploy. Όρισε NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY και ξανανέβασε τις φωτογραφίες.",
          );
        }
      }

      clearSelectedImages();
    } catch {
      setError("Σφάλμα δικτύου.");
    } finally {
      setLoading(false);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  };

  const handlePublish = async () => {
    if (!lastProduct || publishing) return;
    setPublishing(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/products/publish", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lastProduct.id }),
      });
      const data = (await response.json()) as {
        product?: StoredProduct;
        error?: string;
      };
      if (response.status === 401) {
        window.location.assign("/admin");
        return;
      }
      if (!response.ok || !data.product) {
        setError(
          data.error === "not_found"
            ? "Δεν βρέθηκε το προϊόν — ξαναδημιούργησέ το ή κάνε refresh τη σελίδα."
            : "Η δημοσίευση απέτυχε. Δοκίμασε ξανά.",
        );
        return;
      }
      setLastProduct(data.product);
      setDraftCatalog((prev) => prev.filter((d) => d.id !== data.product!.id));
      appendMessage(
        "assistant",
        `Δημοσιεύτηκε στο κατάστημα: /product/${data.product.slug}`,
      );
    } catch {
      setError("Σφάλμα δημοσίευσης.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div
          ref={scrollRef}
          className="flex max-h-[min(520px,60vh)] flex-col gap-3 overflow-y-auto rounded-sm border border-stone-200 bg-white p-4 sm:p-5"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[92%] rounded-sm px-3 py-2 text-sm leading-relaxed ${
                message.role === "user"
                  ? "ml-auto bg-neutral-950 text-white"
                  : "bg-neutral-100 text-neutral-800"
              }`}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-neutral-500">GPT-4o · δημιουργία προϊόντος…</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block text-[10px] uppercase tracking-[0.28em] text-neutral-500">
            Εντολή / brief
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder='π.χ. "Soft Denim Balance look — ριγέ πουκάμισο, rib top, wide-leg denim, 140€"'
              className="mt-2 w-full resize-y border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </label>
          <div
            className={`space-y-3 rounded-sm border p-3 transition-colors ${
              dragOver
                ? "border-neutral-900 bg-neutral-50"
                : "border-stone-200 bg-white"
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const files = Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith("image/"),
              );
              appendFiles(files);
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              Φωτογραφίες προϊόντος (προαιρετικό · έως {MAX_UPLOAD_IMAGES})
            </p>
            <input
              ref={multiFileRef}
              id="copilot-images-multi"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleImagesPick(e.target.files)}
              className="hidden"
            />
            <input
              ref={singleFileRef}
              id="copilot-images-single"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleImagesPick(e.target.files)}
              className="hidden"
            />
            <div className="flex flex-wrap gap-2">
              <label
                htmlFor="copilot-images-multi"
                className="cursor-pointer border border-neutral-900 px-3 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-950 hover:text-white"
              >
                Πολλές φωτο (Cmd/Ctrl)
              </label>
              <label
                htmlFor="copilot-images-single"
                className="cursor-pointer bg-neutral-900 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
              >
                + Μία ακόμη
              </label>
              {pendingImages.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelectedImages}
                  className="px-2 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500 hover:text-neutral-900"
                >
                  Αφαίρεση όλων
                </button>
              )}
            </div>
            <p className="text-xs leading-relaxed text-neutral-500">
              <strong className="font-medium text-neutral-700">
                Πολλαπλά χρώματα:
              </strong>{" "}
              ανέβασε{" "}
              <strong className="font-medium text-neutral-700">
                μία φωτογραφία ανά χρώμα
              </strong>{" "}
              με την ίδια σειρά (π.χ. 1η μπεζ, 2η πράσινο) — στο Shop αλλάζει
              η κύρια εικόνα όταν ο πελάτης επιλέγει χρώμα.
            </p>
            <p className="text-xs leading-relaxed text-neutral-500">
              Στο παράθυρο επιλογής:{" "}
              <strong className="font-medium text-neutral-700">Cmd+click</strong> (Mac) ή{" "}
              <strong className="font-medium text-neutral-700">Ctrl+click</strong> (Windows)
              για πολλές μαζί. Αν δεν δουλεύει, πάτα{" "}
              <strong className="font-medium text-neutral-700">+ Μία ακόμη</strong> για κάθε
              φωτο — ή σύρε-άφησε εδώ (drag & drop).
            </p>
            {pendingImages.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-600">
                  {pendingImages.length} νέ{pendingImages.length === 1 ? "α" : "ες"} φωτογραφί
                  {pendingImages.length === 1 ? "α" : "ες"} προς ανέβασμα — σύρε για σειρά (#1
                  πρώτη στο upload).
                </p>
                <AdminSortableImageGrid
                  items={pendingImages.map((item) => ({
                    id: item.id,
                    previewUrl: item.previewUrl,
                    caption: item.file.name,
                  }))}
                  onReorder={(from, to) =>
                    setPendingImages((prev) => reorderByIndex(prev, from, to))
                  }
                  onRemove={removePendingImage}
                  coverHint="Σειρά πριν το «Δημιουργία / Ενημέρωση με AI» — η #1 ανεβαίνει πρώτη."
                />
              </div>
            )}

            {lastProduct && savedGallery.length > 0 && (
              <div className="space-y-3 border-t border-stone-200 pt-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Αποθηκευμένες φωτογραφίες · {lastProduct.name}
                </p>
                <AdminSortableImageGrid
                  items={savedGallery.map((url) => ({
                    id: url,
                    previewUrl: url,
                    caption: url.split("/").pop() ?? url,
                  }))}
                  onReorder={(from, to) => {
                    setSavedGallery((prev) => reorderByIndex(prev, from, to));
                    setGalleryDirty(true);
                  }}
                  onRemove={(url) => {
                    setSavedGallery((prev) => prev.filter((item) => item !== url));
                    setGalleryDirty(true);
                  }}
                />
                {galleryDirty && (
                  <button
                    type="button"
                    onClick={() => void saveGalleryOrder()}
                    disabled={gallerySaving}
                    className="border border-neutral-900 px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-950 hover:text-white disabled:opacity-50"
                  >
                    {gallerySaving ? "Αποθήκευση…" : "Αποθήκευση σειράς / διαγραφών"}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-neutral-950 px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {loading ? "..." : editingProductId ? "Ενημέρωση με AI" : "Δημιουργία"}
            </button>
          </div>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>

      <aside className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
            Τελευταίο προϊόν
          </p>
          <button
            type="button"
            onClick={resetToNewProduct}
            className="border border-neutral-300 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            Νέο προϊόν
          </button>
        </div>
        {lastProduct && lastDraft ? (
          <ProductPreviewCard
            product={lastProduct}
            draft={lastDraft}
            onPublish={handlePublish}
            publishing={publishing}
          />
        ) : (
          <p className="mt-3 text-sm text-neutral-500">
            Η κάρτα preview εμφανίζεται μετά την πρώτη επιτυχημένη δημιουργία.
          </p>
        )}

        {draftCatalog.length > 0 && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              Πρόχειρα στο admin
            </p>
            <ul className="mt-3 space-y-2">
              {draftCatalog.slice(0, 8).map((draft) => (
                <li key={draft.id}>
                  <button
                    type="button"
                    onClick={() => loadDraftIntoWorkbench(draft)}
                    className={`w-full border px-3 py-2 text-left text-sm transition ${
                      lastProduct?.id === draft.id
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-stone-200 bg-white hover:border-neutral-400"
                    }`}
                  >
                    <span className="font-medium text-neutral-900">{draft.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-neutral-500">
                      {draft.slug}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-neutral-500">
          Η προεπισκόπηση ανοίγει σε{" "}
          <strong className="font-medium text-neutral-700">δεύτερη καρτέλα</strong>·
          αυτή η σελίδα κρατά το πρόχειρο για δημοσίευση (ακόμα κι αν αλλάξεις tab
          ή κάνεις refresh).
        </p>
      </aside>
    </div>
  );
}
