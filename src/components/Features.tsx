/* eslint-disable */
"use client";

import { motion } from "framer-motion";

export function Features() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="features" className="py-24 bg-surface">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-primary"
          >
            The Features
          </motion.h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Pundo isn't just about managing wealth; it is about building a life together. Every feature is designed with our partnership in mind.
          </p>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-accent mx-auto rounded-full"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[700px]"
        >
          {/* Shared Milestones */}
          <motion.div variants={itemVariants} className="md:col-span-8 group relative overflow-hidden rounded-[32px] bg-white/40 backdrop-blur-xl transition-all hover:scale-[1.01] shadow-[0_20px_40px_-15px_rgba(66,0,147,0.06)] border border-border/40">
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-gradient-to-tr from-primary/40 to-accent/20 object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
            </div>
            <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">Goal Tracking</span>
              <h3 className="font-playfair text-4xl font-bold mt-2">Shared Milestones</h3>
              <p className="text-lg opacity-90 max-w-md mt-4">Track the progress of our biggest dreams, from weekend getaways to long-term goals, all in one visual dashboard.</p>
            </div>
          </motion.div>

          {/* Date Night Reserves */}
          <motion.div variants={itemVariants} className="md:col-span-4 group bg-secondary/10 rounded-[32px] p-10 flex flex-col justify-between border border-border/40 transition-all hover:bg-secondary/20">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-primary">Date Night Reserves</h3>
              <p className="text-foreground/80">Automatically set aside funds specifically for our adventures, ensuring we never compromise on quality time.</p>
            </div>
          </motion.div>

          {/* Seamless Syncing */}
          <motion.div variants={itemVariants} className="md:col-span-6 group relative overflow-hidden rounded-[32px] bg-primary h-full min-h-[300px] flex items-center px-10 border border-primary-container/20">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full">
              <div className="w-full h-full bg-gradient-to-l from-white/20 to-transparent mix-blend-overlay opacity-40" />
            </div>
            <div className="relative z-10">
              <h3 className="font-playfair text-3xl font-bold text-primary-foreground mb-4">Seamless Syncing</h3>
              <p className="text-lg text-primary-foreground/80 max-w-sm">A perfectly balanced ledger that keeps our priorities aligned and our future secure.</p>
            </div>
          </motion.div>

          {/* Memory Vault */}
          <motion.div variants={itemVariants} className="md:col-span-6 group relative overflow-hidden rounded-[32px] bg-accent h-full min-h-[300px] flex items-center px-10 border border-accent/20">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full">
              <div className="w-full h-full bg-gradient-to-l from-black/10 to-transparent mix-blend-overlay opacity-40" />
            </div>
            <div className="relative z-10">
              <h3 className="font-playfair text-3xl font-bold text-accent-foreground mb-4">Memory Vault</h3>
              <p className="text-lg text-accent-foreground/90 max-w-sm">Attach photos and notes to specific savings goals to remind us why we are building this foundation.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

