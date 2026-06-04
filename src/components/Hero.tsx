/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Decorative Ambient Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary-foreground/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[0%] left-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] -z-10" />
      
      <div className="container mx-auto px-6 lg:px-12 text-center md:text-left flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 space-y-8"
        >
          <p className="text-primary font-semibold tracking-wider uppercase text-sm mb-4">
            For My Yǒngyuǎn
          </p>
          
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight mb-6">
            Our Future, <br />
            <span className="text-accent italic">Managed Together.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            "True wealth isn't measured in numbers, but in the moments we share. Welcome to your exclusive financial dashboard, Yǒngyuǎn."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="rounded-full shadow-xl shadow-primary/10 tracking-widest text-xs uppercase px-10 py-6">
              Begin Our Journey
            </Button>
            <Button variant="outline" size="lg" className="rounded-full tracking-widest text-xs uppercase px-10 py-6">
              Explore The Future
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:w-1/2 relative"
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-2 aspect-[4/5] relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(66,0,147,0.06)] border border-white/40">
            {/* Using a placeholder gradient since the local image might not be available yet */}
            <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-primary/10 to-accent/20 object-cover" />
            
            {/* Floating Stat Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-8 right-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-2xl"
            >
              <div className="text-foreground/70 text-xs font-semibold uppercase tracking-widest mb-1">
                Date Night Reserves
              </div>
              <div className="text-primary font-playfair text-2xl font-bold">
                100% Ready
              </div>
              <div className="flex items-center gap-1 text-accent text-xs font-semibold mt-1">
                â¤ï¸ Infinite Memories
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}


