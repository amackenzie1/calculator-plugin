import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { loadResources, Resource } from "@/lib/config/resources";
import { Tag, CalendarDays, User as UserIcon } from "lucide-react";

function Resources() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    loadBanners().then(b => setBanner(b.resources)).catch(() => setBanner(null));
    loadResources().then(d => setResources(d.resources)).catch(() => setResources([]));
  }, []);

  return (
    <>
      {banner && <Banner image={banner.image} title={banner.title} subtitle={banner.subtitle} height="h-[28rem] md:h-[36rem]" />}

      <div className="container mx-auto px-6 max-w-6xl py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((r) => (
            <Link key={r.id} to={`/resources/${r.id}`} className="rounded-lg border bg-background overflow-hidden">
              <img src={`/${r.coverPhoto}`} alt={r.title} className="w-full h-40 object-cover" />
              <div className="p-4 space-y-1">
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" aria-hidden="true" /> {r.tag}</div>
                <div className="font-semibold text-primary">{r.title}</div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {new Date(r.date).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" aria-hidden="true" /> {r.author}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Resources;


