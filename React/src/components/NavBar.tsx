import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loadSiteConfig, SiteConfig } from "@/lib/config/site";
import { Menu, X } from "lucide-react";

function NavBar() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadSiteConfig().then(setSite).catch(() => setSite(null));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = site?.nav ?? [
    { label: "About Us", path: "/about" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Surplus Calculator", path: "/calculator" },
    { label: "Resources", path: "/resources" },
    { label: "Contact Us", path: "/contact" }
  ];

  const isActive = (path: string) => {
    if (path === "/" || path === "/about") {
      return location.pathname === "/" || location.pathname === "/about";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft border-b border-border/40"
          : "bg-background border-b border-border/40"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5 text-foreground/80" aria-hidden="true" />
          </button>
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02]">
            {site?.logo ? (
              <img src={`/${site.logo}`} alt={site?.name} className="h-10 w-auto" />
            ) : null}
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-80 max-w-[85%] bg-background border-r border-border/50 shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {site?.logo ? (
                <img src={`/${site.logo}`} alt={site?.name} className="h-10 w-auto" />
              ) : null}
            </div>
            <button
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-all duration-200 active:scale-95"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5 text-foreground/80" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 block ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Plan your financial future with confidence.
            </p>
          </div>
        </aside>
      </div>
    </header>
  );
}

export default NavBar;


