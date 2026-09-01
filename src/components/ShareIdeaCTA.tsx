import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaLightbulb } from "react-icons/fa";

export default function ShareIdeaCTA() {
  return (
    <section className="max-w-7xl mx-auto mt-12 mb-16 px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.3)] backdrop-blur-md">
            <FaLightbulb className="h-10 w-10 text-cyan-400" />
          </div>
          
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Have a game-changing idea?
          </h2>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Don't keep it to yourself. Share your vision with our community of builders and investors. 
            Get actionable feedback, find collaborators, and take the first step toward making it real.
          </p>
          
          <div className="mt-10 flex flex-row flex-wrap justify-center gap-4">
            <Link href="/ideas">
              <Button 
                size="lg" 
                variant="flat" 
                className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-transform hover:scale-105"
              >
                Explore More Ideas
              </Button>
            </Link>
            <Link href="/add-idea">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg transition-transform hover:scale-105"
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
