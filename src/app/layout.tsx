import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className="min-h-screen bg-base-200 text-base-content antialiased">
        {children}
      </body>
    </html>
  );
}