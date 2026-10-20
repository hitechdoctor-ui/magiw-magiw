import { randomBytes } from "crypto";

export function generateLaunchDiscountCode() {
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `MAGIW5-${suffix}`;
}
