import fs from "node:fs";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { checkAccess } from "@/lib/access";
import { getResource, resourceFilePath } from "@/lib/content";

const types: Record<string, string> = { ".pdf": "application/pdf", ".zip": "application/zip", ".md": "text/markdown; charset=utf-8", ".csv": "text/csv", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".fig": "application/octet-stream" };

/** Gated download: files live outside /public, so this check cannot be bypassed. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const access = await checkAccess(resource);
  if (access.status !== "open") return NextResponse.redirect(new URL(`/learn/resources/${slug}/`, request.url));
  if (resource.url) return NextResponse.redirect(resource.url);
  const file = resourceFilePath(resource)!;
  if (!fs.existsSync(file)) return NextResponse.json({ error: "File missing" }, { status: 404 });
  return new NextResponse(fs.readFileSync(file), { headers: { "Content-Type": types[path.extname(file)] ?? "application/octet-stream", "Content-Disposition": `attachment; filename="${path.basename(file)}"`, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
}
