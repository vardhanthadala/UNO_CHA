"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Sparkles, Zap, Heart, ArrowDown, RefreshCw } from "lucide-react";

interface ScrollTriggerExperienceProps {
  frameCount?: number;
  framePrefix?: string;
  frameSuffix?: string;
}

export default function ScrollTriggerExperience({
  frameCount = 120,
  framePrefix = "/hero-frames/frame_",
  frameSuffix = ".webp",
}: ScrollTriggerExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Pinned scroll progress from 0 (top entering) to 1 (bottom leaving)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring smoothing for 60fps frame interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  // Milestone transforms for text overlays
  const phase1Opacity = useTransform(smoothProgress, [0, 0.1, 0.28, 0.35], [1, 1, 1, 0]);
  const phase1Y = useTransform(smoothProgress, [0, 0.28, 0.35], [0, 0, -30]);

  const phase2Opacity = useTransform(smoothProgress, [0.32, 0.42, 0.62, 0.7], [0, 1, 1, 0]);
  const phase2Y = useTransform(smoothProgress, [0.32, 0.42, 0.62, 0.7], [30, 0, 0, -30]);

  const phase3Opacity = useTransform(smoothProgress, [0.68, 0.78, 0.95, 1], [0, 1, 1, 1]);
  const phase3Y = useTransform(smoothProgress, [0.68, 0.78, 1], [30, 0, 0]);

  // Canvas scaling on scroll
  const canvasScale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  // Render a specific frame onto canvas
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const safeIdx = Math.max(0, Math.min(frameCount - 1, Math.floor(index)));
    const img = imagesRef.current[safeIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentFrameRef.current = safeIdx;
      setCurrentFrame(safeIdx + 1);
      setProgressPercent(Math.round((safeIdx / (frameCount - 1)) * 100));
    }
  }, [frameCount]);

  // Preload frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(4, "0");
      img.src = `${framePrefix}${numStr}${frameSuffix}`;

      img.onload = () => {
        if (i === 1 && currentFrameRef.current === 0) {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.naturalWidth || 960;
            canvas.height = img.naturalHeight || 540;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      images.forEach((img) => (img.onload = null));
    };
  }, [frameCount, framePrefix, frameSuffix]);

  // Scrub frame based on scroll position
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const progress = Math.max(0, Math.min(1, latest));
      const targetFrame = Math.min(frameCount - 1, Math.floor(progress * (frameCount - 1)));
      renderFrame(targetFrame);
    });

    return () => unsubscribe();
  }, [smoothProgress, frameCount, renderFrame]);

  return (
    <div ref={sectionRef} className="relative h-[280vh] w-full">
      {/* Sticky Pinned Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8 py-6">
        {/* Top Header Badge & Title */}
        <div className="text-center space-y-2 mb-4 z-20">
          <div className="inline-flex items-center gap-2 bg-[#FEF08A] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-xs uppercase tracking-wider font-bold text-[#1E1B18]">
            <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>ScrollTrigger Experience • Scroll Down & Up</span>
          </div>
          <h2 className="font-anton text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#1E1B18]">
            THE MATCHA <span className="text-[#E11D48]">SPLASH RITUAL</span>
          </h2>
        </div>

        {/* Center Screen: Canvas Frame Display + Overlays */}
        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
          {/* Main Neo-Pop Video Canvas Card */}
          <motion.div
            style={{ scale: canvasScale }}
            className="w-full relative rounded-3xl md:rounded-[40px] overflow-hidden border-3 sm:border-4 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] sm:shadow-[14px_14px_0px_#1E1B18] bg-black"
          >
            {/* Top Left Live Frame Badge */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-[#FEF08A] px-3.5 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-xs uppercase tracking-wider font-bold text-[#1E1B18]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
              <span>Frame {String(currentFrame).padStart(3, "0")} / {frameCount}</span>
            </div>

            {/* Top Right Scroll Progress Pill */}
            <div className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-xs font-mono font-bold uppercase tracking-wider text-[#1E1B18]">
              {progressPercent}% SCRUBBED
            </div>

            {/* HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-auto aspect-video object-cover block"
            />

            {/* Bottom Gradient Progress Scrubber */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/60">
              <div
                className="h-full bg-gradient-to-r from-[#FEF08A] via-[#7DD3FC] to-[#E11D48] transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </motion.div>

          {/* PHASE 1 OVERLAY (0% - 30%): First Harvest */}
          <motion.div
            style={{ opacity: phase1Opacity, y: phase1Y }}
            className="absolute -bottom-6 sm:bottom-6 left-2 sm:-left-6 z-30 bg-[#7DD3FC] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18] max-w-[260px] sm:max-w-xs pointer-events-none"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1B18] mb-1">
              <span className="bg-[#1E1B18] text-white px-2 py-0.5 rounded-full text-[10px]">01</span>
              <span>Ceremonial Uji</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1E1B18] leading-snug font-medium">
              100% single-origin shade-grown leaves handpicked at spring first harvest.
            </p>
          </motion.div>

          {/* PHASE 2 OVERLAY (35% - 65%): Cold-Brew Splash */}
          <motion.div
            style={{ opacity: phase2Opacity, y: phase2Y }}
            className="absolute -top-6 sm:top-6 right-2 sm:-right-6 z-30 bg-[#FEF08A] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18] max-w-[260px] sm:max-w-xs pointer-events-none"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1B18] mb-1">
              <span className="bg-[#E11D48] text-white px-2 py-0.5 rounded-full text-[10px]">02</span>
              <span>16-Hr Cold Extraction</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1E1B18] leading-snug font-medium">
              Slow mountain water steeping unlocks explosive antioxidants without bitterness.
            </p>
          </motion.div>

          {/* PHASE 3 OVERLAY (70% - 100%): Sustained Focus */}
          <motion.div
            style={{ opacity: phase3Opacity, y: phase3Y }}
            className="absolute -bottom-6 sm:bottom-6 right-2 sm:-right-6 z-30 bg-[#FDEBD0] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18] max-w-[260px] sm:max-w-xs pointer-events-none"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1B18] mb-1">
              <span className="bg-[#1E1B18] text-[#FEF08A] px-2 py-0.5 rounded-full text-[10px]">03</span>
              <span>Pure Clean Energy</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1E1B18] leading-snug font-medium">
              L-theanine + organic caffeine delivers 4-6 hours of laser focus with zero sugar crash.
            </p>
          </motion.div>
        </div>

        {/* Bottom Interactive Milestone Stepper */}
        <div className="mt-6 z-20 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs uppercase tracking-wider font-bold">
          <div className={`px-4 py-1.5 rounded-full border-2 border-[#1E1B18] transition-all duration-300 ${
            progressPercent < 33 ? "bg-[#7DD3FC] shadow-[3px_3px_0px_#1E1B18] scale-105" : "bg-white/80 opacity-60"
          }`}>
            01. Harvest
          </div>
          <div className="text-[#1E1B18]/40">→</div>
          <div className={`px-4 py-1.5 rounded-full border-2 border-[#1E1B18] transition-all duration-300 ${
            progressPercent >= 33 && progressPercent < 68 ? "bg-[#FEF08A] shadow-[3px_3px_0px_#1E1B18] scale-105" : "bg-white/80 opacity-60"
          }`}>
            02. Cold Splash
          </div>
          <div className="text-[#1E1B18]/40">→</div>
          <div className={`px-4 py-1.5 rounded-full border-2 border-[#1E1B18] transition-all duration-300 ${
            progressPercent >= 68 ? "bg-[#E11D48] text-white shadow-[3px_3px_0px_#1E1B18] scale-105" : "bg-white/80 opacity-60"
          }`}>
            03. Social Tonic
          </div>
        </div>

        {/* Scroll down hint */}
        <div className="mt-3 flex items-center gap-2 text-xs text-[#1E1B18]/70 font-semibold uppercase tracking-widest animate-bounce">
          <ArrowDown className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>Scroll down to play animation • Scroll up to reverse</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#E11D48]" />
        </div>
      </div>
    </div>
  );
}
