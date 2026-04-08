import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { VideoCard } from "./VideoCard";
import { PromptBuilder } from "./PromptBuilder";
import type { Doc } from "../../convex/_generated/dataModel";

export function VideoStudio() {
  const { signOut } = useAuthActions();
  const videos = useQuery(api.videos.list);
  const createVideo = useMutation(api.videos.create);
  const generateVideo = useAction(api.videos.generateVideo);

  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const videoId = await createVideo({ prompt, aspectRatio });

      // Fire off the generation (non-blocking)
      generateVideo({ videoId, prompt, aspectRatio }).catch((err) => {
        console.error("Video generation failed:", err);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start video generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const generatingVideos = videos?.filter((v: Doc<"videos">) => v.status === "generating") ?? [];
  const completedVideos = videos?.filter((v: Doc<"videos">) => v.status === "completed") ?? [];
  const failedVideos = videos?.filter((v: Doc<"videos">) => v.status === "failed") ?? [];

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col relative overflow-hidden">
      {/* Blueprint grid background */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#8B8B8B 1px, transparent 1px),
            linear-gradient(90deg, #8B8B8B 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-20 bg-white border-b-4 border-[#8B8B8B]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-[#BFFF00]" />
              <div className="w-4 h-4 md:w-6 md:h-6 bg-[#FF69B4]" />
              <div className="w-4 h-4 md:w-6 md:h-6 bg-[#FFD93D]" />
            </div>
            <h1
              className="text-xl md:text-2xl lg:text-3xl font-black text-[#8B8B8B] uppercase tracking-tighter"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              PIXEL<span className="text-[#BFFF00]">FACTORY</span>
            </h1>
          </div>

          <button
            onClick={() => signOut()}
            className="px-3 py-2 md:px-4 md:py-2 bg-[#8B8B8B] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#6B6B6B] transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 py-6 md:py-8">
        {/* Prompt Builder Section */}
        <section className="mb-8 md:mb-12">
          <div className="bg-white border-4 border-[#8B8B8B] p-4 md:p-6 lg:p-8 relative">
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#BFFF00]" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF69B4]" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2
                className="text-xl md:text-2xl font-black text-[#8B8B8B] uppercase tracking-tight"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                // Video Assembly Line
              </h2>

              {/* Aspect ratio toggle */}
              <div className="flex items-center gap-2 font-mono text-xs uppercase">
                <span className="text-[#8B8B8B]">Format:</span>
                <button
                  onClick={() => setAspectRatio("16:9")}
                  className={`px-3 py-2 border-2 transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-[#BFFF00] border-[#8B8B8B]"
                      : "bg-transparent border-[#8B8B8B] opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="w-8 h-5 border-2 border-current" />
                </button>
                <button
                  onClick={() => setAspectRatio("9:16")}
                  className={`px-3 py-2 border-2 transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-[#FF69B4] border-[#8B8B8B]"
                      : "bg-transparent border-[#8B8B8B] opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="w-5 h-8 border-2 border-current" />
                </button>
              </div>
            </div>

            <PromptBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />

            {error && (
              <div className="mt-4 bg-[#FF69B4] bg-opacity-20 border-2 border-[#FF69B4] px-4 py-3 font-mono text-sm text-[#8B8B8B]">
                Error: {error}
              </div>
            )}
          </div>
        </section>

        {/* Generating Videos */}
        {generatingVideos.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2
              className="text-lg md:text-xl font-black text-[#8B8B8B] uppercase tracking-tight mb-4 flex items-center gap-3"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              <span className="inline-block w-3 h-3 bg-[#FFD93D] animate-pulse" />
              Building Your Videos...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {generatingVideos.map((video: Doc<"videos">) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Videos */}
        {completedVideos.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2
              className="text-lg md:text-xl font-black text-[#8B8B8B] uppercase tracking-tight mb-4 flex items-center gap-3"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              <span className="inline-block w-3 h-3 bg-[#BFFF00]" />
              Your Creations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {completedVideos.map((video: Doc<"videos">) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Failed Videos */}
        {failedVideos.length > 0 && (
          <section className="mb-8 md:mb-12">
            <h2
              className="text-lg md:text-xl font-black text-[#8B8B8B] uppercase tracking-tight mb-4 flex items-center gap-3"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              <span className="inline-block w-3 h-3 bg-[#FF69B4]" />
              Oops! These Didn't Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {failedVideos.map((video: Doc<"videos">) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {videos && videos.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 md:w-12 md:h-12 border-4 border-[#8B8B8B] opacity-20"
                  style={{ transform: `rotate(${i * 15}deg)` }}
                />
              ))}
            </div>
            <p className="font-mono text-sm text-[#8B8B8B] uppercase tracking-wider">
              No videos yet! Start creating above!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t-2 border-dashed border-[#8B8B8B] border-opacity-30">
        <p className="text-center font-mono text-[10px] text-[#8B8B8B] opacity-50">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
