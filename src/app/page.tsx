"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { ArrowRight, ShoppingCart, Heart, Check, Sparkles, Star, Zap, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const products = [
  {
    name: "Ginger Peach Tea 6-Pack",
    price: 26,
    originalPrice: 34,
    badge: "CITRUS POP",
    badgeColor: "bg-[#7DD3FC] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_6vvtv6vvtv6vvtv6.png",
  },
  {
    name: "Premium Earl Grey 6-Pack",
    price: 26,
    originalPrice: 34,
    badge: "BESTSELLER",
    badgeColor: "bg-[#FEF08A] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_92di4392di4392di.png",
  },
  {
    name: "Premium Elderberry Tea 6-Pack",
    price: 28,
    originalPrice: 36,
    badge: "ANTIOXIDANT",
    badgeColor: "bg-[#E11D48] text-white",
    image: "/products/Gemini_Generated_Image_bgdm6vbgdm6vbgdm.png",
  },
  {
    name: "Blush Jasmine Tea 6-Pack",
    price: 26,
    originalPrice: 34,
    badge: "SERENITY",
    badgeColor: "bg-[#FDEBD0] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_lnzoyxlnzoyxlnzo.png",
  },
  {
    name: "Emerald Jasmine Pearls 6-Pack",
    price: 30,
    originalPrice: 38,
    badge: "LIMITED",
    badgeColor: "bg-[#7DD3FC] text-[#1E1B18]",
    image: "/products/Gemini_Generated_Image_st18msst18msst18.png",
  },
  {
    name: "Premium Rooibos Tea 6-Pack",
    price: 24,
    originalPrice: 32,
    badge: "CAFFEINE FREE",
    badgeColor: "bg-[#E11D48] text-white",
    image: "/products/Gemini_Generated_Image_2hoo0z2hoo0z2hoo.png",
  },
];

