"use client";

import { CartIconButton } from "@/components/cart/CartIconButton";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { useLocale } from "@/components/i18n/LocaleProvider";
import Image from "next/image";
import Link from "next/link";

type SilentRunwayHeaderProps = {
  cartCount: number;
  onCartClick: () => void;
};

export function SilentRunwayHeader({
  cartCount,
  onCartClick,
}: SilentRunwayHeaderProps) {
  const { t } = useLocale();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
      <Link
        href="/"
        className="pointer-events-auto block h-11 w-11 shrink-0 sm:h-12 sm:w-12"
        aria-label="MAGIW MAGIW"
      >
        <Image
          src="/brand/magiw-emblem.svg"
          alt=""
          width={48}
          height={48}
          className="h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
        />
      </Link>

      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/shop"
          className="hidden rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.28em] text-white/75 backdrop-blur-md transition hover:border-white/30 hover:text-white sm:inline"
        >
          {t("runwayCollection")}
        </Link>
        <LanguageSwitch variant="runway" />
        <CartIconButton
          count={cartCount}
          onClick={onCartClick}
          variant="runway"
        />
      </div>
    </header>
  );
}
