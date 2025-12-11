import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadSiteConfig, SiteConfig } from "@/lib/config/site";

function Footer() {
  const [site, setSite] = useState<SiteConfig | null>(null);

  useEffect(() => {
    loadSiteConfig().then(setSite).catch(() => setSite(null));
  }, []);

  const links = site?.footer.links ?? [
    { label: "About", path: "/about" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Calculator", path: "/calculator" },
    { label: "Resources", path: "/resources" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="mt-16 border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-4">
            {site?.logo ? (
              <img src={`/${site.logo}`} alt={site?.name} className="h-9 w-auto opacity-90" />
            ) : null}
            <div className="h-6 w-px bg-border/50 hidden md:block" />
            <p className="text-sm text-muted-foreground hidden md:block">
              Helping Canadians plan their financial future.
            </p>
          </div>

          {/* Nav links - horizontal */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-6 pt-6 border-t border-border/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground/70">
          <p>© {new Date().getFullYear()} {site?.name ?? "Use It Wisely"}. All rights reserved.</p>
          <p>A non-profit helping retirees maximize their happiness.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


