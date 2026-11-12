import type { VideoSource } from "@/lib/content";
import { resolvePlayback } from "@/lib/video";
import { LiteYouTube } from "./lite-youtube";

/**
 * Server component: resolves (and signs, where needed) the playback URL, then renders
 * the lightest possible player. YouTube uses a click-to-load facade so videos never
 * cost Core Web Vitals until someone actually presses play.
 */
export function VideoPlayer({ source, title, priority = false }: { source: VideoSource; title: string; priority?: boolean }) {
  const playback = resolvePlayback(source, title);
  return <div className="video-frame">
    {playback.type === "youtube" && <LiteYouTube id={playback.id} title={title} thumbnail={playback.thumbnail} priority={priority} />}
    {playback.type === "iframe" && <iframe src={playback.src} title={title} loading={priority ? "eager" : "lazy"} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />}
    {playback.type === "file" && <video src={playback.src} poster={playback.thumbnail} controls preload="none" playsInline />}
    {playback.type === "unavailable" && <div className="video-unavailable"><strong>Video unavailable</strong><span>{playback.reason}</span></div>}
  </div>;
}
