import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { formatDateSafe } from "../../utils/DateFormatter";
import { templatesWithTheirIds } from "../../data/TemplateIds";

interface ShowcaseCarouselProps {
  items: any[];
  type: "project" | "render";
}

export const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({
  items,
  type,
}) => {
  return (
    <div className="relative w-full py-8">
      {/* Optional gradient background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 opacity-10 blur-3xl rounded-3xl"></div>

      <Swiper
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper relative z-10"
      >
        {items.map((item) => (
          <SwiperSlide
            key={item.id}
            className="!w-[240px] sm:!w-[280px] md:!w-[320px] lg:!w-[340px] cursor-pointer"
          >
            <div className="relative rounded-2xl overflow-hidden group shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_35px_rgba(80,63,205,0.4)] transition-all duration-500">
              {/* Video or Image preview */}
              <div
                className="relative h-56 sm:h-64 overflow-hidden bg-gray-900"
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector("video");
                  if (video) {
                    video.playbackRate = 2;
                    video.play();
                  }
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector("video");
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                {type === "project" ? (
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={item.projectVidUrl}
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).poster =
                        "https://via.placeholder.com/300x200/1e1e1e/ffffff?text=Preview+Unavailable";
                    }}
                  />
                ) : item.type === "mp4" || item.type === "webm" ? (
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={item.outputUrl}
                  />
                ) : item.type === "gif" ? (
                  <img
                    src={item.outputUrl}
                    alt="GIF Render"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-300">
                    No preview
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Category tag */}
                <div className="absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold uppercase rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-sm">
                  {type === "project" ? "Template" : "Render"}
                </div>
              </div>

              <div className="absolute bottom-0 p-4 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                <h3 className="text-sm sm:text-base font-semibold leading-tight mb-1 truncate">
                  {type === "project"
                    ? item.title
                    : type === "render"
                    ? templatesWithTheirIds?.[String(item.templateId)] ||
                      "Unknown Template"
                    : "Rendered Video"}
                </h3>
                <p className="text-xs text-gray-300 truncate">
                  {type === "render"
                    ? "Rendered at: " + formatDateSafe(item.renderedAt)
                    : type === "project"
                    ? "Created at: " + formatDateSafe(item.createdAt)
                    : "Click to preview or edit"}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
