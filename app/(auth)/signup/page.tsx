"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-5 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Check your inbox</h2>
        <p className="text-[#C7D0E0] text-sm leading-relaxed">
          We've sent a confirmation link to <span className="text-white font-medium">{email}</span>. Please verify your email to continue.
        </p>
        <Link href="/login" className="inline-block mt-6 text-primary hover:text-white transition-colors text-sm font-semibold">
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create your KLYVOR account.</h1>
        <p className="text-[#C7D0E0] text-sm">Your workspace starts with a few simple details.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg mb-6 animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="fullName" className="text-white text-sm">Full name</Label>
          <Input 
            id="fullName" 
            type="text" 
            placeholder="Jane Doe" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-white text-sm">Email address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="jane@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="password" className="text-white text-sm">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11 pr-10"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="confirmPassword" className="text-white text-sm">Confirm password</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#0B1020] border-[#27344B] text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary h-11 pr-10"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="mt-0.5 border-[#27344B] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="terms" className="text-sm text-[#C7D0E0] leading-relaxed cursor-pointer">
              I agree to the <Link href="/terms" className="text-primary hover:text-white transition-colors hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-white transition-colors hover:underline">Privacy Policy</Link>.
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-klyvor-gradient text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020] transition-all h-11 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-4" 
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating your account...</>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="mt-10 text-center text-sm text-[#C7D0E0]">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:text-primary transition-colors font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
}
