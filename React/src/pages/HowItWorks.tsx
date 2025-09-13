import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { FileText, UserCog, Box, Wallet, CheckCircle2 } from "lucide-react";

function HowItWorks() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    loadBanners().then(b => setBanner(b.howItWorks)).catch(() => setBanner(null));
  }, []);

  return (
    <>
      {banner && <Banner image={banner.image} title={banner.title} subtitle={banner.subtitle} height="h-[28rem] md:h-[36rem]" />}

      <div className="container mx-auto px-6 max-w-6xl py-12 space-y-12">
        <section className="space-y-6 text-muted-foreground">
          <div>
            <h2 className="section-title mb-2 inline-flex items-center gap-2"><FileText className="h-5 w-5 text-accent" aria-hidden="true" /> Step One</h2>
            <p>Gather relevant documents: prior tax returns, statements, CPP/QPP, OAS, pensions, and other expected income.</p>
          </div>
          <div>
            <h2 className="section-title mb-2 inline-flex items-center gap-2"><UserCog className="h-5 w-5 text-accent" aria-hidden="true" /> Step Two</h2>
            <p>Enter your general information and investment risk profile, then add income sources.</p>
          </div>
          <div>
            <h2 className="section-title mb-2 inline-flex items-center gap-2"><Box className="h-5 w-5 text-accent" aria-hidden="true" /> Step Three</h2>
            <p>Proceed to assets: registered and non-registered investments, insurance, and your primary residence.</p>
          </div>
          <div>
            <h2 className="section-title mb-2 inline-flex items-center gap-2"><Wallet className="h-5 w-5 text-accent" aria-hidden="true" /> Step Four</h2>
            <p>Estimate retirement expenses, one-off expenses, donations, and desired estate.</p>
          </div>
          <div>
            <h2 className="section-title mb-2 inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" /> Step Five</h2>
            <p>View Essential and Surplus Capital results for clarity over your financial future.</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default HowItWorks;


