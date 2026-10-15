"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type VirtualTryOnModalProps = {
  productName: string;
  productImage: string;
  onClose: () => void;
};

export function VirtualTryOnModal({
  productName,
  productImage,
  onClose,
}: VirtualTryOnModalProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const userPhotoFileRef = useRef<File | null>(null);

  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (userPhotoUrl) URL.revokeObjectURL(userPhotoUrl);
    };
  }, [userPhotoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    userPhotoFileRef.current = file;
    setResultImageUrl(null);
    setErrorMessage(null);
    setUserPhotoUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    event.target.value = "";
  };

  const handleGenerate = async () => {
    const userFile = userPhotoFileRef.current;
    if (!userFile || isGenerating) return;

    setIsGenerating(true);
    setResultImageUrl(null);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("userImage", userFile);
      formData.append("productImageUrl", productImage);
      formData.append("garmentDescription", productName);

      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        outputUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.outputUrl) {
        throw new Error(payload.error ?? "Η δημιουργία απέτυχε.");
      }

      setResultImageUrl(payload.outputUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Κάτι πήγε στραβά. Δοκίμασε ξανά.";
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-2xl bg-[#faf8f5] shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="virtual-tryon-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-[#faf8f5] px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
              Virtual Try-On
            </p>
            <h2
              id="virtual-tryon-title"
              className="mt-1 font-serif text-xl text-neutral-950 sm:text-2xl"
            >
              Δες το πάνω σου
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-4 py-6 sm:px-6">
          {!userPhotoUrl ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-neutral-600">
                Βγάλε selfie ή ανέβασε φωτογραφία σώματος για να δεις πώς
                κάθεται το {productName}.
              </p>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full border border-neutral-900 bg-white py-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                Βγάλε φωτογραφία με την κάμερα
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-full border border-stone-300 bg-white py-4 text-sm text-neutral-800 transition hover:border-neutral-500"
              >
                Ανέβασε φωτογραφία από τη συλλογή
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Εσύ
                  </p>
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={userPhotoUrl}
                      alt="Η φωτογραφία σου"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                    Ρούχο
                  </p>
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-contain object-center"
                      sizes="200px"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setResultImageUrl(null);
                    setErrorMessage(null);
                    galleryInputRef.current?.click();
                  }}
                  className="flex-1 border border-stone-300 bg-white py-3 text-xs uppercase tracking-[0.2em] text-neutral-700"
                >
                  Νέα φωτογραφία
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex flex-1 items-center justify-center gap-2 bg-neutral-950 py-3 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-60"
                >
                  {isGenerating && (
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden
                    />
                  )}
                  {isGenerating
                    ? "AI δημιουργεί..."
                    : "Δημιουργία AI Εφαρμογής"}
                </button>
              </div>

              {isGenerating && (
                <p className="text-center text-xs text-neutral-500" aria-live="polite">
                  Το AI επεξεργάζεται τη φωτογραφία σου — συνήθως 20–60 δευτερόλεπτα.
                </p>
              )}

              {errorMessage && (
                <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {errorMessage}
                </p>
              )}

              {resultImageUrl && (
                <div className="border border-stone-200 bg-white p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                    AI Try-On Αποτέλεσμα
                  </p>
                  <div className="relative mt-3 aspect-[3/4] overflow-hidden bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultImageUrl}
                      alt={`AI try-on: ${productName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
