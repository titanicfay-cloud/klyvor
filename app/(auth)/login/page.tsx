"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("The email or password is incorrect.");
      setLoading(false);
      return;
    }

    // If successful, push to the protected dashboard
    router.push("/dashboard");
    router.refresh(); // Refresh to ensure middleware picks up the new session
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back.</h1>
        <p className="text-[#C7D0E0] text-sm">Your work, ideas, and plans are waiting. Sign in to continue where you left off.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg mb-6 animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white text-sm">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
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

        <Button 
          type="submit" 
          className="w-full bg-klyvor-gradient text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020] transition-all h-11 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-4" 
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing you in...</>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="mt-10 text-center text-sm text-[#C7D0E0]">
        New to KLYVOR?{" "}
        <Link href="/signup" className="text-white hover:text-primary transition-colors font-semibold">
          Create an account
        </Link>
      </div>
    </div>
  );
}
