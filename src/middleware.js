import { NextResponse } from "next/server";

export async function middleware(req) {
  const { nextUrl, cookies } = req;
  const { value: token } = cookies.get("next-auth.session-token") ?? {
    value: null,
  };

  if (!token && nextUrl.pathname !== "/signin") {
    return NextResponse.redirect(new URL("signin", req.url));
  } else if (token && nextUrl.pathname === "/signin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/signin", "/"] }; // Add the other protected pages here
