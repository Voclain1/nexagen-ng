import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Branded social card used by every opengraph-image route. */
export function renderOg({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#111410", color: "#fff", padding: "64px 72px", fontFamily: "sans-serif", backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#d8ff25", fontWeight: 700 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: "#d8ff25" }} />{eyebrow}
      </div>
      <div style={{ display: "flex", fontSize: title.length > 70 ? 58 : 70, lineHeight: 1.05, letterSpacing: -2, fontWeight: 700, maxWidth: 1000 }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#aaa", borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 24 }}>
        <span style={{ color: "#fff", fontWeight: 700 }}>NEXAGEN</span><span>{footer ?? "nexagen.ng"}</span>
      </div>
    </div>,
    ogSize,
  );
}
