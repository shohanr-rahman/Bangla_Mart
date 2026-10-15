import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/components/ToasterProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Bangla Mart — Local Sellers Marketplace",
    template: "%s | Bangla Mart",
  },
  description: "A multi-vendor marketplace for local sellers.",
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
      className={inter.variable}
    >
      <body className="flex min-h-screen flex-col bg-base-200 text-base-content antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToasterProvider />
      </body>
    </html>
  );
}