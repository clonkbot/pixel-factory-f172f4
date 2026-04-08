import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Failed to continue as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col relative overflow-hidden">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(#8B8B8B 2px, transparent 2px),
            linear-gradient(90deg, #8B8B8B 2px, transparent 2px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 md:w-32 md:h-32 bg-[#BFFF00] rotate-12 animate-pulse opacity-60" />
      <div className="absolute bottom-32 right-10 w-16 h-16 md:w-24 md:h-24 bg-[#FF69B4] -rotate-6 animate-pulse opacity-60" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-40 right-20 w-12 h-12 md:w-16 md:h-16 bg-[#FFD93D] rotate-45 animate-pulse opacity-60" style={{ animationDelay: '1s' }} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        {/* Logo */}
        <div className="mb-8 md:mb-12 text-center">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#8B8B8B] uppercase"
            style={{ fontFamily: 'Archivo Black, sans-serif' }}
          >
            PIXEL
            <span className="block text-[#BFFF00]" style={{ textShadow: '4px 4px 0 #8B8B8B' }}>
              FACTORY
            </span>
          </h1>
          <p className="mt-4 font-mono text-xs md:text-sm text-[#8B8B8B] tracking-widest uppercase">
            // Make Pixar-Style Videos //
          </p>
        </div>

        {/* Auth form */}
        <div className="w-full max-w-md">
          <div className="bg-white border-4 border-[#8B8B8B] p-6 md:p-8 relative">
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-[#BFFF00]" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-[#BFFF00]" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-[#BFFF00]" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-[#BFFF00]" />

            <h2 className="font-mono text-lg md:text-xl font-bold text-[#8B8B8B] uppercase mb-6 tracking-wider">
              {flow === "signIn" ? ">> Enter Factory" : ">> New Builder"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#8B8B8B] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-[#F5F0E8] border-2 border-[#8B8B8B] font-mono text-sm focus:outline-none focus:border-[#BFFF00] transition-colors"
                  placeholder="builder@pixelfactory.com"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#8B8B8B] uppercase tracking-wider mb-2">
                  Secret Code
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-[#F5F0E8] border-2 border-[#8B8B8B] font-mono text-sm focus:outline-none focus:border-[#BFFF00] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="bg-[#FF69B4] bg-opacity-20 border-2 border-[#FF69B4] px-4 py-2 font-mono text-xs text-[#8B8B8B]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#BFFF00] border-4 border-[#8B8B8B] font-black text-lg uppercase tracking-wider hover:bg-[#a8e600] active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                {isLoading ? "Loading..." : flow === "signIn" ? "Start Building!" : "Create Account!"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="w-full mt-4 py-2 font-mono text-xs text-[#8B8B8B] hover:text-[#FF69B4] uppercase tracking-wider transition-colors"
            >
              {flow === "signIn" ? "Need an account? Sign up" : "Already a builder? Sign in"}
            </button>

            <div className="mt-6 pt-6 border-t-2 border-dashed border-[#8B8B8B]">
              <button
                onClick={handleAnonymous}
                disabled={isLoading}
                className="w-full py-3 bg-[#FFD93D] border-4 border-[#8B8B8B] font-bold text-sm uppercase tracking-wider hover:bg-[#e6c435] active:translate-y-1 transition-all disabled:opacity-50"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                Quick Play (Guest Mode)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="font-mono text-[10px] text-[#8B8B8B] opacity-50">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
