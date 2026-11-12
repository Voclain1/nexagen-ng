"use client";

import { useState } from "react";

/** Click-to-load YouTube embed: ~0 KB of third-party JS until the user presses play. */
export function LiteYouTube({ id, title, thumbnail, priority }: { id: string; title: string; thumbnail: string; priority?: boolean }) {
  const [active, setActive] = useState(false);
  if (active) return <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />;
  return <button type="button" className="video-facade" onClick={() => setActive(true)} aria-label={`Play video: ${title}`}>
    {/* eslint-disable-next-line @next/next/no-img-element -- remote thumbnail, intrinsic size unknown */}
    <img src={thumbnail} alt="" loading={priority ? "eager" : "lazy"} decoding="async" onError={(e) => { const img = e.currentTarget; if (!img.src.includes("hqdefault")) img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }} />
    <span className="video-play" aria-hidden="true">▶</span>
  </button>;
}
