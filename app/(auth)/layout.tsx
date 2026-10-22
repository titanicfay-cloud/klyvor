import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0B1020]">
      
      {/* Left Side: Branding & Orbital Geometry */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden border-r border-[#27344B]">
        
        {/* Sophisticated Orbital Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-40">
          {/* Subtle core glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
          {/* Orbital Rings */}
          <div className="absolute inset-0 border border-primary/20 rounded-full transform rotate-45 scale-100"></div>
          <div className="absolute inset-8 border border-secondary/20 rounded-full transform -rotate-12 scale-95"></div>
          <div className="absolute inset-20 border border-primary/10 rounded-full transform rotate-90 scale-90"></div>
          {/* Orbital dots */}
          <div className="absolute top-[15%] left-[15%] w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#00D4FF]"></div>
          <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_#7C5CFC]"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo.png" alt="KLYVOR" width={260} height={80} className="object-contain w-auto h-16 md:h-20" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
            Your next chapter <br /> starts here.
          </h1>
          <p className="text-lg text-[#C7D0E0] leading-relaxed">
            Bring your work, ideas, and ambitions together in one connected workspace. Create your account and discover what's possible with KLYVOR.
          </p>
        </div>

        <div className="relative z-10 text-sm text-[#64748B]">
          © {new Date().getFullYear()} KLYVOR. Beyond What's Possible.
        </div>
      </div>

      {/* Right Side: The Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-24 py-12 relative z-10">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-12 flex justify-center">
          <Link href="/">
             <Image src="/logo.png" alt="KLYVOR" width={200} height={60} className="object-contain w-auto h-12" />
          </Link>
        </div>
        
        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>

    </div>
  );
}
