import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifyLoginToken } from "@/lib/auth";

/** Magic-link landing: validates the signed token, sets the session cookie, redirects on. */
export function GET(request: NextRequest) {
  const payload = verifyLoginToken(request.nextUrl.searchParams.get("token") ?? undefined);
  if (!payload) return NextResponse.redirect(new URL("/account/sign-in/?error=expired", request.url));
  const response = NextResponse.redirect(new URL(payload.next ?? "/account/", request.url));
  const cookie = sessionCookie(payload.email);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
