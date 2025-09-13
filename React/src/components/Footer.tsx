import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadSiteConfig, SiteConfig } from "@/lib/config/site";
import { loadResources, Resource } from "@/lib/config/resources";
import { ChevronRight } from "lucide-react";

function Footer() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [recent, setRecent] = useState<Resource[]>([]);

  useEffect(() => {
    loadSiteConfig().then(setSite).catch(() => setSite(null));
    loadResources()
      .then(({ resources }) => {
        const sorted = [...resources].sort((a, b) => (a.date < b.date ? 1 : -1));
        setRecent(sorted.slice(0, 3));
      })
      .catch(() => setRecent([]));
  }, []);

  return (
    <footer className="mt-20 border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {site?.logo ? (
              <img src={`/${site.logo}`} alt={site?.name} className="h-10 w-auto opacity-80" />
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed mt-3">{site?.footer.about}</p>
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-4">Quick Links</h3>
          <nav className="flex flex-col gap-3 text-sm">
            {site?.footer.links.map((l) => (
              <Link key={l.path} to={l.path} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-accent" aria-hidden="true" /> {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="font-medium text-foreground mb-4">Recent Resources</h3>
          <div className="space-y-4">
            {recent.map((r) => (
              <Link key={r.id} to={`/resources/${r.id}`} className="flex items-center gap-3 group">
                {r.authorImage ? (
                  <img src={`/${r.authorImage}`} alt={r.author} className="h-10 w-10 rounded-full object-cover ring-2 ring-border/50 group-hover:ring-primary/30 transition-all" />
                ) : null}
                <div>
                  <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</div>
                  <div className="text-sm group-hover:text-foreground transition-colors">{r.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-6">
        <div className="container mx-auto px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site?.name ?? "Use It Wisely"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;


