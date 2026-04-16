export type ProductCategory =
  | "Movement Systems"
  | "Prefabs"
  | "Productivity Tools";

export type StoreProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceInCents: number;
  currency: "usd";
  downloadPath: `/downloads/${string}.zip`;
  accent: string;
  badge: string;
};

export const storeProducts: StoreProduct[] = [
  {
    id: "movement-suite",
    name: "IMDM Movement Suite",
    category: "Movement Systems",
    description:
      "A movement-focused package for immersive projects, rapid prototyping, and interaction-heavy builds.",
    priceInCents: 1900,
    currency: "usd",
    downloadPath: "/downloads/movement.zip",
    accent:
      "from-cyan-400/20 via-sky-500/10 to-transparent",
    badge: "Best for movement",
  },
  {
    id: "prefab-kit",
    name: "IMDM Prefab Kit",
    category: "Prefabs",
    description:
      "A ready-to-drop prefab collection for faster scene setup, modular building, and polished test environments.",
    priceInCents: 2400,
    currency: "usd",
    downloadPath: "/downloads/prefab.zip",
    accent:
      "from-fuchsia-400/20 via-violet-500/10 to-transparent",
    badge: "Most flexible",
  },
];

export const categories = Array.from(
  new Set(storeProducts.map((product) => product.category)),
);

export function formatPrice(priceInCents: number, currency: StoreProduct["currency"]) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceInCents / 100);
}

export function getProductById(id: string | null | undefined) {
  return storeProducts.find((product) => product.id === id) ?? null;
}
