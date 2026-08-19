import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uno Cha | Sparkling Social Tonic & Ceremonial Matcha",
  description: "Crafted with premium shade-grown Kyoto tea leaves and cold-brewed to perfection. Pure sustained focus without jitters.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-black p-0 m-0`}>
        {children}
      </body>
    </html>
  );
}
