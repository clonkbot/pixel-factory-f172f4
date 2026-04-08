import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { VideoStudio } from "./components/VideoStudio";
import { AuthScreen } from "./components/AuthScreen";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <VideoStudio />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#8B8B8B 1px, transparent 1px),
            linear-gradient(90deg, #8B8B8B 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Loading animation */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-6 h-6 md:w-8 md:h-8 bg-[#8B8B8B] animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                backgroundColor: i === 2 ? '#BFFF00' : i === 4 ? '#FF69B4' : '#8B8B8B',
              }}
            />
          ))}
        </div>
        <p className="font-mono text-[#8B8B8B] text-sm tracking-widest uppercase">
          Booting Factory...
        </p>
      </div>
    </div>
  );
}
