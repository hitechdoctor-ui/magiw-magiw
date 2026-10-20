"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

type LanguageSwitchProps = {
  variant?: "site" | "landing" | "runway";
  className?: string;
};

const variantClasses = {
  site: "text-neutral-400 hover:text-neutral-700",
  landing: "text-[#6b563c]/55 hover:text-[#9a7b3c]",
  runway: "text-white/45 hover:text-white/75",
};

export function LanguageSwitch({
  variant = "site",
  className = "",
}: LanguageSwitchProps) {
  const { locale, toggleLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`text-[10px] uppercase tracking-[0.32em] transition ${variantClasses[variant]} ${className}`}
      aria-label={t("langSwitchAria")}
      title={t("langSwitchAria")}
    >
      {t("langSwitch")}
    </button>
  );
}
