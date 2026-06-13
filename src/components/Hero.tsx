/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  const images = [
    "/pics/2.jpeg",
    "/pics/3.jpg",
    "/pics/4.jpeg",
    "/pics/5.jpg",
    "/pics/6.jpg",
    "/pics/7.jpg",
    "/pics/8.jpeg",
    "/pics/9.jpeg",
    "/pics/10.jpeg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
            For My Bǎobèi
          </p>
          
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight mb-6">
            Our Future, <br />
            <span className="text-accent italic">Managed Together.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            "True wealth isn't measured in numbers, but in the moments we share. Welcome to your exclusive financial dashboard, Bǎobèi."
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full shadow-xl shadow-primary/10 tracking-widest text-xs uppercase px-10 py-6">
                Begin Our Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="rounded-full tracking-widest text-xs uppercase px-10 py-6">
                Explore The Future
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:w-1/2 relative w-full"
        >
          <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-2 aspect-[4/5] relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(66,0,147,0.06)] border border-white/40">
            <div className="w-full h-full rounded-[32px] relative overflow-hidden">
              <AnimatePresence>
                <motion.img 
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt="Memories"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
            
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
              <div className="flex items-center gap-2 text-sm font-semibold text-accent mt-4">
                ❤️ Infinite Memories
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}


