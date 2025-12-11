import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { loadContact } from "@/lib/config/contact";
import { Mail, MapPin, ExternalLink } from "lucide-react";

function Contact() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);
  const [contact, setContact] = useState<{ email: string; addressLine1: string; addressLine2?: string } | null>(null);

  useEffect(() => {
    loadBanners().then(b => setBanner(b.contact)).catch(() => setBanner(null));
    loadContact().then(setContact).catch(() => setContact(null));
  }, []);

  const fullAddress = contact ? `${contact.addressLine1}, ${contact.addressLine2}` : "";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <>
      {banner && <Banner image={banner.image} title={banner.title} subtitle={banner.subtitle} height="h-[28rem] md:h-[36rem]" />}

      <div className="container mx-auto px-6 max-w-4xl py-16">
        {/* Get in Touch Card */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 md:px-8 py-6 border-b border-border/30">
            <h2 className="text-2xl font-semibold text-foreground">Get in Touch</h2>
            <p className="text-sm text-muted-foreground mt-1">We'd love to hear from you</p>
          </div>

          {/* Contact Info */}
          <div className="p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Email */}
              <a
                href={`mailto:${contact?.email}`}
                className="group flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</div>
                  <div className="text-foreground font-medium group-hover:text-primary transition-colors">
                    {contact?.email}
                  </div>
                </div>
              </a>

              {/* Address */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <MapPin className="w-5 h-5 text-accent group-hover:text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                    Address
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="text-foreground font-medium group-hover:text-primary transition-colors">
                    {contact?.addressLine1}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contact?.addressLine2}
                  </div>
                </div>
              </a>
            </div>

            {/* Additional note */}
            <div className="mt-8 pt-6 border-t border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                Have questions about the calculator or our mission? Drop us a line and we'll get back to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;


