import React, { useState } from "react";

type Props = {
  image: string;
  title: string;
  subtitle?: string;
  height?: string; // e.g., 'h-64', 'h-80'
};

function Banner({ image, title, subtitle, height = "h-96 md:h-[32rem]" }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${height} w-full bg-muted`}>
      {/* Skeleton placeholder while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      )}

      {/* Image with scale animation on load */}
      <img
        src={`/${image}`}
        alt={title}
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? "opacity-100 scale-105 animate-[scaleDown_0.8s_ease-out_forwards]" : "opacity-0"
        }`}
      />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.1)_100%)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-10 py-12 h-full flex flex-col justify-end max-w-6xl">
        <div className={`transition-all duration-500 ${imageLoaded ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="w-16 h-1 bg-accent rounded-full mb-6" />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed font-light">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />

      <style>{`
        @keyframes scaleDown {
          from { transform: scale(1.05); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Banner;


