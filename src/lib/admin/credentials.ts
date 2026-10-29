/** Normalized admin env (trims copy-paste newlines from hosting dashboards). */
export function getAdminPasswordFromEnv(): string {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function getAdminSessionSecretFromEnv(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  const password = getAdminPasswordFromEnv();
  return secret || password;
}

export function isAdminPasswordConfigured(): boolean {
  return getAdminPasswordFromEnv().length > 0;
}

/** HTTPS behind reverse proxy — needed for Secure cookies to stick. */
export function requestIsSecure(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() === "https";
  }
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}
