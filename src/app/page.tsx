"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import UnoChaLogo from "@/components/UnoChaLogo";
import { ArrowRight, ShoppingCart, Heart, Check, Sparkles, Star, Zap, Smile, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

// Helper component for smooth letter-by-letter reveal on card hover
function AnimatedLetters({ text, isHovered, className = "", delayOffset = 0 }: { text: string; isHovered: boolean; className?: string; delayOffset?: number }) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: delayOffset,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0.4,
      y: 2,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 14,
        stiffness: 280,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate={isHovered ? "visible" : "hidden"}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Flavor Card Component with letter-by-letter hover animation + magnetic 3D tilt
function FlavorCard({ flv, idx, isGlobalHovered }: { flv: Flavor; idx: number, isGlobalHovered: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${flv.color} p-7 rounded-3xl border-3 border-[#1E1B18] shadow-[5px_5px_0px_#1E1B18] hover:shadow-[9px_9px_0px_#1E1B18] transition-shadow flex flex-col justify-between space-y-6 cursor-pointer group will-change-transform`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-wider bg-[#1E1B18] text-white px-3 py-1 rounded-full border border-black shadow-sm group-hover:scale-105 transition-transform">
            {flv.tag}
          </span>
          <span className="text-xs uppercase tracking-widest text-[#1E1B18]/60 font-mono">01.{idx + 1}</span>
        </div>

        <h3 className="font-anton text-3xl uppercase tracking-tight text-[#1E1B18] overflow-hidden">
          <AnimatedLetters text={flv.title} isHovered={isGlobalHovered} delayOffset={0} />
        </h3>

        <p className="text-xs uppercase tracking-wider text-[#E11D48] mt-1 font-semibold overflow-hidden">
          <AnimatedLetters text={flv.subtitle} isHovered={isGlobalHovered} delayOffset={0.06} />
        </p>
      </div>

      <div className="text-xs sm:text-sm text-[#1E1B18]/85 leading-relaxed border-t border-[#1E1B18]/15 pt-4 overflow-hidden">
        <AnimatedLetters text={flv.desc} isHovered={isGlobalHovered} delayOffset={0.12} />
      </div>
    </motion.div>
  );
}

// Magnetic Tilt FAQ Card — tilts toward mouse position for a tactile 3D feel
function MagneticFaqCard({ 
  faq, idx, isActive, onHover, onLeave 
}: { 
  faq: { q: string; a: string }; 
  idx: number; 
  isActive: boolean; 
  onHover: () => void; 
  onLeave: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    onLeave();
  };

  const cardColors = [
    "bg-[#FEF08A]/40 hover:bg-[#FEF08A]/70",
    "bg-[#7DD3FC]/25 hover:bg-[#7DD3FC]/50",
    "bg-[#FDEBD0]/60 hover:bg-[#FDEBD0]/90",
    "bg-[#FEF08A]/40 hover:bg-[#FEF08A]/70",
    "bg-[#7DD3FC]/25 hover:bg-[#7DD3FC]/50",
  ];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
      className={`border-3 border-[#1E1B18] ${cardColors[idx % cardColors.length]} rounded-3xl p-5 sm:p-6 cursor-pointer transition-colors duration-300 shadow-[4px_4px_0px_#1E1B18] will-change-transform`}
    >
      <div className="flex items-center justify-between text-sm sm:text-base text-[#1E1B18] gap-4">
        <div className="flex items-center gap-3">
          <motion.span 
            animate={{ 
              scale: isActive ? 1.15 : 1,
              backgroundColor: isActive ? "#E11D48" : "#1E1B18",
              color: isActive ? "#FEF08A" : "#FFFBF3",
            }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18] shrink-0"
          >
            {String(idx + 1).padStart(2, "0")}
          </motion.span>
          <span className="font-medium">{faq.q}</span>
        </div>
        <motion.span
          animate={{ rotate: isActive ? 45 : 0, scale: isActive ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-7 h-7 rounded-full bg-white border-2 border-[#1E1B18] flex items-center justify-center text-sm font-bold shadow-[1px_1px_0px_#1E1B18] shrink-0"
        >
          +
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-[#1E1B18]/85 mt-3 pt-3 border-t-2 border-[#1E1B18]/15 leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Interactive Aesthetic Video Banner with 3D Tilt, Hover Zoom, & Audio Toggle
function InteractiveVideoBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={toggleMute}
      className="w-full relative rounded-[48px] overflow-hidden border-3 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] hover:shadow-[16px_16px_0px_#1E1B18] hover:-translate-y-1 transition-all duration-500 group cursor-pointer will-change-transform"
    >
      {/* Top Left Badge */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#FEF08A] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
        <span className="text-xs uppercase tracking-wider text-[#1E1B18] font-bold">The Vibe</span>
      </div>

      {/* Top Right Sound Toggle Pill */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#E11D48] hover:text-white transition-all text-xs font-semibold uppercase tracking-wider text-[#1E1B18]"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-[#E11D48]" /> : <Volume2 className="w-4 h-4 text-[#E11D48]" />}
        <span>{isMuted ? "Sound Off" : "Sound On"}</span>
      </button>

      {/* Video Element */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dsppgndcp/video/upload/v1787158086/Firefly_A_sleek_aesthetic_commercial_for_-UNO_CHA-_sparkling_beverage_cans_with_a_-0g_Sugar_-_No_Su.mp4"
        className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover filter brightness-[0.92] group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
        autoPlay
        muted
        loop
        playsInline
      />
    </motion.div>
  );
}

// Magnetic Product Card with 3D Cursor Tilt & Smooth Transitions
function ProductCard({ 
  item, 
  idx, 
  favorites, 
  toggleFavorite, 
  showToast 
}: { 
  item: ProductItem; 
  idx: number; 
  favorites: Record<string, boolean>; 
  toggleFavorite: (name: string) => void; 
  showToast: (msg: string) => void; 
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover="hover"
      animate="rest"
      className="bg-[#FDEBD0]/40 rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18] hover:shadow-[12px_12px_0px_#1E1B18] transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer will-change-transform"
    >
      {/* Top Badge & Favorite Bar */}
      <div className="p-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#1E1B18] font-bold ${item.badgeColor}`}>
            {item.badge}
          </span>
          <span className="text-[9px] uppercase tracking-wider bg-white text-[#1E1B18] px-2.5 py-0.5 rounded-full border border-[#1E1B18] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm font-semibold">
            {item.motionLabel}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.name);
          }}
          aria-label="Wishlist"
          className={`w-9 h-9 rounded-full border-2 border-[#1E1B18] flex items-center justify-center transition-all cursor-pointer ${
            favorites[item.name] ? "bg-[#7DD3FC]" : "bg-white hover:bg-[#7DD3FC]"
          }`}
        >
          <Heart className={`w-4 h-4 ${favorites[item.name] ? "fill-current text-[#1E1B18]" : "text-[#1E1B18]"}`} />
        </button>
      </div>

      {/* Product Image Container with Dual Image Slide Transition */}
      <div className="px-5 pb-3 relative">
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#1E1B18] bg-white aspect-square flex items-center justify-center">
          {/* Primary Can Image */}
          <motion.img
            src={item.image}
            alt={item.name}
            variants={{
              rest: { y: "0%", opacity: 1, scale: 1 },
              hover: {
                y: item.slideDirection === "top-to-bottom" ? "20%" : "-20%",
                opacity: 0,
                scale: 0.98,
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          />

          {/* Secondary Alternate Aesthetic Image */}
          <motion.img
            src={item.hoverImage}
            alt={`${item.name} aesthetic`}
            variants={{
              rest: {
                y: item.slideDirection === "top-to-bottom" ? "-40%" : "40%",
                opacity: 0,
                scale: 1.03,
              },
              hover: {
                y: "0%",
                opacity: 1,
                scale: 1,
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
          />

          {/* Gloss Shine Streak */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

          {/* Floating Flavor Perk Badge on Hover */}
          <motion.div
            variants={{
              rest: { opacity: 0, y: 15, scale: 0.8 },
              hover: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 400, damping: 18, delay: 0.1 },
              },
            }}
            className="absolute bottom-3 left-3 z-30 bg-[#1E1B18] text-[#FEF08A] px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border border-white/20 shadow-md flex items-center gap-1 pointer-events-none"
          >
            <Sparkles className="w-3 h-3 text-[#7DD3FC]" /> {item.perk}
          </motion.div>
        </div>
      </div>

      {/* Bottom Details & Add to Cart */}
      <div className="p-5 bg-white border-t-3 border-[#1E1B18] flex items-center justify-between gap-3 z-10 relative">
        <div>
          <h3 className="text-sm uppercase tracking-tight font-bold text-[#1E1B18] line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-anton text-[#1E1B18]">${item.price}</span>
            <span className="text-xs text-[#1E1B18]/40 line-through">${item.originalPrice}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            showToast(`Added ${item.name} to cart!`);
          }}
          className="bg-[#E11D48] hover:bg-[#be123c] text-white p-3 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0 group-hover:rotate-12"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface Flavor {
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  accent: string;
  textColor: string;
  desc: string;
}

const flavors: Flavor[] = [
  {
    title: "ORIGINAL UJI",
    subtitle: "Pure Ceremonial Green Tea",
    tag: "★ BESTSELLER",
    color: "bg-[#FEF08A]",
    accent: "#E11D48",
    textColor: "text-[#1E1B18]",
    desc: "Single-origin stone-ground Uji matcha cold brewed with subtle mountain water.",
  },
  {
    title: "YUZU SPARKLER",
    subtitle: "Citrus Fizz & Matcha Boost",
    tag: "✦ CRISP FIZZ",
    color: "bg-[#7DD3FC]",
    accent: "#1E1B18",
    textColor: "text-[#1E1B18]",
    desc: "Zesty Japanese Yuzu juice infused with effervescent carbonation and vibrant green tea.",
  },
  {
    title: "LAVENDER CLOUD",
    subtitle: "Wild Blossom & Botanical Relax",
    tag: "✿ CALM VIBE",
    color: "bg-[#FDEBD0]",
    accent: "#E11D48",
    textColor: "text-[#1E1B18]",
    desc: "Aromatic lavender infusion with adaptogenic L-theanine for afternoon serenity.",
  },
];

interface ProductItem {
  name: string;
  price: number;
  originalPrice: number;
  badge: string;
  badgeColor: string;
  image: string;
  hoverImage: string;
  slideDirection: "top-to-bottom" | "bottom-to-top";
  motionLabel: string;
  perk: string;
}

const products: ProductItem[] = [
  {
    name: "Ginger Peach Tea 6-Pack",
    price: 26,
    originalPrice: 34,
    badge: "CITRUS POP",
    badgeColor: "bg-[#7DD3FC] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_6vvtv6vvtv6vvtv6.png",
    hoverImage: "/on-hover-products/Gemini_Generated_Image_9znpi59znpi59znp.png",
    slideDirection: "top-to-bottom",
    motionLabel: "↕ Peach Splash",
    perk: "🍑 Fresh Iced Peach",
  },
  {
    name: "Premium Earl Grey 6-Pack",
    price: 26,
    originalPrice: 34,
    badge: "BESTSELLER",
    badgeColor: "bg-[#FEF08A] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_92di4392di4392di.png",
    hoverImage: "/on-hover-products/Gemini_Generated_Image_d1966jd1966jd196.png",
    slideDirection: "bottom-to-top",
    motionLabel: "↕ Bergamot Glow",
    perk: "🍊 Bergamot Amber",
  },
  {
    name: "Premium Elderberry Tea 6-Pack",
    price: 28,
    originalPrice: 36,
    badge: "ANTIOXIDANT",
    badgeColor: "bg-[#E11D48] text-white",
    image: "/products/Gemini_Generated_Image_bgdm6vbgdm6vbgdm.png",
    hoverImage: "/on-hover-products/Gemini_Generated_Image_hvlg2uhvlg2uhvlg.png",
    slideDirection: "top-to-bottom",
    motionLabel: "↕ Wild Berry",
    perk: "🍇 Pure Elderberry",
  },
  {
    name: "Blush Jasmine Tea 6-Pack",
    price: 26,
    originalPrice: 34,
    badge: "SERENITY",
    badgeColor: "bg-[#FDEBD0] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_lnzoyxlnzoyxlnzo.png",
    hoverImage: "/on-hover-products/Gemini_Generated_Image_jji340jji340jji3.png",
    slideDirection: "bottom-to-top",
    motionLabel: "↕ Floral Blossom",
    perk: "🌸 Jasmine Blooms",
  },
  {
    name: "Emerald Jasmine Pearls 6-Pack",
    price: 30,
    originalPrice: 38,
    badge: "LIMITED",
    badgeColor: "bg-[#7DD3FC] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_st18msst18msst18.png",
    hoverImage: "/on-hover-products/Gemini_Generated_Image_ucik2aucik2aucik.png",
    slideDirection: "top-to-bottom",
    motionLabel: "↕ Jade Ritual",
    perk: "🍵 Ceremonial Jade",
  },
  {
    name: "Premium Rooibos Tea 6-Pack",
    price: 24,
    originalPrice: 32,
    badge: "CAFFEINE FREE",
    badgeColor: "bg-[#E11D48] text-white",
    image: "/products/Gemini_Generated_Image_2hoo0z2hoo0z2hoo.png",
    hoverImage: "/on-hover-products/Gemini_Generated_Image_wcaagbwcaagbwcaa (1).png",
    slideDirection: "bottom-to-top",
    motionLabel: "↕ Herbal Serene",
    perk: "☘ Amber Botanical",
  },
];

const faqs = [
  { q: "What makes Uno Cha different from regular canned teas?", a: "We brew 100% first-harvest Ceremonial Grade Uji Matcha cold without any concentrates, artificial sweeteners, or preservatives." },
  { q: "Will I get jitters or sugar crashes?", a: "Zero jitters. Matcha naturally contains L-theanine, which releases sustained energy for 4-6 hours without peaks or crashes." },
  { q: "How should I serve it?", a: "Best served chilled right out of the can or poured over fresh ice with a citrus slice!" },
  { q: "Is Uno Cha suitable for vegans and those with allergies?", a: "Absolutely. Uno Cha is 100% plant-based, gluten-free, dairy-free, and contains no artificial colors or flavors. Just pure tea goodness." },
  { q: "Where do you source your matcha from?", a: "All our matcha is sourced directly from award-winning tea farms in the Uji region of Kyoto, Japan — the birthplace of ceremonial matcha cultivation since the 12th century." },
];

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isAnyFlavorHovered, setIsAnyFlavorHovered] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const updated = !prev[name];
      showToast(updated ? `Saved ${name} to favorites` : `Removed ${name} from favorites`);
      return { ...prev, [name]: updated };
    });
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-[#FFFBF3] text-[#1E1B18] font-sans antialiased selection:bg-[#E11D48] selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            className="fixed top-6 left-1/2 z-50 bg-[#1E1B18] text-[#FFFBF3] px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-[4px_4px_0px_#E11D48] flex items-center gap-2 border-2 border-[#1E1B18]"
          >
            <Check className="w-4 h-4 text-[#7DD3FC]" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro Pop Capsule Navbar */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pt-24 sm:pt-28 max-w-[1600px] mx-auto w-full space-y-20 sm:space-y-28">
        {/* HERO SECTION — Playful Retro Pop Card with Curved Waves */}
        <motion.header
          id="home"
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#FDEBD0] text-[#1E1B18] px-5 sm:px-10 pb-8 sm:pb-12 pt-10 sm:pt-16 md:pt-20 rounded-[48px] relative z-0 overflow-hidden border-3 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18]"
        >
          {/* Retro Pop Fun Sticker Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.35 }}
            className="absolute top-6 left-6 hidden lg:flex items-center gap-2 bg-[#7DD3FC] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1E1B18]" />
            <span className="text-xs uppercase tracking-wider text-[#1E1B18]">100% Ceremonial Uji</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.45 }}
            className="absolute top-6 right-6 hidden lg:flex items-center gap-2 bg-[#FEF08A] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]"
          >
            <Smile className="w-3.5 h-3.5 text-[#E11D48]" />
            <span className="text-xs uppercase tracking-wider text-[#1E1B18]">Naturally Sparkling</span>
          </motion.div>

          {/* Bold Retro Headline */}
          <div className="text-center w-full relative z-10">
            <div className="inline-block relative">
              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-anton text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-tight text-[#E11D48] select-none leading-none"
              >
                UNO CHA
              </motion.h1>
              <motion.span
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
                className="absolute -bottom-3 right-4 sm:right-8 bg-[#FEF08A] text-[#1E1B18] text-xs sm:text-sm px-4 py-1 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] uppercase tracking-widest hidden sm:inline-block"
              >
                Social Tonic
              </motion.span>
            </div>
          </div>

          {/* Butter-Yellow Lower Deck Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-12 md:mt-16 bg-[#FEF08A] rounded-[36px] text-[#1E1B18] relative z-10 border-3 border-[#1E1B18] shadow-[5px_5px_0px_#1E1B18] overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-stretch justify-between p-6 sm:p-10 gap-8">
              <div className="flex flex-col justify-between space-y-4 max-w-md">
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E11D48] text-white text-xs uppercase tracking-wider border border-[#1E1B18]"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#FEF08A]" /> Clean Kyoto Energy
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[#1E1B18] font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-tight"
                  >
                    SIP THE <span className="text-[#E11D48]">RITUAL</span>
                  </motion.h2>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base text-[#1E1B18]/80 leading-relaxed"
                >
                  Crafted with premium shade-grown Uji tea leaves and cold-brewed to perfection. Pure sustained focus without jitters or sugar.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-2"
                >
                  <a
                    href="#shop"
                    className="inline-flex items-center gap-3 bg-[#E11D48] hover:bg-[#be123c] text-white py-3 px-7 rounded-full text-xs sm:text-sm uppercase tracking-wider border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] hover:shadow-[1px_1px_0px_#1E1B18] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <span>Get Yours Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>

              {/* Sky Cyan 98% Rating Card (Right to Left entrance) */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#7DD3FC] rounded-3xl p-6 text-[#1E1B18] sm:max-w-[240px] shadow-[4px_4px_0px_#1E1B18] border-2 border-[#1E1B18] self-start sm:self-auto flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-anton text-4xl sm:text-5xl text-[#1E1B18]">98%</span>
                    <div className="flex text-[#E11D48]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="-space-x-3 my-3">
                    <img
                      src="https://i.postimg.cc/y8g3KSxd/avatar-1.jpg"
                      alt="User 1"
                      className="inline-block size-9 sm:size-10 rounded-full border-2 border-[#1E1B18]"
                    />
                    <img
                      src="https://i.postimg.cc/BnrLnQPp/avatar-2.jpg"
                      alt="User 2"
                      className="inline-block size-9 sm:size-10 rounded-full border-2 border-[#1E1B18]"
                    />
                    <img
                      src="https://i.postimg.cc/W1BF1bqQ/avatar-3.jpg"
                      alt="User 3"
                      className="inline-block size-9 sm:size-10 rounded-full border-2 border-[#1E1B18]"
                    />
                  </div>
                </div>
                <p className="text-xs sm:text-sm leading-tight text-[#1E1B18]">
                  Over 10,000+ happy ritual drinkers nationwide.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Central Hero Can Image */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 z-20 select-none pointer-events-none"
          >
            <img
              src="/hero-can.png"
              alt="Uno Cha Matcha Can"
              className="object-contain h-[36vw] max-h-[500px] lg:max-h-[550px] w-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] rounded-2xl"
              draggable="false"
            />
          </motion.div>
        </motion.header>

        {/* CINEMATIC VIDEO BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs uppercase tracking-widest text-[#E11D48] flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> FEEL THE ENERGY
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#1E1B18] mt-1"
              >
                SEE IT <span className="text-[#E11D48]">IN MOTION</span>
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-[#1E1B18]/70 max-w-sm"
            >
              Watch how Uno Cha brings the perfect fusion of ceremonial matcha and sparkling refreshment to life.
            </motion.p>
          </div>

          <InteractiveVideoBanner />
        </motion.section>

        {/* FLAVORS SECTION (#flavors) — Organic Wave Cards */}
        <motion.section
          id="flavors"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-xs uppercase tracking-widest text-[#E11D48] flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4" /> CRAFTED LINEUP
              </span>
              <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#1E1B18] mt-1">
                THREE ICONIC FLAVORS
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-[#1E1B18]/70 max-w-sm"
            >
              Each recipe is cold-steeped for 16 hours to preserve the vibrant jade green antioxidant profile.
            </motion.p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ perspective: 1000 }}
            onMouseEnter={() => setIsAnyFlavorHovered(true)}
            onMouseLeave={() => setIsAnyFlavorHovered(false)}
          >
            {flavors.map((flv, idx) => (
              <FlavorCard key={idx} flv={flv} idx={idx} isGlobalHovered={isAnyFlavorHovered} />
            ))}
          </div>
        </motion.section>

        {/* SHOP COLLECTION (#shop) */}
        <motion.section
          id="shop"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full space-y-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b-3 border-[#1E1B18] pb-6">
            <motion.h2
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#1E1B18] leading-none"
            >
              EXPLORE <span className="text-[#E11D48]">COLLECTION</span>
            </motion.h2>
            <motion.span
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-widest bg-[#FEF08A] px-4 py-2 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] font-bold"
            >
              ★ FREE EXPRESS SHIPPING OVER $50
            </motion.span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: 900 }}>
            {products.map((item, idx) => (
              <ProductCard
                key={idx}
                item={item}
                idx={idx}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                showToast={showToast}
              />
            ))}
          </div>
        </motion.section>

        {/* FAQ SECTION (#faq) — Interactive Magnetic Tilt Cards */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl mx-auto space-y-8 pt-10"
        >
          {/* Section heading with floating stickers */}
          <div className="text-center space-y-3 relative py-2">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-6, -2, -6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 left-0 sm:left-4 lg:-left-12 hidden sm:flex items-center gap-1.5 bg-[#FEF08A] px-3.5 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-xs uppercase tracking-wider font-bold select-none pointer-events-none z-10"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" /> Curious?
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0], rotate: [5, 1, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-1 right-0 sm:right-4 lg:-right-12 hidden sm:flex items-center gap-1.5 bg-[#7DD3FC] px-3.5 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-xs uppercase tracking-wider font-bold select-none pointer-events-none z-10"
            >
              💡 Ask Away
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs uppercase tracking-widest bg-[#7DD3FC] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] inline-block"
            >
              ✦ FREQUENTLY ASKED ✦
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase text-[#1E1B18]"
            >
              GOT <span className="text-[#E11D48]">QUESTIONS?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-[#1E1B18]/60 max-w-md mx-auto"
            >
              Hover over any question to reveal the answer. Tilt the cards around — go on, play with them!
            </motion.p>

            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-3, 2, -3] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-4 right-6 sm:right-16 hidden md:flex items-center gap-1.5 bg-[#E11D48] text-white px-3.5 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-xs uppercase tracking-wider font-bold select-none pointer-events-none z-10"
            >
              <Zap className="w-3.5 h-3.5 text-[#FEF08A]" /> Quick Answers
            </motion.div>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4 pt-4" style={{ perspective: 1000 }}>
            {faqs.map((faq, idx) => (
              <MagneticFaqCard
                key={idx}
                faq={faq}
                idx={idx}
                isActive={activeFaq === idx}
                onHover={() => setActiveFaq(idx)}
                onLeave={() => setActiveFaq(null)}
              />
            ))}
          </div>
        </motion.section>
      </div>

      {/* FOOTER SECTION (#contact) — Peach-Cream with Bold Neo-Pop Borders */}
      <motion.footer
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-[#FDEBD0] text-[#1E1B18] px-6 sm:px-12 pb-10 mt-28 pt-12 sm:pt-16 rounded-t-[50px] border-t-4 border-[#1E1B18] relative z-0"
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-[#1E1B18]/20">
            {/* Uno Cha Footer Logo Badge */}
            <div className="flex items-center gap-2">
              <UnoChaLogo />
            </div>

            <nav className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs sm:text-sm uppercase tracking-wider font-semibold">
              <a href="#home" className="hover:text-[#E11D48] transition-colors">Home</a>
              <a href="#flavors" className="hover:text-[#E11D48] transition-colors">Flavors</a>
              <a href="#shop" className="hover:text-[#E11D48] transition-colors">Shop</a>
              <a href="#faq" className="hover:text-[#E11D48] transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-[#E11D48] transition-colors">Contact</a>
            </nav>

            {/* Social Media Links: Instagram, Facebook, Twitter/X */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#E11D48] hover:text-white flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#7DD3FC] hover:text-[#1E1B18] flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FEF08A] hover:text-[#1E1B18] flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-wider text-[#1E1B18]/70">
            <p>© {new Date().getFullYear()} Uno Cha Beverage Co. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Crafted with</span> <span className="text-[#E11D48]">❤</span> <span>by <a href="https://www.linkedin.com/in/vardhanthadala" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#E11D48] hover:underline transition-colors">vardhan</a></span>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}


