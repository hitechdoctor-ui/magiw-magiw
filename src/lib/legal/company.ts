/**
 * Business details shown on the legal pages and the help center.
 * DEMO values — replace with the real ones before going live.
 */
export const COMPANY = {
  isDemo: true,
  brand: "MAGIW MAGIW",
  legalName: "MAGIW MAGIW (demo επωνυμία)",
  vatNumber: "000000000",
  taxOffice: "ΔΟΥ Demo",
  gemiNumber: "000000000000",
  address: "Οδός Demo 1, 100 00 Αθήνα, Ελλάδα",
  email: "info@magiwmagiw.gr",
  phone: "+30 210 000 0000",
  hours: { el: "Δευτέρα – Παρασκευή, 10:00 – 18:00", en: "Monday – Friday, 10:00 – 18:00" },
  website: "magiwmagiw.gr",
} as const;

export const RETURN_DAYS = 14;
export const SHIPPING_FLAT_EUR = 6;
export const FREE_SHIPPING_FROM_EUR = 100;
export const LEGAL_UPDATED = { el: "30 Οκτωβρίου 2026", en: "30 October 2026" } as const;
