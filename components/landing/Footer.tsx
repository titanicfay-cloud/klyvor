import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <span className="text-white font-bold text-2xl tracking-widest block mb-2">KLYVOR</span>
            <span className="text-klyvor-gradient font-medium text-sm block mb-4">Beyond What's Possible.</span>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">A connected professional platform for organising work, managing information and moving forward with clarity.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Product</h3>
            <ul className="space-y-3">
              {/* FIXED: Pointed to actual routes */}
              <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">Platform Overview</Link></li>
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/signup" className="text-muted-foreground hover:text-primary text-sm transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About KLYVOR</Link></li>
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary text-sm transition-colors">The Workflow</Link></li>
              <li><Link href="/help" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© {currentYear} KLYVOR. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/login" className="text-muted-foreground hover:text-white text-sm transition-colors">Sign In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
