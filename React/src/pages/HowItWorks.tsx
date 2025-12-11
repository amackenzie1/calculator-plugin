import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { Link } from "react-router-dom";
import { FileText, UserCog, Landmark, Receipt, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Gather Documents",
    description: "Collect your prior tax returns, statements, CPP/QPP, OAS, pensions, and other expected income sources.",
    details: ["Tax returns", "Investment statements", "Pension details", "Government benefits info"],
    color: "primary",
  },
  {
    number: "02",
    icon: UserCog,
    title: "Personal Information",
    description: "Enter your general information and investment risk profile, then add your income sources.",
    details: ["Age & retirement date", "Risk tolerance", "Income sources", "Spouse details (if applicable)"],
    color: "primary",
  },
  {
    number: "03",
    icon: Landmark,
    title: "Add Your Assets",
    description: "Input your registered and non-registered investments, insurance policies, and primary residence.",
    details: ["RRSPs & TFSAs", "Non-registered investments", "Life insurance", "Real estate"],
    color: "primary",
  },
  {
    number: "04",
    icon: Receipt,
    title: "Estimate Expenses",
    description: "Plan for retirement expenses, one-off costs, charitable donations, and your desired estate.",
    details: ["Living expenses", "Healthcare costs", "Travel & leisure", "Legacy planning"],
    color: "primary",
  },
  {
    number: "05",
    icon: Sparkles,
    title: "View Your Results",
    description: "See your Essential and Surplus Capital breakdown for complete clarity over your financial future.",
    details: ["Essential Capital", "Surplus Capital", "Year-by-year projections", "Export detailed reports"],
    color: "accent",
  },
];

function HowItWorks() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    loadBanners().then(b => setBanner(b.howItWorks)).catch(() => setBanner(null));
  }, []);

  return (
    <>
      {banner && <Banner image={banner.image} title={banner.title} subtitle={banner.subtitle} height="h-[28rem] md:h-[36rem]" />}

      <div className="container mx-auto px-6 max-w-5xl py-16 md:py-20">
        {/* Intro */}
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our calculator guides you through five simple steps to understand your complete financial picture.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-primary via-primary/50 to-accent" />

          <div className="space-y-6 md:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.number}
                  className="animate-fade-in-up relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="md:grid md:grid-cols-[80px_1fr] md:gap-8">
                    {/* Step number - desktop */}
                    <div className="hidden md:flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                          isLast
                            ? "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg"
                            : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                        }`}
                      >
                        {step.number}
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className={`group relative bg-card rounded-2xl border p-6 md:p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 ${
                        isLast ? "border-accent/30 bg-gradient-to-br from-accent/5 to-transparent" : "border-border/50"
                      } ${!isLast ? "md:mb-6" : ""}`}
                    >
                      {/* Mobile step number */}
                      <div className="md:hidden flex items-center gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                            isLast
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {step.number}
                        </div>
                        <div className="h-px flex-1 bg-border/50" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-start gap-5">
                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isLast
                              ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                          } group-hover:scale-110`}
                        >
                          <Icon className="w-7 h-7" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {step.description}
                          </p>

                          {/* Details tags */}
                          <div className="flex flex-wrap gap-2">
                            {step.details.map((detail) => (
                              <span
                                key={detail}
                                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                                  isLast
                                    ? "bg-accent/10 text-accent"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {detail}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/calculator">
                Start the Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Takes about 10-15 minutes
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default HowItWorks;


