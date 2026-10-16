import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/components/ToasterProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Bangla Mart — Discover More",
    template: "%s | Bangla Mart",
  },
  description:
    "Discover products, explore local businesses, and shop with Bangla Mart.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="banglamart"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

        <ToasterProvider />
      </body>
    </html>
  );
}
