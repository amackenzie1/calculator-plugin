import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { Info, Gift, UsersRound, ChevronRight, Linkedin } from "lucide-react";

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
                <div className="mt-3 flex items-center gap-3">
                  <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="section-title inline-flex items-center gap-2"><ChevronRight className="h-5 w-5 text-accent" aria-hidden="true" /> Retire Your Way</h2>
          <ul className="pl-0 text-muted-foreground space-y-2">
            <li className="flex items-start gap-2"><ChevronRight className="mt-1 h-4 w-4 text-accent" aria-hidden="true" /> Clarify your financial future today.</li>
            <li className="flex items-start gap-2"><ChevronRight className="mt-1 h-4 w-4 text-accent" aria-hidden="true" /> Peace Of Mind: Know where you stand now, and into the future.</li>
            <li className="flex items-start gap-2"><ChevronRight className="mt-1 h-4 w-4 text-accent" aria-hidden="true" /> Examine ‘what-ifs’: Start a business, a new career, or take a vacation!</li>
            <li className="flex items-start gap-2"><ChevronRight className="mt-1 h-4 w-4 text-accent" aria-hidden="true" /> Income Protection: Calculate now, and pay less income tax during retirement.</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default About;


