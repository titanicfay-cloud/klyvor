
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/confirm?next=/reset-password`;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo,
        });

      if (resetError) {
        setError("We couldn't process your request right now. Please try again shortly.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="animate-in fade-in duration-500 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00D4FF]/20 bg-[#00D4FF]/10">
          <Mail className="h-8 w-8 text-[#00D4FF]" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Check your inbox.
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-[#C7D0E0]">
          If an account exists for{" "}
          <span className="font-semibold text-white">{email}</span>,
          you'll receive a password recovery link shortly.
        </p>

        <div className="mb-8 rounded-xl border border-[#27344B] bg-[#111A2E] p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00D4FF]" />
            <p className="text-xs leading-relaxed text-[#AAB7CC]">
              For security, we don't disclose whether an email address is
              registered with KLYVOR. Check your spam folder if the message
              doesn't arrive.
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D4FF] transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00D4FF]/20 bg-[#00D4FF]/10">
          <Mail className="h-7 w-7 text-[#00D4FF]" />
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
          Forgot your password?
        </h1>

        <p className="text-sm leading-relaxed text-[#C7D0E0]">
          It happens. Enter the email address associated with your KLYVOR
          account and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="recovery-email" className="text-sm text-white">
            Email address
          </Label>

          <Input
            id="recovery-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-[#27344B] bg-[#0B1020] text-white placeholder:text-[#64748B]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !email.trim()}
          className="h-11 w-full bg-klyvor-gradient text-base font-semibold text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending recovery link...
            </>
          ) : (
            "Send recovery link"
          )}
        </Button>
      </form>

      <div className="mt-10 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C7D0E0] transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
  }
            
