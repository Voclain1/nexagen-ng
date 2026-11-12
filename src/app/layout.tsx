import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JsonLd } from "@/components/seo";
import { Footer, Header } from "@/components/site-shell";
import { siteConfig } from "@/lib/config";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./site.css";
import "./home.css";
import "./pages.css";
import "./work.css";
import "./content.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Nexagen — Websites and Digital Platforms for Nigerian Businesses", template: "%s | Nexagen" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: { siteName: siteConfig.name, type: "website", locale: siteConfig.locale },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": [{ url: "/insights/feed.xml", title: "Nexagen Insights" }] } },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION, other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-NG"><body className={inter.variable}>
    <a href="#main" className="skip-link">Skip to content</a>
    <JsonLd data={[organizationSchema(), websiteSchema()]} />
    <Header /><main id="main">{children}</main><Footer />
  </body></html>;
}
