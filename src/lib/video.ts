import "server-only";
import crypto from "node:crypto";
import type { VideoSource } from "./content";

/**
 * Turns a video source from content frontmatter into something a browser can play.
 *
 *  - youtube: public. Best for discovery (YouTube search + Google video results).
 *  - mux:     set `signed: true` for paid lessons. Requires MUX_SIGNING_KEY_ID and
 *             MUX_SIGNING_PRIVATE_KEY (base64-encoded PEM) so playback tokens expire.
 *  - bunny:   Bunny Stream. Set BUNNY_STREAM_LIBRARY_ID; with BUNNY_STREAM_TOKEN_KEY
 *             every embed URL is token-authenticated and expires.
 *  - file:    a direct MP4/WebM URL (e.g. /videos/intro.mp4 or a CDN URL).
 *
 * Signed URLs are only generated on the server, after an access check, so a
 * locked lesson never ships a playable URL to the browser.
 */

export type Playback =
  | { type: "youtube"; id: string; thumbnail: string }
  | { type: "iframe"; src: string; thumbnail?: string }
  | { type: "file"; src: string; thumbnail?: string }
  | { type: "unavailable"; reason: string };

const TOKEN_TTL_SECONDS = 60 * 60 * 6;
const b64url = (input: Buffer | string) => Buffer.from(input).toString("base64url");

function muxToken(playbackId: string, audience: "v" | "t") {
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const privateKey = process.env.MUX_SIGNING_PRIVATE_KEY;
  if (!keyId || !privateKey) return null;
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: keyId }));
  const payload = b64url(JSON.stringify({ sub: playbackId, aud: audience, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS, kid: keyId }));
  const signature = crypto.createSign("RSA-SHA256").update(`${header}.${payload}`).sign(Buffer.from(privateKey, "base64").toString("utf8"));
  return `${header}.${payload}.${b64url(signature)}`;
}

export function thumbnailFor(source: VideoSource): string | undefined {
  if (source.thumbnail) return source.thumbnail;
  if (source.provider === "youtube") return `https://i.ytimg.com/vi/${source.id}/maxresdefault.jpg`;
  if (source.provider === "mux" && !source.signed) return `https://image.mux.com/${source.id}/thumbnail.webp?width=1280`;
  return undefined;
}

export function resolvePlayback(source: VideoSource, title: string): Playback {
  const thumbnail = thumbnailFor(source);
  switch (source.provider) {
    case "youtube":
      return { type: "youtube", id: source.id, thumbnail: thumbnail! };
    case "file":
      return { type: "file", src: source.id, thumbnail };
    case "mux": {
      if (!source.signed) return { type: "iframe", src: `https://player.mux.com/${source.id}?metadata-video-title=${encodeURIComponent(title)}`, thumbnail };
      const token = muxToken(source.id, "v");
      if (!token) return { type: "unavailable", reason: "Signed Mux playback is not configured (MUX_SIGNING_KEY_ID / MUX_SIGNING_PRIVATE_KEY)." };
      return { type: "iframe", src: `https://player.mux.com/${source.id}?playback-token=${token}&thumbnail-token=${muxToken(source.id, "t")}&metadata-video-title=${encodeURIComponent(title)}` };
    }
    case "bunny": {
      const library = process.env.BUNNY_STREAM_LIBRARY_ID;
      if (!library) return { type: "unavailable", reason: "Bunny Stream is not configured (BUNNY_STREAM_LIBRARY_ID)." };
      const base = `https://iframe.mediadelivery.net/embed/${library}/${source.id}?preload=false&responsive=true`;
      const key = process.env.BUNNY_STREAM_TOKEN_KEY;
      if (!key) return { type: "iframe", src: base, thumbnail };
      const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
      const token = crypto.createHash("sha256").update(key + source.id + expires).digest("hex");
      return { type: "iframe", src: `${base}&token=${token}&expires=${expires}`, thumbnail };
    }
  }
}

/** Public URL used in VideoObject structured data (embedUrl). Never includes tokens. */
export function publicEmbedUrl(source: VideoSource): string | undefined {
  if (source.signed) return undefined;
  if (source.provider === "youtube") return `https://www.youtube.com/embed/${source.id}`;
  if (source.provider === "mux") return `https://player.mux.com/${source.id}`;
  return undefined;
}
