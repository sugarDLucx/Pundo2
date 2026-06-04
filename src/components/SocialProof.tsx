/* eslint-disable */
"use client";

import { motion } from "framer-motion";

export function SocialProof() {
  return (
    <section id="faq" className="py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          {/* Quote Icon Background */}
          <span className="absolute -top-12 -left-12 md:-left-20 text-[100px] text-secondary/10 select-none pointer-events-none font-playfair leading-none">
            &ldquo;
          </span>
          <p className="font-playfair text-3xl md:text-5xl text-primary max-w-4xl mx-auto leading-relaxed relative z-10">
            "Since transitioning to Pundo, my relationship with money has shifted from one of anxiety to one of quiet confidence. It's not just a tool; it's a private sanctuary for my legacy."
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 space-y-2"
        >
          <p className="text-xs font-semibold text-accent uppercase tracking-widest">Julian Vance</p>
          <p className="text-foreground/70">Private Client since 2022</p>
        </motion.div>
      </div>
    </section>
  );
}

