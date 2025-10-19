import React, { useRef } from "react";

interface TemplateCardProps {
  label: string;
  description: string;
  name: string;
  onTry: (template: string, description: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  label,
  description,
  onTry,
  name
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768 && videoRef.current) {
      videoRef.current.playbackRate = 2;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768 && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl 
      shadow-[0_6px_16px_rgba(17,25,40,0.08)] hover:shadow-[0_12px_30px_rgba(80,63,205,0.18)]
      overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer
      w-full sm:w-auto flex flex-col"
    >
      {/* Futuristic glow layer */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-tr from-fuchsia-500/30 via-indigo-400/40 to-sky-400/30 blur-xl" />

      {/* Video Preview */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden rounded-t-2xl">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={`${label}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-2 left-2 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
          Preview
        </div>
      </div>

      <div className="relative p-4 z-10 flex flex-col justify-between h-[140px] sm:h-[150px]">
        <div>
          <h3 className="text-gray-900 font-semibold text-sm sm:text-base tracking-tight mb-1 group-hover:text-indigo-600 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm leading-snug line-clamp-2">
            {description}
          </p>
        </div>

        {/* Hover-Only Button */}
        <button
          onClick={() => onTry(name, description)}
          className="mt-3 opacity-100 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 
          transition-all duration-500 ease-out relative inline-flex items-center justify-center w-full py-2 
          font-semibold text-xs sm:text-sm rounded-full text-white overflow-hidden 
          bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500
          shadow-[0_4px_15px_rgba(99,102,241,0.3)]
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/30 before:to-transparent before:opacity-0 sm:group-hover:before:opacity-40
          hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] active:scale-[0.97] focus:outline-none"
        >
          <span className="relative z-10">Try this template</span>
        </button>
      </div>

      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/20" />
    </div>
  );
};
