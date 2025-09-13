import React, { useEffect, useState } from "react";
import { loadBanners } from "@/lib/config/banners";
import Banner from "@/components/Banner";
import { loadContact } from "@/lib/config/contact";
import { Mail, MapPin } from "lucide-react";

function Contact() {
  const [banner, setBanner] = useState<{ image: string; title: string; subtitle?: string } | null>(null);
  const [contact, setContact] = useState<{ email: string; addressLine1: string; addressLine2?: string } | null>(null);

  useEffect(() => {
    loadBanners().then(b => setBanner(b.contact)).catch(() => setBanner(null));
    loadContact().then(setContact).catch(() => setContact(null));
  }, []);

  return (
    <>
      {banner && <Banner image={banner.image} title={banner.title} subtitle={banner.subtitle} height="h-[28rem] md:h-[36rem]" />}

      <div className="container mx-auto px-6 max-w-6xl py-12 space-y-12">
        <div className="rounded-lg border bg-background p-6">
          <h2 className="text-xl font-semibold">Get in touch</h2>
          <div className="mt-2 text-muted-foreground space-y-2">
            <div className="inline-flex items-center gap-2"><Mail className="h-4 w-4" aria-hidden="true" /> {contact?.email}</div>
            <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" /> {contact?.addressLine1}</div>
            {contact?.addressLine2 && <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" /> {contact.addressLine2}</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;


