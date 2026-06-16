export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none z-0"></div>

      <div className="flex flex-col items-center gap-6 z-10">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-surface shadow-inner"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          {/* Static inner ring */}
          <div className="absolute inset-3 rounded-full border-2 border-accent/20"></div>
        </div>
        
        <div className="text-center">
          <h2 className="font-playfair text-2xl font-bold text-foreground tracking-widest uppercase mb-2 animate-pulse">
            Loading
          </h2>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            Preparing your vault...
          </p>
        </div>
      </div>
    </div>
  );
}
