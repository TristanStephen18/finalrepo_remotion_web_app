import React, { useCallback } from "react";
import type { PropsWithChildren } from 'react';
import useEmblaCarousel from "embla-carousel-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface EmblaCarouselProps {
  slidesToShow?: number;
}

export const EmblaCarousel: React.FC<PropsWithChildren<EmblaCarouselProps>> = ({
  children,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: true,
    loop: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">{children}</div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md 
        hover:bg-white shadow-md p-2 rounded-full hidden sm:flex items-center justify-center"
      >
        <FiChevronLeft className="text-gray-700 text-xl" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md 
        hover:bg-white shadow-md p-2 rounded-full hidden sm:flex items-center justify-center"
      >
        <FiChevronRight className="text-gray-700 text-xl" />
      </button>
    </div>
  );
};
