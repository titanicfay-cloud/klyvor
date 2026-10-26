"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0B1020]/80 backdrop-blur-md border-b border-[#27344B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="KLYVOR" width={220} height={70} className="object-contain w-auto h-16 md:h-20" priority />
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[#C7D0E0] hover:text-white transition-colors text-sm font-medium">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block text-[#C7D0E0] hover:text-white transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="bg-klyvor-gradient text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
              Get Started
            </Link>
            
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger className="p-2 text-white">
                  <Menu size={24} />
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0B1020] border-[#27344B] w-64 pt-12 flex flex-col">
                  <nav className="flex flex-col space-y-6 px-4">
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-white text-lg font-medium hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    ))}
                    <div className="pt-6 border-t border-[#27344B]">
                      <Link href="/login" onClick={() => setIsOpen(false)} className="text-[#C7D0E0] hover:text-white block mb-4">Sign In</Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
