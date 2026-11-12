import { ImageResponse } from "next/og";

/** Favicon (the live site returned 404 for /favicon.ico). */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111410", borderRadius: 14, color: "#d8ff25", fontSize: 44, fontWeight: 900 }}>N</div>, size);
}
