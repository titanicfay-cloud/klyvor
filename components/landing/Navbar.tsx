import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0B1020]/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link href="/" className="flex items-center">
            {/* Removed fixed width/height attributes to let CSS handle the aspect ratio perfectly */}
            <Image 
              src="/logo.png" 
              alt="KLYVOR" 
              width={300} 
              height={80}
              className="object-contain w-auto h-14 md:h-16" 
              priority
            />
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="#platform" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">Platform</Link>
            <Link href="#solutions" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">Solutions</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">How It Works</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block text-muted-foreground hover:text-white transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="bg-klyvor-gradient text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
