"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";

const tiers = [
  {
    name: "The Daily Dose",
    price: "3 Kisses",
    period: "/ day",
    description: "Basic budget tracking, daily affirmations, and unlimited access to my heart.",
    features: [
      "Basic budget tracking",
      "Daily affirmations",
      "Unlimited heart access",
    ],
    buttonText: "Claim Kisses",
    buttonVariant: "outline" as const,
  },
  {
    name: "The \"Over Two Years\" Loyalty",
    price: "1 Hug",
    period: "/ week",
    description: "Everything in basic, plus priority date-night planning.",
    features: [
      "Everything in Daily Dose",
      "Priority date-night planning",
      "Exclusive weekend itineraries",
    ],
    buttonText: "Redeem Hug",
    buttonVariant: "default" as const,
    highlighted: true,
  },
  {
    name: "The Forever Premium",
    price: "Lifetime",
    period: " together",
    description: "24/7 personalized support, infinite love, and a funded future.",
    features: [
      "24/7 support from Yǒngyuǎn",
      "Infinite love",
      "A beautifully funded future",
    ],
    buttonText: "Lock It In",
    buttonVariant: "outline" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-surface-variant/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-primary"
          >
            The Investment Plans
          </motion.h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Because a love this rich cannot be measured in standard currencies, Pundo operates on a completely different exchange rate.
          </p>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-accent mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative rounded-[32px] p-8 flex flex-col ${
                tier.highlighted
                  ? "bg-primary text-primary-foreground shadow-2xl scale-105 border border-primary-container"
                  : "bg-white/60 backdrop-blur-md border border-border/40 text-foreground hover:bg-white/80 transition-colors"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8 mt-2">
                <h3 className={`text-2xl font-playfair font-bold mb-2 ${tier.highlighted ? "text-white" : "text-primary"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm ${tier.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className={`font-playfair text-4xl font-bold ${tier.highlighted ? "text-white" : "text-foreground"}`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className={`text-sm font-medium ${tier.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {tier.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <svg 
                      className={`w-5 h-5 shrink-0 mt-0.5 ${tier.highlighted ? "text-accent" : "text-primary"}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${tier.highlighted ? "text-primary-foreground/90" : "text-foreground/80"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.buttonVariant} 
                className={`w-full rounded-full py-6 text-xs uppercase tracking-widest ${
                  tier.highlighted 
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 border-transparent" 
                    : "border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {tier.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
