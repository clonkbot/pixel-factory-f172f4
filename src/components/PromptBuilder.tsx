import { useState } from "react";

interface PromptBuilderProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const PROMPT_STARTERS = [
  { emoji: "🦖", text: "A friendly dinosaur", color: "#BFFF00" },
  { emoji: "🚀", text: "A rocket ship adventure", color: "#FF69B4" },
  { emoji: "🐱", text: "A cute cat", color: "#FFD93D" },
  { emoji: "🤖", text: "A robot helper", color: "#BFFF00" },
  { emoji: "🧜‍♀️", text: "A magical mermaid", color: "#FF69B4" },
  { emoji: "🦸", text: "A superhero", color: "#FFD93D" },
];

const ACTIONS = [
  "dancing in a party",
  "exploring a jungle",
  "flying through space",
  "swimming in the ocean",
  "building a sandcastle",
  "making new friends",
  "going on an adventure",
  "learning to cook",
];

const STYLES = [
  "with colorful sparkles",
  "in a magical forest",
  "under a rainbow sky",
  "with funny sound effects",
  "at sunset",
  "in a candy land",
];

export function PromptBuilder({ onGenerate, isGenerating }: PromptBuilderProps) {
  const [prompt, setPrompt] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      setPrompt("");
    }
  };

  const addToPrompt = (text: string) => {
    setPrompt((prev) => {
      if (prev.trim()) {
        return prev + " " + text;
      }
      return text;
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video... e.g., 'A happy robot dancing in a colorful garden'"
            className="w-full px-4 py-4 bg-[#F5F0E8] border-4 border-[#8B8B8B] font-mono text-sm md:text-base resize-none focus:outline-none focus:border-[#BFFF00] transition-colors min-h-[120px]"
            disabled={isGenerating}
          />
          <div className="absolute bottom-2 right-2 font-mono text-xs text-[#8B8B8B] opacity-50">
            {prompt.length}/500
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="flex-1 py-4 bg-[#BFFF00] border-4 border-[#8B8B8B] font-black text-lg md:text-xl uppercase tracking-wider hover:bg-[#a8e600] active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 relative overflow-hidden"
            style={{ fontFamily: 'Archivo Black, sans-serif' }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 bg-[#8B8B8B] animate-spin" />
                Sending to Factory...
              </span>
            ) : (
              "Make My Video!"
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="px-6 py-4 bg-[#FFD93D] border-4 border-[#8B8B8B] font-bold text-sm uppercase tracking-wider hover:bg-[#e6c435] active:translate-y-1 transition-all"
            style={{ fontFamily: 'Archivo Black, sans-serif' }}
          >
            {showSuggestions ? "Hide Ideas" : "Need Ideas?"}
          </button>
        </div>
      </form>

      {/* Suggestion chips */}
      {showSuggestions && (
        <div className="mt-6 space-y-4 animate-fade-in">
          {/* Characters */}
          <div>
            <p className="font-mono text-xs text-[#8B8B8B] uppercase tracking-wider mb-2">
              Pick a Character:
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_STARTERS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => addToPrompt(item.text)}
                  className="px-3 py-2 text-sm font-mono border-2 border-[#8B8B8B] hover:border-current active:translate-y-0.5 transition-all"
                  style={{
                    backgroundColor: item.color + '40',
                    borderColor: item.color,
                  }}
                >
                  {item.emoji} {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <p className="font-mono text-xs text-[#8B8B8B] uppercase tracking-wider mb-2">
              What are they doing?
            </p>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => addToPrompt(action)}
                  className="px-3 py-2 text-sm font-mono bg-white border-2 border-[#8B8B8B] hover:bg-[#F5F0E8] active:translate-y-0.5 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div>
            <p className="font-mono text-xs text-[#8B8B8B] uppercase tracking-wider mb-2">
              Add some magic:
            </p>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((style, i) => (
                <button
                  key={i}
                  onClick={() => addToPrompt(style)}
                  className="px-3 py-2 text-sm font-mono bg-[#FF69B4] bg-opacity-20 border-2 border-[#FF69B4] hover:bg-opacity-40 active:translate-y-0.5 transition-all"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generation time warning */}
      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-[#8B8B8B] opacity-60">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Videos take 1-2 minutes to build. Be patient, the robots are working hard!
      </div>
    </div>
  );
}
