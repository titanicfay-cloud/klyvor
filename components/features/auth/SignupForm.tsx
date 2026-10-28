"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupForm() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!termsAccepted) return setError("You must accept the Terms.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (signUpError) { setError(signUpError.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  };

  if (success) {
    return (
      <div className="text-center space-y-5 animate-in fade-in">
        <h2 className="text-2xl font-bold text-white">Check your inbox</h2>
        <p className="text-[#C7D0E0] text-sm">We've sent a confirmation link to <span className="text-white font-medium">{email}</span>.</p>
        <Link href="/login" className="inline-block mt-6 text-primary hover:text-white text-sm font-semibold">Return to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create your KLYVOR account.</h1>
        <p className="text-[#C7D0E0] text-sm">Your workspace starts with a few simple details.</p>
      </div>
      {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg mb-6">{error}</div>}
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-2"><Label className="text-white text-sm">Full name</Label><Input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white h-11" /></div>
        <div className="space-y-2"><Label className="text-white text-sm">Email address</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white h-11" /></div>
        <div className="space-y-2">
          <Label className="text-white text-sm">Password</Label>
          <div className="relative">
            <Input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white h-11 pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </div>
        <div className="space-y-2"><Label className="text-white text-sm">Confirm password</Label><Input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-[#0B1020] border-[#27344B] text-white h-11" /></div>
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} className="mt-1" />
          <label className="text-sm text-[#C7D0E0] leading-relaxed">I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</label>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-klyvor-gradient text-white h-11 text-base font-semibold">
          {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...</> : "Create account"}
        </Button>
      </form>
      <div className="mt-8 text-center text-sm text-[#C7D0E0]">Already have an account? <Link href="/login" className="text-white hover:text-primary font-semibold">Sign in</Link></div>
    </div>
  );
}
