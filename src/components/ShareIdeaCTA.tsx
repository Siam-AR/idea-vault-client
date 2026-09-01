import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaLightbulb } from "react-icons/fa";

export default function ShareIdeaCTA() {
  return (
    <section className="w-full bg-gradient-to-r from-[var(--brand-deep)] to-[var(--brand-mid)] py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative background element for the solid block */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--brand-bright)]/20 shadow-[0_0_60px_rgba(75,184,250,0.4)] backdrop-blur-md">
            <FaLightbulb className="h-12 w-12 text-[var(--brand-soft)]" />
          </div>
          
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl">
            Have a game-changing idea?
          </h2>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-[var(--brand-soft)]">
            Don't keep it to yourself. Share your vision with our community of builders and investors. 
            Get actionable feedback, find collaborators, and take the first step toward making it real.
          </p>
          
          <div className="mt-12 flex flex-row flex-wrap justify-center gap-6">
            <Link href="/ideas">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[var(--brand-bright)]/20 text-white backdrop-blur-md hover:bg-[var(--brand-bright)]/40 transition-all shadow-lg px-8 border border-[var(--brand-bright)]/30"
              >
                Explore More Ideas
              </Button>
            </Link>
            <Link href="/add-idea">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[var(--brand-soft)] text-[var(--brand-deep)] font-bold shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl px-10"
              >
                Share Your Idea Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
