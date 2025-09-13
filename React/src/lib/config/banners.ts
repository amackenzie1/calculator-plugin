export type Banner = {
  image: string;
  title: string;
  subtitle?: string;
};

export type BannersConfig = {
  about: Banner;
  howItWorks: Banner;
  resources: Banner;
  contact: Banner;
};

export async function loadBanners(): Promise<BannersConfig> {
  const res = await fetch("/config/banners.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load banners config");
  return res.json();
}