const faqs = [
  { q: "What makes Uno Cha different from regular canned teas?", a: "We brew 100% first-harvest Ceremonial Grade Uji Matcha cold without any concentrates, artificial sweeteners, or preservatives." },
  { q: "Will I get jitters or sugar crashes?", a: "Zero jitters. Matcha naturally contains L-theanine, which releases sustained energy for 4-6 hours without peaks or crashes." },
  { q: "How should I serve it?", a: "Best served chilled right out of the can or poured over fresh ice with a citrus slice!" },
];

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

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
    <div className="min-h-screen bg-[#FFFBF3] text-[#1E1B18] flex flex-col justify-between font-sans antialiased selection:bg-[#E11D48] selection:text-white overflow-x-hidden">
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
        <header
          id="home"
          className="w-full bg-[#FDEBD0] text-[#1E1B18] px-5 sm:px-10 pb-8 sm:pb-12 pt-10 sm:pt-16 md:pt-20 rounded-[48px] relative z-0 overflow-hidden border-3 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18]"
        >
          {/* Retro Pop Fun Sticker Badges */}
          <div className="absolute top-6 left-6 hidden lg:flex items-center gap-2 bg-[#7DD3FC] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] rotate-[-6deg]">
            <Sparkles className="w-3.5 h-3.5 text-[#1E1B18]" />
            <span className="text-xs uppercase tracking-wider text-[#1E1B18]">100% Ceremonial Uji</span>
          </div>

          <div className="absolute top-6 right-6 hidden lg:flex items-center gap-2 bg-[#FEF08A] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] rotate-[4deg]">
            <Smile className="w-3.5 h-3.5 text-[#E11D48]" />
            <span className="text-xs uppercase tracking-wider text-[#1E1B18]">Naturally Sparkling</span>
          </div>

          {/* Bold Retro Headline */}
          <div className="text-center w-full relative z-10">
            <div className="inline-block relative">
              <h1 className="font-anton text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-tight text-[#E11D48] select-none leading-none">
                UNO CHA
              </h1>
              <span className="absolute -bottom-3 right-4 sm:right-8 bg-[#FEF08A] text-[#1E1B18] text-xs sm:text-sm px-4 py-1 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] rotate-[-3deg] uppercase tracking-widest hidden sm:inline-block">
                Social Tonic
              </span>
            </div>
          </div>

          {/* Butter-Yellow Lower Deck Container */}
          <div className="mt-8 sm:mt-12 md:mt-16 bg-[#FEF08A] rounded-[36px] text-[#1E1B18] relative z-10 border-3 border-[#1E1B18] shadow-[5px_5px_0px_#1E1B18] overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-stretch justify-between p-6 sm:p-10 gap-8">
              <div className="flex flex-col justify-between space-y-4 max-w-md">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E11D48] text-white text-xs uppercase tracking-wider border border-[#1E1B18]">
                    <Zap className="w-3.5 h-3.5 text-[#FEF08A]" /> Clean Kyoto Energy
                  </div>
                  <h2 className="text-[#1E1B18] font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-tight">
                    SIP THE <span className="text-[#E11D48]">RITUAL</span>
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-[#1E1B18]/80 leading-relaxed">
                  Crafted with premium shade-grown Uji tea leaves and cold-brewed to perfection. Pure sustained focus without jitters or sugar.
                </p>

                <div className="pt-2">
                  <a
                    href="#shop"
                    className="inline-flex items-center gap-3 bg-[#E11D48] hover:bg-[#be123c] text-white py-3 px-7 rounded-full text-xs sm:text-sm uppercase tracking-wider border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] hover:shadow-[1px_1px_0px_#1E1B18] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <span>Get Yours Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Sky Cyan 98% Rating Card */}
              <div className="bg-[#7DD3FC] rounded-3xl p-6 text-[#1E1B18] sm:max-w-[240px] shadow-[4px_4px_0px_#1E1B18] border-2 border-[#1E1B18] self-start sm:self-auto flex flex-col justify-between">
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
              </div>
            </div>
          </div>

          {/* Central Hero Can Image */}
          <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 z-20 select-none pointer-events-none">
            <img
              src="/hero-can.png"
              alt="Uno Cha Matcha Can"
              className="object-contain h-[36vw] max-h-[500px] lg:max-h-[550px] w-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] rounded-2xl"
              draggable="false"
            />
          </div>
        </header>

        {/* FLAVORS SECTION (#flavors) — Organic Wave Cards */}
        <section id="flavors" className="w-full space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E11D48] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> CRAFTED LINEUP
              </span>
              <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#1E1B18] mt-1">
                THREE ICONIC FLAVORS
              </h2>
            </div>
            <p className="text-sm text-[#1E1B18]/70 max-w-sm">
              Each recipe is cold-steeped for 16 hours to preserve the vibrant jade green antioxidant profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flavors.map((flv, idx) => (
              <div
                key={idx}
                className={`${flv.color} p-7 rounded-3xl border-3 border-[#1E1B18] shadow-[5px_5px_0px_#1E1B18] hover:translate-y-[-4px] transition-all flex flex-col justify-between space-y-6`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] uppercase tracking-wider bg-[#1E1B18] text-white px-3 py-1 rounded-full border border-black">
                      {flv.tag}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#1E1B18]/60">01.{idx + 1}</span>
                  </div>
                  <h3 className="font-anton text-3xl uppercase tracking-tight text-[#1E1B18]">{flv.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-[#E11D48] mt-1">{flv.subtitle}</p>
                </div>
                <p className="text-xs sm:text-sm text-[#1E1B18]/80 leading-relaxed border-t border-[#1E1B18]/15 pt-4">
                  {flv.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SHOP COLLECTION (#shop) */}
        <section id="shop" className="w-full space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b-3 border-[#1E1B18] pb-6">
            <h2 className="font-anton text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#1E1B18] leading-none">
              EXPLORE <span className="text-[#E11D48]">COLLECTION</span>
            </h2>
            <span className="text-xs uppercase tracking-widest bg-[#FEF08A] px-4 py-2 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              ★ FREE EXPRESS SHIPPING OVER $50
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FDEBD0]/40 rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18] hover:shadow-[8px_8px_0px_#1E1B18] hover:translate-y-[-3px] transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Badge & Favorite Bar */}
                <div className="p-4 flex items-center justify-between">
                  <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-[#1E1B18] ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <button
                    onClick={() => toggleFavorite(item.name)}
                    aria-label="Wishlist"
                    className={`w-9 h-9 rounded-full border-2 border-[#1E1B18] flex items-center justify-center transition-all ${favorites[item.name] ? "bg-[#7DD3FC]" : "bg-white hover:bg-[#7DD3FC]"
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites[item.name] ? "fill-current text-[#1E1B18]" : "text-[#1E1B18]"}`} />
                  </button>
                </div>

                {/* Product Image */}
                <div className="px-5 pb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover rounded-2xl border-2 border-[#1E1B18] group-hover:scale-[1.02] transition-transform"
                  />
                </div>

                {/* Bottom Details & Add to Cart */}
                <div className="p-5 bg-white border-t-3 border-[#1E1B18] flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm uppercase tracking-tight text-[#1E1B18] line-clamp-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base text-[#1E1B18]">${item.price}</span>
                      <span className="text-xs text-[#1E1B18]/40 line-through">${item.originalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Added ${item.name} to cart!`)}
                    className="bg-[#E11D48] hover:bg-[#be123c] text-white p-3 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION (#faq) */}
        <section id="faq" className="w-full max-w-4xl mx-auto space-y-6 pt-10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest bg-[#7DD3FC] px-4 py-1.5 rounded-full border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] inline-block">
              ✦ FREQUENTLY ASKED ✦
            </span>
            <h2 className="font-anton text-4xl sm:text-5xl uppercase text-[#1E1B18]">
              GOT QUESTIONS?
            </h2>
          </div>

          <div className="space-y-4 pt-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="border-3 border-[#1E1B18] bg-[#FEF08A]/30 rounded-3xl p-5 sm:p-6 cursor-pointer hover:bg-[#FEF08A]/50 transition-all shadow-[4px_4px_0px_#1E1B18]"
              >
                <div className="flex items-center justify-between text-sm sm:text-base text-[#1E1B18]">
                  <span>{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-white border-2 border-[#1E1B18] flex items-center justify-center text-xs shadow-[1px_1px_0px_#1E1B18]">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p className="text-xs sm:text-sm text-[#1E1B18]/85 mt-3 pt-3 border-t-2 border-[#1E1B18]/15 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER SECTION (#contact) — Peach-Cream with Bold Neo-Pop Borders */}
      <footer id="contact" className="w-full bg-[#FDEBD0] text-[#1E1B18] px-6 sm:px-12 pb-10 mt-28 pt-12 sm:pt-16 rounded-t-[50px] border-t-4 border-[#1E1B18] relative z-0">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-[#1E1B18]/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-[#1E1B18] bg-[#FEF08A] text-[#E11D48] flex flex-col items-center justify-center text-[11px] leading-[1.05] tracking-widest shadow-[2px_2px_0px_#1E1B18]">
                <span>UN</span>
                <span>OA</span>
              </div>
              <span className="font-anton text-2xl tracking-tight text-[#E11D48]">
                UNO CHA
              </span>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs sm:text-sm uppercase tracking-wider">
              <a href="#home" className="hover:text-[#E11D48] transition-colors">Home</a>
              <a href="#flavors" className="hover:text-[#E11D48] transition-colors">Flavors</a>
              <a href="#shop" className="hover:text-[#E11D48] transition-colors">Shop</a>
              <a href="#faq" className="hover:text-[#E11D48] transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-[#E11D48] transition-colors">Contact</a>
            </nav>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-wider text-[#1E1B18]/70">
            <p>© {new Date().getFullYear()} Uno Cha Beverage Co. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <span>Crafted with</span> <span className="text-[#E11D48]">❤</span> <span>in Kyoto, Japan</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

