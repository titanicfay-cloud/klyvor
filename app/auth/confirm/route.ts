
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const requestedNext = searchParams.get("next") ?? "/dashboard";

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL("/login?error=Invalid or expired link", request.url)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=Invalid or expired link", request.url)
    );
  }

  // Password recovery must always lead to the password reset page.
  if (type === "recovery") {
    const response = NextResponse.redirect(
      new URL("/reset-password", request.url)
    );

    response.cookies.set("klyvor_recovery_flow", "1", {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/reset-password",
      maxAge: 900,
    });

    return response;
  }

  // Only allow redirects to this application's own origin.
  const redirectUrl = new URL(request.url);
  const candidateUrl = new URL(requestedNext, request.url);

  if (candidateUrl.origin === redirectUrl.origin) {
    return NextResponse.redirect(candidateUrl);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
