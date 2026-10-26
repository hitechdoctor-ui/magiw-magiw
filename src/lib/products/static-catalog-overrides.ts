import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const LOCAL_FILE = path.join(process.cwd(), "data", "static-catalog-overrides.json");

export type StaticCatalogOverride = {
  slug: string;
  visible_in_eshop: boolean;
  deleted: boolean;
  updated_at: string;
};

type OverrideMap = Record<string, StaticCatalogOverride>;

async function readOverrides(): Promise<OverrideMap> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as OverrideMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeOverrides(map: OverrideMap) {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(map, null, 2), "utf8");
}

export async function getStaticCatalogOverride(
  slug: string,
): Promise<StaticCatalogOverride | null> {
  const map = await readOverrides();
  return map[slug] ?? null;
}

export async function listStaticCatalogOverrides(): Promise<StaticCatalogOverride[]> {
  const map = await readOverrides();
  return Object.values(map);
}

export async function setStaticProductVisibleInEshop(
  slug: string,
  visible: boolean,
): Promise<StaticCatalogOverride> {
  const map = await readOverrides();
  const existing = map[slug];
  const row: StaticCatalogOverride = {
    slug,
    visible_in_eshop: visible,
    deleted: existing?.deleted ?? false,
    updated_at: new Date().toISOString(),
  };
  map[slug] = row;
  await writeOverrides(map);
  return row;
}

export async function deleteStaticCatalogProduct(
  slug: string,
): Promise<StaticCatalogOverride> {
  const map = await readOverrides();
  const row: StaticCatalogOverride = {
    slug,
    visible_in_eshop: false,
    deleted: true,
    updated_at: new Date().toISOString(),
  };
  map[slug] = row;
  await writeOverrides(map);
  return row;
}

export async function isStaticProductDeleted(slug: string): Promise<boolean> {
  const map = await readOverrides();
  return map[slug]?.deleted === true;
}

export async function isStaticProductHiddenFromEshop(
  slug: string,
): Promise<boolean> {
  const map = await readOverrides();
  const row = map[slug];
  if (!row) return false;
  if (row.deleted) return true;
  return row.visible_in_eshop === false;
}

export async function getHiddenStaticSlugs(): Promise<string[]> {
  const map = await readOverrides();
  return Object.values(map)
    .filter((row) => row.deleted || row.visible_in_eshop === false)
    .map((row) => row.slug);
}

export async function getDeletedStaticSlugs(): Promise<string[]> {
  const map = await readOverrides();
  return Object.values(map)
    .filter((row) => row.deleted)
    .map((row) => row.slug);
}
