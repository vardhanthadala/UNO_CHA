"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    // { name: "Shop", href: "#shop" },
    { name: "Flavors", href: "#flavors" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 pt-4 sm:pt-6 transition-all duration-500">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-5xl transition-all duration-500 flex items-center justify-between relative ${isScrolled
          ? "bg-[#FDEBD0]/90 backdrop-blur-2xl border-2 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18] py-3 px-5 sm:px-8 rounded-full"
          : "bg-transparent border-transparent py-4 px-2 sm:px-6 rounded-full"
          }`}
      >
        {/* Playful Retro Pop Logo Badge */}
        <a
          href="#home"
          className="flex items-center group select-none"
        >
          <div className="bg-[#FEF08A] hover:bg-[#fde047] border-2 border-[#1E1B18] px-3.5 py-1.5 rounded-2xl shadow-[3px_3px_0px_#1E1B18] group-hover:shadow-[1px_1px_0px_#1E1B18] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:-rotate-2 transition-all flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] border border-[#1E1B18] animate-pulse" />
            <span className="font-anton text-xl sm:text-2xl tracking-tight text-[#E11D48] leading-none">
              UNO<span className="text-[#1E1B18] ml-1">CHA</span>
            </span>
            <span className="text-[8px] uppercase tracking-wider bg-[#7DD3FC] text-[#1E1B18] px-1.5 py-0.5 rounded-md border border-[#1E1B18] font-bold hidden sm:inline-block">
              POP
            </span>
          </div>
        </a>

        {/* Center Pill Tray with Retro Pop Organic Tabs */}
        <div className="hidden md:flex items-center p-1.5 rounded-full bg-[#FFFBF3] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab(link.name)}
                className={`relative px-5 py-2 text-xs uppercase tracking-widest transition-all duration-300 z-10 ${isActive ? "text-[#1E1B18]" : "text-[#1E1B18]/70 hover:text-[#E11D48]"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="retroActivePill"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    className="absolute inset-0 bg-[#FEF08A] rounded-full border border-[#1E1B18] shadow-[1px_1px_0px_#1E1B18] -z-10"
                  />
                )}
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Right CTA Button with Retro 3D Pop Shadow */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="#shop"
            className="group relative inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be123c] text-white pl-5 pr-4 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] hover:shadow-[1px_1px_0px_#1E1B18] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <span>Shop Now</span>
            <div className="w-5 h-5 rounded-full bg-[#FFFBF3] text-[#E11D48] flex items-center justify-center transition-transform group-hover:rotate-12 border border-[#1E1B18]">
              <ShoppingBag className="w-3 h-3" />
            </div>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-[#FEF08A] text-[#1E1B18] flex items-center justify-center border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 bg-[#FFFBF3] p-6 rounded-3xl border-3 border-[#1E1B18] shadow-[6px_6px_0px_#1E1B18] flex flex-col gap-4 text-center md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  setActiveTab(link.name);
                  setMobileMenuOpen(false);
                }}
                className="text-sm uppercase tracking-widest py-2 text-[#1E1B18] hover:text-[#E11D48] border-b border-[#1E1B18]/10"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
