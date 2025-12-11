import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { Info, Gift, UsersRound, ChevronRight, Anchor, ShieldCheck, Plane, PiggyBank, X } from "lucide-react";

type BoardMember = { name: string; photo: string; bio: string };

function About() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);
  const [board, setBoard] = useState<BoardMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

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

      <div className="container mx-auto px-6 max-w-6xl py-16 space-y-20">
        {/* Quote section */}
        <section className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-10 md:p-14 shadow-soft text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.12),_transparent_60%)]" aria-hidden="true" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mt-4">Guiding Principle</p>
          <blockquote className="mt-6 text-2xl md:text-4xl font-light text-foreground leading-relaxed">
            "He who knows he has enough is wealthy."
          </blockquote>
          <cite className="mt-6 block text-base text-muted-foreground font-medium">
            — Lao Tzu
          </cite>
        </section>

        {/* What We Do */}
        <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Info className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <h2 className="section-title">What We Do</h2>
          </div>
          <div className="pl-0 md:pl-[52px] space-y-4">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Use It Wisely is a non-profit organization created to help people understand their financial picture so they can make informed decisions regarding their future.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our Essential and Surplus Capital calculator allows you to simply and quickly determine how much capital you can set aside to maintain your standard of living (Essential) and the excess money (Surplus) you can spend on living a better and more fulfilling life.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Gift className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <h2 className="section-title">What We Offer</h2>
          </div>
          <div className="pl-0 md:pl-[52px]">
            <p className="text-muted-foreground leading-relaxed text-lg">
              Use It Wisely offers a retirement calculator, tools, worksheets, resources and hosts leading expert insights to help revolutionize the way Canadians experience retirement.
            </p>
          </div>
        </section>

        {/* Board of Directors */}
        <section className="space-y-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <UsersRound className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <h2 className="section-title">Board of Directors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {board.map((m, index) => (
              <button
                key={m.name}
                onClick={() => setSelectedMember(m)}
                className="group rounded-xl border border-border/50 p-6 bg-card shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center w-full cursor-pointer hover:border-primary/30"
                style={{ animationDelay: `${250 + index * 50}ms` }}
              >
                <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-border/30 group-hover:ring-primary/30 bg-muted transition-all duration-300">
                  <img src={`/${m.photo}`} alt={m.name} className="h-full w-full object-cover object-top" />
                </div>
                <div className="mt-5 font-semibold text-lg text-foreground">{m.name}</div>
                <div className="mt-2 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  View bio
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Bio Modal */}
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
              className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="h-24 w-24 shrink-0 rounded-full overflow-hidden ring-2 ring-primary/30 bg-muted">
                    <img src={`/${selectedMember.photo}`} alt={selectedMember.name} className="h-full w-full object-cover object-top" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-foreground">{selectedMember.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Board Member</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Retire Your Way */}
        <section className="space-y-8 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h2 className="section-title">Retire Your Way</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Anchor, title: "Clarity", desc: "Clarify your financial future today." },
              { icon: ShieldCheck, title: "Peace of Mind", desc: "Know where you stand now, and into the future." },
              { icon: Plane, title: "Explore What-Ifs", desc: "Start a business, a new career, or take a vacation!" },
              { icon: PiggyBank, title: "Income Protection", desc: "Calculate now, and pay less income tax during retirement." },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={title}
                className="feature-card"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                <div className="feature-icon mb-4">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
