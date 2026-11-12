import { renderOg, ogSize } from "@/lib/og";

export const alt = "Nexagen — websites and digital platforms for Nigerian businesses";
export const size = ogSize;
export const contentType = "image/png";
export default function Image() { return renderOg({ eyebrow: "Made in Nigeria", title: "Build your next big move.", footer: "Websites · Platforms · SEO · nexagen.ng" }); }
