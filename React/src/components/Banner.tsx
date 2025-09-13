import React from "react";

type Props = {
  image: string;
  title: string;
  subtitle?: string;
  height?: string; // e.g., 'h-64', 'h-80'
};

function Banner({ image, title, subtitle, height = "h-96 md:h-[32rem]" }: Props) {
  return (
    <div className={`relative overflow-hidden ${height} w-full`}>
      <img src={`/${image}`} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 px-6 md:px-10 py-10 h-full flex flex-col justify-end">
        <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-lg text-white/80 max-w-3xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default Banner;


