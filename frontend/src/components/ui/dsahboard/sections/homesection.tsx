import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { templateCategories } from "../../../../data/dashboardcardsdata";
import { HomeTemplateCard } from "../hometemplatecard";
// import { TemplateCard } from "../hometemplatecard";

interface HomeSectionProps {
  search: string;
  setSearch: (value: string) => void;
  onTry: (template: string, description: string) => void;
  projects?: any[];
  renders?: any[];
}

export const HomeSection: React.FC<HomeSectionProps> = (props) => {
  const { onTry, projects, renders } = props;
  // const safeProjects = Array.isArray(projects) ? projects : [];
  // const safeRenders = Array.isArray(renders) ? renders : [];
  const allTemplates = Object.values(templateCategories).flat();

  // generate random card sizes (2 variants: tall or wide)
  const randomizedTemplates = useMemo(() => {
    return allTemplates.map((t, i) => ({
      ...t,
      size: Math.random() > 0.6 ? "large" : "small",
      id: i,
    }));
  }, [allTemplates]);

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 2,
          borderRadius: 3,
          mb: 8,
          background: "linear-gradient(135deg, #fdfbfb 0%, #f3f7ff 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating glows */}
        <Box
          sx={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(66,165,245,0.35), transparent)",
            filter: "blur(90px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-120px",
            right: "-80px",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(216,27,96,0.35), transparent)",
            filter: "blur(100px)",
          }}
        />

        {/* Main Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            background: "linear-gradient(90deg, #d81b60, #8e24aa, #42a5f5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            position: "relative",
            animation: "shine 6s linear infinite",
            "@keyframes shine": {
              "0%": { backgroundPosition: "0% 50%" },
              "100%": { backgroundPosition: "200% 50%" },
            },
            backgroundSize: "200% auto",
          }}
        >
          ViralMotion Creator
        </Typography>

        {/* Animated underline */}
        <Box
          sx={{
            width: 220,
            height: 5,
            mx: "auto",
            borderRadius: 2,
            mb: 3,
            background: "linear-gradient(90deg, #d81b60, #42a5f5, #d81b60)",
            backgroundSize: "200% 100%",
            animation: "moveGradient 4s linear infinite",
            "@keyframes moveGradient": {
              "0%": { backgroundPosition: "0% 50%" },
              "100%": { backgroundPosition: "200% 50%" },
            },
          }}
        />

        {/* Tagline */}
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            mb: 5,
            fontWeight: 500,
            maxWidth: 700,
            mx: "auto",
            fontSize: { xs: "1rem", md: "1.25rem" },
            animation: "fadeIn 1.5s ease",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          Design with impact — explore viral templates, create stunning visuals,
          and share your ideas with the world 🌍
        </Typography>
      </Box>

      {/* Recently Created Templates/Projects */}
      {projects && projects.length > 0 && (
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 1, textAlign: "left" }}
          >
            Recently Created Templates
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "left" }}
          >
            Your most recent template projects, ready to edit or share.
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pb: 1,
              maxWidth: { xs: "100vw", md: "1400px" },
              width: "100%",
              mx: "auto",
            }}
          >
            {projects.slice(0, 5).map((project) => (
              <Box
                key={project.id}
                sx={{
                  minWidth: 220,
                  maxWidth: 260,
                  flex: "0 0 auto",
                  position: "relative",
                  background: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  cursor: "pointer"
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#111",
                  }}
                >
                  <video

                    onMouseOver={(e) => {
                      e.currentTarget.play();
                      e.currentTarget.playbackRate = 2.5;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    src={project.projectVidUrl}
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 0,
                      background: "#111",
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: "center", p: 0.5 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    fontSize={12}
                  >
                   {project.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Recently Rendered Videos */}
      {renders && renders.length > 0 && (
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 1, textAlign: "left" }}
          >
            Recently Rendered Videos
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "left" }}
          >
            Your latest video renders, ready to watch or download.
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pb: 1,
              maxWidth: { xs: "100vw", md: "1400px" },
              width: "100%",
              mx: "auto",
            }}
          >
            {renders.slice(0, 5).map((render) => (
              <Box
                key={render.id}
                sx={{
                  minWidth: 220,
                  maxWidth: 260,
                  flex: "0 0 auto",
                  position: "relative",
                  background: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #eee",
                  cursor:"pointer"
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#111",
                  }}
                >
                  {render.type === "mp4" || render.type === "webm" ? (
                    <video
                    muted
                      src={render.outputUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 0,
                        background: "#111",
                      }}
                      preload="metadata"
                      onMouseOver={(e) => {
                        e.currentTarget.play();
                        e.currentTarget.playbackRate = 2.5;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : render.type === "gif" ? (
                    <img
                      src={render.outputUrl}
                      alt="GIF Render"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 0,
                        background: "#111",
                      }}
                    />
                  ) : (
                    <span>Unknown type</span>
                  )}
                </Box>
                <Box sx={{ p: 0.5 }}>
                  <Typography fontWeight={400} fontSize={9} noWrap>
                    Rendered:{" "}
                    {render.renderedAt
                      ? new Date(render.renderedAt).toLocaleString()
                      : ""}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Explore label and Masonry-like Grid */}
      <Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1, textAlign: "left" }}
        >
          Explore our templates
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "left" }}
        >
          Browse all available templates to start your next project.
        </Typography>
      </Box>
      <Box
        sx={{
          columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
          columnGap: "16px",
        }}
      >
        {randomizedTemplates.map((template) => (
          <Box
            key={template.id}
            sx={{
              mb: 2,
              breakInside: "avoid",
            }}
          >
            <HomeTemplateCard
              label={template.name}
              description={template.description}
              onTry={onTry}
              hoverOverlay // <-- new prop for showing overlay
              size={template.size}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
