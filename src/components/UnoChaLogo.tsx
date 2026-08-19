"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface UnoChaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function UnoChaLogo({ className = "", size = "md" }: UnoChaLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 bg-[#FEF08A] hover:bg-[#fef3a3] border-2 border-[#1E1B18] px-3.5 py-1.5 rounded-2xl shadow-[3px_3px_0px_#1E1B18] group-hover:shadow-[1px_1px_0px_#1E1B18] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:-rotate-2 transition-all select-none cursor-pointer ${className}`}
    >
      {/* Mini 3D Retro Can Emblem */}
      <div className="relative w-7 h-8 bg-gradient-to-b from-[#7DD3FC] to-[#38bdf8] rounded-md border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18] flex flex-col items-center justify-between py-0.5 overflow-hidden shrink-0">
        {/* Can Top Rim */}
        <div className="w-4 h-1 bg-white/80 rounded-full border border-[#1E1B18]" />
        {/* Can Mini Logo */}
        <span className="font-anton text-[8px] text-[#E11D48] tracking-tighter leading-none scale-90">
          UNO
        </span>
        {/* Can Bottom Rim */}
        <div className="w-3.5 h-0.5 bg-[#1E1B18]/40 rounded-full" />
      </div>

      {/* Brand Name Text Block */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1 leading-none">
          <span className="font-anton text-lg sm:text-xl tracking-tight text-[#E11D48]">
            UNO
          </span>
          <span className="font-anton text-lg sm:text-xl tracking-tight text-[#1E1B18]">
            CHA
          </span>
          <Sparkles className="w-3 h-3 text-[#E11D48] fill-[#E11D48]" />
        </div>
        <span className="text-[7.5px] uppercase tracking-[0.2em] text-[#1E1B18]/75 font-bold leading-none mt-0.5">
          Ritual Pop Tea
        </span>
      </div>

      {/* Pop Tag */}
      <span className="text-[8px] uppercase tracking-wider bg-[#7DD3FC] text-[#1E1B18] px-1.5 py-0.5 rounded-md border border-[#1E1B18] font-bold hidden sm:inline-block">
        KYOTO
      </span>
    </div>
  );
}
