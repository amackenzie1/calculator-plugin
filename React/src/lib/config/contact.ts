export type ContactConfig = {
  email: string;
  addressLine1: string;
  addressLine2?: string;
};

export async function loadContact(): Promise<ContactConfig> {
  const res = await fetch("/config/contact.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load contact config");
  return res.json();
}


