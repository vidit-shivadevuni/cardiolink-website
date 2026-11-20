import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, verifyCredentials } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  let token: string;
  try {
    const account = verifyCredentials(email, password);
    if (!account) {
      return NextResponse.json({ error: "That email and password don't match an account." }, { status: 401 });
    }
    token = createSessionToken(account);
  } catch (error) {
    console.error("Sign-in failed", error);
    return NextResponse.json({ error: "Sign-in isn't available right now. Please try again later." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
