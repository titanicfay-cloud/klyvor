
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checkingSession, setCheckingSession] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const checkRecoverySession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      setValidSession(!error && !!data.user);
      setCheckingSession(false);
    };

    checkRecoverySession();

    return () => {
      active = false;
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 1800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#00D4FF]" />
        <p className="text-sm text-[#AAB7CC]">
          Verifying your recovery link...
        </p>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <LockKeyhole className="h-8 w-8 text-amber-400" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Link unavailable
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-[#C7D0E0]">
          This recovery link may have expired or already been used.
          Request a new password recovery link to continue.
        </p>

        <Link
          href="/forgot-password"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-klyvor-gradient px-5 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Request a new recovery link
        </Link>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#AAB7CC] transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
          <CheckCircle2 className="h-9 w-9 text-emerald-400" />
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Password updated.
        </h1>

        <p className="text-sm leading-relaxed text-[#C7D0E0]">
          Your KLYVOR password has been changed successfully.
          Taking you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00D4FF]/20 bg-[#00D4FF]/10">
          <LockKeyhole className="h-7 w-7 text-[#00D4FF]" />
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
          Set a new password.
        </h1>

        <p className="text-sm leading-relaxed text-[#C7D0E0]">
          Choose a strong password to secure your KLYVOR account.
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
          <Label htmlFor="new-password" className="text-sm text-white">
            New password
          </Label>

          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-[#27344B] bg-[#0B1020] pr-11 text-white placeholder:text-[#64748B]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="confirm-password" className="text-sm text-white">
            Confirm new password
          </Label>

          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your new password again"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 border-[#27344B] bg-[#0B1020] pr-11 text-white placeholder:text-[#64748B]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#8290A8]">
          Use at least 8 characters. Make it unique to your KLYVOR account.
        </p>

        <Button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="h-11 w-full bg-klyvor-gradient text-base font-semibold text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Updating password...
            </>
          ) : (
            "Update password"
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
          
