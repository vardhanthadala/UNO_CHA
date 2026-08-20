"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Eye, Play, Pause, ArrowDownUp } from "lucide-react";

interface ScrollFrameCanvasProps {
  frameCount?: number;
  framePrefix?: string;
  frameSuffix?: string;
  className?: string;
}

export default function ScrollFrameCanvas({
  frameCount = 120,
  framePrefix = "/hero-frames/frame_",
  frameSuffix = ".webp",
  className = "",
}: ScrollFrameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState<number>(1);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up" | null>(null);

  // 3D Magnetic Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  // Render a specific frame onto the canvas
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure index is wrapped and valid integer
    const safeIdx = Math.max(0, Math.min(frameCount - 1, Math.floor(index)));
    const img = imagesRef.current[safeIdx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentFrameRef.current = safeIdx;
      setCurrentFrameDisplay(safeIdx + 1);
    }
  }, [frameCount]);

  // Preload all frames on mount
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(4, "0");
      img.src = `${framePrefix}${numStr}${frameSuffix}`;

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
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

  // Smooth frame interpolation loop (LERP)
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isPlayingRef.current) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.05) {
          // Smoothly interpolate towards target
          const next = currentFrameRef.current + diff * 0.18;
          renderFrame(Math.round(next));
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  // Scroll Event Listener: Down scroll moves forward, Up scroll moves backward
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let directionTimeout: NodeJS.Timeout;

    const handleWindowScroll = () => {
      if (isPlayingRef.current) return;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (Math.abs(delta) > 0.5) {
        if (delta > 0) {
          setScrollDirection("down");
          // Scroll Down -> advance forward
          const step = Math.max(1, Math.min(15, Math.abs(delta) * 0.18));
          targetFrameRef.current = (targetFrameRef.current + step) % frameCount;
        } else {
          setScrollDirection("up");
          // Scroll Up -> reverse backward
          const step = Math.max(1, Math.min(15, Math.abs(delta) * 0.18));
          targetFrameRef.current = (targetFrameRef.current - step + frameCount) % frameCount;
        }

        clearTimeout(directionTimeout);
        directionTimeout = setTimeout(() => setScrollDirection(null), 800);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isPlayingRef.current) return;
      if (e.deltaY > 0) {
        setScrollDirection("down");
        const step = Math.max(1, Math.min(12, Math.abs(e.deltaY) * 0.09));
        targetFrameRef.current = (targetFrameRef.current + step) % frameCount;
      } else if (e.deltaY < 0) {
        setScrollDirection("up");
        const step = Math.max(1, Math.min(12, Math.abs(e.deltaY) * 0.09));
        targetFrameRef.current = (targetFrameRef.current - step + frameCount) % frameCount;
      }

      clearTimeout(directionTimeout);
      directionTimeout = setTimeout(() => setScrollDirection(null), 800);
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(directionTimeout);
    };
  }, [frameCount]);

  // Sync isPlaying state with ref
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => {
      const next = !prev;
      isPlayingRef.current = next;
      return next;
    });
  };

  // Auto-play loop when play button is clicked
  useEffect(() => {
    if (!isPlaying) return;
    let animationFrameId: number;
    let lastTime = performance.now();
    const fps = 24;
    const interval = 1000 / fps;

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      if (delta >= interval) {
        lastTime = currentTime - (delta % interval);
        const nextFrame = (currentFrameRef.current + 1) % frameCount;
        targetFrameRef.current = nextFrame;
        renderFrame(nextFrame);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, frameCount, renderFrame]);

  // Handle cursor scrubbing on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);

    if (isHovered && !isPlaying) {
      const hoverProgress = Math.max(0, Math.min(1, x / rect.width));
      const targetFrame = Math.min(frameCount - 1, Math.floor(hoverProgress * (frameCount - 1)));
      targetFrameRef.current = targetFrame;
      renderFrame(targetFrame);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative z-20 w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] xl:max-w-[440px] rounded-3xl overflow-hidden border-3 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] hover:shadow-[12px_12px_0px_#1E1B18] transition-shadow duration-300 bg-black group will-change-transform select-none ${className}`}
    >
      {/* Top Left Badge: Dynamic Scroll Direction Indicator */}
      <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 bg-[#FEF08A] px-3 py-1 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[10px] uppercase tracking-wider font-bold text-[#1E1B18] pointer-events-none">
        <span className={`w-2 h-2 rounded-full ${scrollDirection ? "bg-[#E11D48] animate-ping" : "bg-[#E11D48] animate-pulse"}`} />
        <span>
          {scrollDirection === "down" ? "↓ Scrolling Down" : scrollDirection === "up" ? "↑ Scrolling Up" : "Scroll Down / Up"}
        </span>
      </div>

      {/* Top Right Controls: Frame counter & Play/Pause toggle */}
      <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5">
        <span className="bg-[#1E1B18]/85 backdrop-blur-md text-[#FEF08A] font-mono text-[9px] px-2.5 py-1 rounded-full border border-[#FEF08A]/30 shadow-sm">
          {String(currentFrameDisplay).padStart(3, "0")} / {frameCount}
        </span>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause Video" : "Play Video"}
          className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#E11D48] hover:text-white flex items-center justify-center transition-all cursor-pointer text-[#1E1B18]"
        >
          {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
        </button>
      </div>

      {/* HTML5 Canvas Rendering Frames */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="w-full h-auto aspect-video object-cover block group-hover:scale-[1.02] transition-transform duration-500 ease-out cursor-ew-resize"
      />

      {/* Bottom Frame Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
        <div
          className="h-full bg-gradient-to-r from-[#FEF08A] via-[#7DD3FC] to-[#E11D48] transition-all duration-75"
          style={{ width: `${(currentFrameDisplay / frameCount) * 100}%` }}
        />
      </div>

      {/* Dynamic Scroll Direction Floating Indicator */}
      <div className="absolute bottom-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-[9px] uppercase tracking-wider bg-black/75 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1 shadow-md">
          <ArrowDownUp className="w-2.5 h-2.5 text-[#7DD3FC]" /> Scroll down to play • Up to rewind
        </span>
      </div>
    </motion.div>
  );
}
