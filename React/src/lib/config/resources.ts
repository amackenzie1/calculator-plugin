export type Resource = {
  id: string;
  tag: string;
  title: string;
  date: string;
  author: string;
  authorImage: string;
  coverPhoto: string;
  excerpt: string;
  content: string;
  image: string;
};

export type ResourcesConfig = {
  resources: Resource[];
};

export async function loadResources(): Promise<ResourcesConfig> {
  const res = await fetch("/config/resources.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load resources");
  return res.json();
}

export async function loadResourceById(id: string): Promise<Resource | undefined> {
  const { resources } = await loadResources();
  return resources.find(r => r.id === id);
}


