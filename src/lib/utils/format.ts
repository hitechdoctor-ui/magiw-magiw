export function formatPrice(priceCents: number, currency = "EUR") {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function formatPricePrecise(priceCents: number, currency = "EUR") {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function formatRelativeDate(isoDate: string | null) {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);

  if (diffDays <= 0) return "Σήμερα";
  if (diffDays === 1) return "Χθες";
  if (diffDays < 7) return `${diffDays} ημέρες πριν`;

  return new Intl.DateTimeFormat("el-GR", {
    day: "numeric",
    month: "short",
  }).format(date);
}
