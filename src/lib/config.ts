/** Site-wide constants. Anything that changes per environment comes from env vars. */
export const siteConfig = {
  name: "Nexagen",
  legalName: "Nexagen Digital",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexagen.ng").replace(/\/$/, ""),
  description: "Nexagen designs high-performing websites, e-commerce stores and custom digital platforms for ambitious Nigerian businesses.",
  locale: "en_NG",
  logo: "/nexagen-logo.png",
  email: { enquiry: "hello@nexagen.ng", hello: "hello@nexagen.ng" },
  phone: "+2349067084003",
  phoneDisplay: "+234 906 708 4003",
  whatsapp: "https://wa.me/2349067084003",
  sameAs: [] as string[], // add LinkedIn, Instagram, YouTube, Google Business Profile URLs as they go live
  address: { locality: "Lagos", region: "Lagos", country: "NG" },
} as const;

export const absoluteUrl = (path = "/") => (path.startsWith("http") ? path : `${siteConfig.url}${path.startsWith("/") ? "" : "/"}${path}`);

export const isProduction = process.env.NODE_ENV === "production";
