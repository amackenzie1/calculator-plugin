export type NavItem = { label: string; path: string };

export type SiteConfig = {
  logo: string;
  name: string;
  nav: NavItem[];
  footer: {
    about: string;
    links: NavItem[];
  };
};

export async function loadSiteConfig(): Promise<SiteConfig> {
  const res = await fetch("/config/site.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load site config");
  return res.json();
}


