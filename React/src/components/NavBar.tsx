import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadSiteConfig, SiteConfig } from "@/lib/config/site";
import { Menu, X } from "lucide-react";

function NavBar() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadSiteConfig().then(setSite).catch(() => setSite(null));
  }, []);

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted transition-colors"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5 text-foreground/80" aria-hidden="true" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            {site?.logo ? (
              <img src={`/${site.logo}`} alt={site?.name} className="h-10 w-auto" />
            ) : null}
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {(site?.nav ?? [
            { label: "About Us", path: "/about" },
            { label: "How It Works", path: "/how-it-works" },
            { label: "Surplus Calculator", path: "/calculator" },
            { label: "Resources", path: "/resources" },
            { label: "Contact Us", path: "/contact" }
          ]).map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 px-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[80%] bg-background border-r shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {site?.logo ? (
                  <img src={`/${site.logo}`} alt={site?.name} className="h-10 w-auto" />
                ) : null}
              </div>
              <button
                className="inline-flex items-center justify-center w-10 h-10 rounded"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5 text-foreground/80" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {(site?.nav ?? [
                { label: "About Us", path: "/about" },
                { label: "How It Works", path: "/how-it-works" },
                { label: "Surplus Calculator", path: "/calculator" },
                { label: "Resources", path: "/resources" },
                { label: "Contact Us", path: "/contact" }
              ]).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium text-foreground hover:bg-muted rounded px-2 transition-colors block"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}

export default NavBar;


