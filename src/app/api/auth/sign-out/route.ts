import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/learn/", request.url), 303);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
