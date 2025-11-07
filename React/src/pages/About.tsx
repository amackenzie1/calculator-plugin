import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { Info, Gift, UsersRound, ChevronRight, Linkedin, Anchor, ShieldCheck, Plane, PiggyBank } from "lucide-react";

function About() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);
  const [board, setBoard] = useState<Array<{ name: string; photo: string; bio: string }>>([]);

  useEffect(() => {
    loadBanners().then(b => setBanner(b.about)).catch(() => setBanner(null));
    fetch("/config/board.json", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setBoard(d.members || []))
      .catch(() => setBoard([]));
  }, []);

  return (
    <>
      {banner && <Banner image={banner.image} title={banner.title} subtitle={banner.subtitle} height="h-[28rem] md:h-[36rem]" />}

      <div className="container mx-auto px-6 max-w-6xl py-12 space-y-16">
        <section className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/20 p-8 md:p-12 shadow-md text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_55%)] opacity-70" aria-hidden="true" />
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/90">Guiding Principle</p>
          <blockquote className="mt-4 text-2xl md:text-3xl font-light text-foreground">
            "He who knows he has enough is wealthy."
          </blockquote>
          <cite className="mt-4 block text-base text-muted-foreground">
            - Lao Tzu
          </cite>
        </section>

        <section className="space-y-6">
          <h2 className="section-title inline-flex items-center gap-2"><Info className="h-5 w-5 text-accent" aria-hidden="true" /> What We Do</h2>
          <p className="text-muted-foreground leading-relaxed">
            Use It Wisely is a non-profit organization created to help people understand their financial picture so they can make informed decisions regarding their future.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our Essential and Surplus Capital calculator allows you to simply and quickly determine how much capital you can set aside to maintain your standard of living (Essential) and the excess money (Surplus) you can spend on living a better and more fulfilling life.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="section-title inline-flex items-center gap-2"><Gift className="h-5 w-5 text-accent" aria-hidden="true" /> What We Offer</h2>
          <p className="text-muted-foreground leading-relaxed">
            Use It Wisely offers a retirement calculator, tools, worksheets, resources and hosts leading expert insights to help revolutionize the way Canadians experience retirement.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="section-title inline-flex items-center gap-2"><UsersRound className="h-5 w-5 text-accent" aria-hidden="true" /> Board of Directors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {board.map((m) => (
              <div key={m.name} className="rounded-lg border border-border/50 p-6 bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <div className="h-38 w-38 rounded-full overflow-hidden ring-1 ring-border/50 bg-muted">
                  <img src={`/${m.photo}`} alt={m.name} className="h-full w-full object-cover object-top" />
                </div>
                <div className="mt-4 font-medium text-lg">{m.name}</div>
                <details className="mt-2 text-sm text-muted-foreground max-w-prose">
                  <summary className="cursor-pointer font-medium hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" aria-hidden="true" /> View Bio
                  </summary>
                  <div className="mt-3 leading-relaxed">{m.bio}</div>
                </details>

              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="section-title inline-flex items-center gap-2"><ChevronRight className="h-5 w-5 text-accent" aria-hidden="true" /> Retire Your Way</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Anchor className="h-5 w-5 text-accent" aria-hidden="true" />
                <div className="font-medium">Clarity</div>
              </div>
              <div className="text-sm text-muted-foreground">Clarify your financial future today.</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                <div className="font-medium">Peace of Mind</div>
              </div>
              <div className="text-sm text-muted-foreground">Know where you stand now, and into the future.</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <Plane className="h-5 w-5 text-accent" aria-hidden="true" />
                <div className="font-medium">Explore What-Ifs</div>
              </div>
              <div className="text-sm text-muted-foreground">Start a business, a new career, or take a vacation!</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <PiggyBank className="h-5 w-5 text-accent" aria-hidden="true" />
                <div className="font-medium">Income Protection</div>
              </div>
              <div className="text-sm text-muted-foreground">Calculate now, and pay less income tax during retirement.</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
