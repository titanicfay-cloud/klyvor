
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();
  let isRecovery = type === "recovery";

  // Support Supabase's default email template.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL("/login?error=Invalid or expired link", request.url)
      );
    }

    isRecovery = requestedNext === "/reset-password";
  } else if (tokenHash && type) {
    // Also support token-hash email templates.
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (error) {
      return NextResponse.redirect(
        new URL("/login?error=Invalid or expired link", request.url)
      );
    }
  } else {
    return NextResponse.redirect(
      new URL("/login?error=Invalid or expired link", request.url)
    );
  }

  if (isRecovery) {
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

  const redirectUrl = new URL(request.url);
  const candidateUrl = new URL(requestedNext, request.url);

  if (candidateUrl.origin === redirectUrl.origin) {
    return NextResponse.redirect(candidateUrl);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
      }
