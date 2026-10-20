"use client";

import { CartLineList } from "@/components/cart/CartLineList";
import { useCart } from "@/components/cart/CartProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CHECKOUT_DRAFT_KEY, CHECKOUT_SHIPPING_CENTS } from "@/lib/checkout/constants";
import {
  emptyCheckoutDraft,
  type CheckoutDraft,
  type CheckoutStep,
} from "@/lib/checkout/types";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const STEPS: CheckoutStep[] = ["contact", "shipping", "review", "payment"];

function loadDraft(): CheckoutDraft {
  if (typeof window === "undefined") return emptyCheckoutDraft();
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return emptyCheckoutDraft();
    return { ...emptyCheckoutDraft(), ...JSON.parse(raw) };
  } catch {
    return emptyCheckoutDraft();
  }
}

function saveDraft(draft: CheckoutDraft) {
  try {
    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

function applyDiscount(subtotalCents: number, code: string) {
  const normalized = code.trim().toUpperCase();
  if (normalized.startsWith("MAGIW5-") && normalized.length >= 10) {
    return Math.round(subtotalCents * 0.05);
  }
  return 0;
}

export function CheckoutFlow() {
  const { t } = useLocale();
  const { lines, removeLine, subtotalCents, currency, count, clearCart } =
    useCart();

  const [step, setStep] = useState<CheckoutStep>("contact");
  const [draft, setDraft] = useState<CheckoutDraft>(emptyCheckoutDraft);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  const discountCents = useMemo(
    () => applyDiscount(subtotalCents, draft.discountCode),
    [subtotalCents, draft.discountCode],
  );
  const shippingCents = count > 0 ? CHECKOUT_SHIPPING_CENTS : 0;
  const totalCents = Math.max(
    0,
    subtotalCents + shippingCents - discountCents,
  );

  const stepLabels: Record<CheckoutStep, string> = {
    contact: t("checkoutStepContact"),
    shipping: t("checkoutStepShipping"),
    review: t("checkoutStepReview"),
    payment: t("checkoutStepPayment"),
    done: "",
  };

  const stepIndex = STEPS.indexOf(step as (typeof STEPS)[number]);

  const update = (patch: Partial<CheckoutDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const validateContact = () =>
    draft.firstName.trim() &&
    draft.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()) &&
    draft.phone.trim().length >= 6;

  const validateShipping = () =>
    draft.addressLine1.trim() &&
    draft.city.trim() &&
    draft.postalCode.trim().length >= 4;

  const goNext = () => {
    setError(null);
    if (step === "contact" && !validateContact()) {
      setError(t("checkoutFieldRequired"));
      return;
    }
    if (step === "shipping" && !validateShipping()) {
      setError(t("checkoutFieldRequired"));
      return;
    }
    if (step === "contact") setStep("shipping");
    else if (step === "shipping") setStep("review");
    else if (step === "review") setStep("payment");
  };

  const goBack = () => {
    setError(null);
    if (step === "shipping") setStep("contact");
    else if (step === "review") setStep("shipping");
    else if (step === "payment") setStep("review");
  };

  const handlePlaceDemoOrder = () => {
    clearCart();
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    setStep("done");
  };

  if (!hydrated) {
    return (
      <div className="min-h-[40vh] bg-[#faf8f5]" aria-busy="true" />
    );
  }

  if (count === 0 && step !== "done") {
    return (
      <div className="min-h-screen bg-[#faf8f5] px-6 py-16 text-center">
        <p className="text-sm text-neutral-600">{t("checkoutEmptyCart")}</p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-[10px] uppercase tracking-[0.28em] text-neutral-900 underline-offset-4 hover:underline"
        >
          {t("cartPageContinue")}
        </Link>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="min-h-screen bg-[#faf8f5] px-6 py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
          MAGIW MAGIW
        </p>
        <h1 className="mt-4 font-serif text-3xl text-neutral-950">
          {t("checkoutSuccessTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
          {t("checkoutSuccessBody")}
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-block bg-neutral-950 px-8 py-4 text-[11px] uppercase tracking-[0.26em] text-white hover:bg-neutral-800"
        >
          {t("checkoutSuccessBack")}
        </Link>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900";
  const labelClass =
    "block text-left text-[10px] uppercase tracking-[0.22em] text-neutral-500";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          href="/cart"
          className="text-[10px] uppercase tracking-[0.32em] text-neutral-400 hover:text-neutral-700"
        >
          {t("checkoutBackCart")}
        </Link>

        <h1 className="mt-6 font-serif text-3xl text-neutral-950 sm:text-4xl">
          {t("checkoutTitle")}
        </h1>

        <ol className="mt-8 flex flex-wrap gap-2 sm:gap-4">
          {STEPS.map((key, index) => (
            <li
              key={key}
              className={`text-[10px] uppercase tracking-[0.24em] ${
                index <= stepIndex
                  ? "text-neutral-900"
                  : "text-neutral-300"
              }`}
            >
              {index + 1}. {stepLabels[key]}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <form
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                if (step === "payment") handlePlaceDemoOrder();
                else goNext();
              }}
              className="rounded-sm border border-stone-200 bg-white p-5 sm:p-6"
            >
              {step === "contact" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    {t("checkoutFirstName")}
                    <input
                      required
                      value={draft.firstName}
                      onChange={(e) => update({ firstName: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    {t("checkoutLastName")}
                    <input
                      required
                      value={draft.lastName}
                      onChange={(e) => update({ lastName: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <label className={`${labelClass} sm:col-span-2`}>
                    {t("checkoutEmail")}
                    <input
                      type="email"
                      required
                      value={draft.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <label className={`${labelClass} sm:col-span-2`}>
                    {t("checkoutPhone")}
                    <input
                      type="tel"
                      required
                      value={draft.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                </div>
              )}

              {step === "shipping" && (
                <div className="grid gap-4">
                  <label className={labelClass}>
                    {t("checkoutAddress")}
                    <input
                      required
                      value={draft.addressLine1}
                      onChange={(e) => update({ addressLine1: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                      {t("checkoutCity")}
                      <input
                        required
                        value={draft.city}
                        onChange={(e) => update({ city: e.target.value })}
                        className={inputClass}
                      />
                    </label>
                    <label className={labelClass}>
                      {t("checkoutPostal")}
                      <input
                        required
                        value={draft.postalCode}
                        onChange={(e) => update({ postalCode: e.target.value })}
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className={labelClass}>
                    {t("checkoutCountry")}
                    <input
                      value={draft.country === "GR" ? "Ελλάδα" : draft.country}
                      readOnly
                      className={`${inputClass} bg-neutral-50 text-neutral-600`}
                    />
                  </label>
                  <label className={labelClass}>
                    {t("checkoutNotes")}
                    <textarea
                      rows={3}
                      value={draft.notes}
                      onChange={(e) => update({ notes: e.target.value })}
                      className={inputClass}
                    />
                  </label>
                </div>
              )}

              {step === "review" && (
                <div className="space-y-4 text-sm text-neutral-700">
                  <p>
                    <span className="text-neutral-400">Email · </span>
                    {draft.email}
                  </p>
                  <p>
                    <span className="text-neutral-400">Ship · </span>
                    {draft.addressLine1}, {draft.postalCode} {draft.city}
                  </p>
                  <label className={labelClass}>
                    {t("checkoutDiscountCode")}
                    <input
                      value={draft.discountCode}
                      onChange={(e) => update({ discountCode: e.target.value })}
                      placeholder={t("checkoutDiscountPlaceholder")}
                      className={inputClass}
                    />
                  </label>
                  {discountCents > 0 && (
                    <p className="text-xs text-neutral-600">
                      -5% · −{formatPricePrecise(discountCents, currency)}
                    </p>
                  )}
                </div>
              )}

              {step === "payment" && (
                <div>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {t("checkoutPaymentSoon")}
                  </p>
                  <div className="mt-6 space-y-4 opacity-55" aria-disabled>
                    <label className={labelClass}>
                      {t("checkoutCardNumber")}
                      <input
                        disabled
                        placeholder="4242 4242 4242 4242"
                        className={inputClass}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={labelClass}>
                        {t("checkoutCardExpiry")}
                        <input disabled placeholder="MM / YY" className={inputClass} />
                      </label>
                      <label className={labelClass}>
                        {t("checkoutCardCvc")}
                        <input disabled placeholder="CVC" className={inputClass} />
                      </label>
                    </div>
                    <label className={labelClass}>
                      {t("checkoutCardName")}
                      <input disabled className={inputClass} />
                    </label>
                  </div>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                    Stripe · Visa · Mastercard
                  </p>
                </div>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {step !== "contact" && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="border border-stone-300 px-6 py-3 text-[10px] uppercase tracking-[0.24em] hover:border-neutral-900"
                  >
                    ←
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-neutral-950 py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-white hover:bg-neutral-800"
                >
                  {step === "payment"
                    ? t("checkoutPlaceOrderDemo")
                    : t("checkoutContinue")}
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-sm border border-stone-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                {t("checkoutOrderSummary")}
              </p>
              <div className="mt-4 max-h-64 overflow-y-auto">
                <CartLineList lines={lines} onRemove={removeLine} />
              </div>
              <div className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">{t("cartSubtotal")}</span>
                  <span className="font-mono">
                    {formatPricePrecise(subtotalCents, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    {t("checkoutShippingFee")}
                  </span>
                  <span className="font-mono">
                    {formatPricePrecise(shippingCents, currency)}
                  </span>
                </div>
                {discountCents > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>−5%</span>
                    <span className="font-mono">
                      −{formatPricePrecise(discountCents, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-base">
                  <span className="uppercase tracking-[0.2em] text-neutral-800">
                    {t("checkoutTotal")}
                  </span>
                  <span className="font-mono text-lg">
                    {formatPricePrecise(totalCents, currency)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
