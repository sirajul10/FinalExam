import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95">
      <div className="flex flex-col items-center">
        {/* Hotel Icon */}
        <div className="relative mb-6">
          {/* Outer Spinner */}
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400"></div>

          {/* Hotel Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-900 shadow-lg shadow-blue-900/40">
              <span className="text-2xl">🏨</span>
            </div>
          </div>
        </div>

        {/* Brand */}
        <h2 className="text-2xl font-bold text-white">
          Hotel<span className="text-cyan-400">Ease</span>
        </h2>

        {/* Loading Text */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-slate-400">Loading hotel data</span>

          {/* Animated dots */}
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"></span>
          </span>
        </div>

        {/* Loading Bar */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-cyan-400"></div>
        </div>

        <p className="mt-3 text-xs text-slate-500">Please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
