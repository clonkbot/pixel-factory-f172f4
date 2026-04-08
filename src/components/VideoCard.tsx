import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import type { Doc, Id } from "../../convex/_generated/dataModel";

interface VideoCardProps {
  video: Doc<"videos">;
}

export function VideoCard({ video }: VideoCardProps) {
  const removeVideo = useMutation(api.videos.remove);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch fresh video data to get updated URL
  const freshVideo = useQuery(api.videos.get, { id: video._id });
  const displayVideo = freshVideo ?? video;

  // Timer for generating state
  useEffect(() => {
    if (video.status !== "generating") return;

    const startTime = video.createdAt;
    const updateElapsed = () => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [video.status, video.createdAt]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeVideo({ id: video._id });
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="bg-white border-4 border-[#8B8B8B] relative overflow-hidden group"
      style={{
        aspectRatio: video.aspectRatio === "16:9" ? "16/9" : "9/16",
      }}
    >
      {/* Status indicator */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        {video.status === "generating" && (
          <div className="bg-[#FFD93D] px-2 py-1 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#8B8B8B] animate-spin" />
            Building...
          </div>
        )}
        {video.status === "completed" && (
          <div className="bg-[#BFFF00] px-2 py-1 font-mono text-xs uppercase tracking-wider">
            Ready!
          </div>
        )}
        {video.status === "failed" && (
          <div className="bg-[#FF69B4] px-2 py-1 font-mono text-xs uppercase tracking-wider">
            Failed
          </div>
        )}
      </div>

      {/* Delete button */}
      {!showConfirm && (
        <button
          onClick={() => setShowConfirm(true)}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-[#8B8B8B] text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF69B4] flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Delete confirmation */}
      {showConfirm && (
        <div className="absolute inset-0 bg-[#8B8B8B] bg-opacity-90 z-20 flex flex-col items-center justify-center gap-4 p-4">
          <p className="font-mono text-sm text-white text-center uppercase">Delete this video?</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-[#FF69B4] font-mono text-sm uppercase hover:bg-[#ff4da6] disabled:opacity-50"
            >
              {isDeleting ? "..." : "Yes"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-white font-mono text-sm uppercase hover:bg-[#F5F0E8]"
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Content based on status */}
      {video.status === "generating" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F0E8]">
          {/* Factory animation */}
          <div className="relative mb-6">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 md:w-6 md:h-6 animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    backgroundColor: ['#BFFF00', '#8B8B8B', '#FF69B4', '#8B8B8B', '#FFD93D'][i],
                  }}
                />
              ))}
            </div>
            {/* Conveyor belt */}
            <div className="mt-2 w-full h-2 bg-[#8B8B8B] relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-conveyor"
                style={{ backgroundSize: '40px 100%' }}
              />
            </div>
          </div>

          <p className="font-mono text-xs md:text-sm text-[#8B8B8B] uppercase tracking-wider text-center px-4">
            Manufacturing pixels...
          </p>
          <p className="font-mono text-lg md:text-xl text-[#8B8B8B] mt-2">
            {formatTime(elapsedTime)}
          </p>
          <p className="font-mono text-[10px] text-[#8B8B8B] opacity-50 mt-2">
            Usually takes 1-2 minutes
          </p>
        </div>
      )}

      {video.status === "completed" && displayVideo.videoUrl && (
        <video
          src={displayVideo.videoUrl}
          controls
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      )}

      {video.status === "failed" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FF69B4] bg-opacity-10 p-4">
          <div className="text-4xl md:text-6xl mb-4">🔧</div>
          <p className="font-mono text-xs md:text-sm text-[#8B8B8B] text-center uppercase tracking-wider">
            Oops! The robots had trouble
          </p>
          {video.errorMessage && (
            <p className="font-mono text-[10px] text-[#8B8B8B] opacity-60 mt-2 text-center max-w-full truncate">
              {video.errorMessage}
            </p>
          )}
        </div>
      )}

      {/* Prompt display */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8B8B8B] to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="font-mono text-[10px] md:text-xs text-white truncate">
          {video.prompt}
        </p>
      </div>
    </div>
  );
}
