"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2600);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#09090f] transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Loading Shohan_Mart"
      role="status"
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Decorative glow */}
        <div className="relative">
          <div className="absolute inset-0 scale-150 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative animate-[fadeIn_0.8s_ease-out]">
            <p className="mb-1 text-sm font-medium tracking-[5px] text-gray-400">
              MADE BY
            </p>

            <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-6xl font-extrabold tracking-[6px] text-transparent sm:text-8xl">
              সোহান
            </h1>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-9 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" />
          </div>

          <p className="mt-4 text-xs font-medium tracking-[2px] text-gray-400 sm:text-sm">
            Loading, please wait...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[loadingBar_3s_linear_forwards] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loadingBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}