import { Box, IconButton, Typography } from "@mui/material";
import { MenuIcon } from "lucide-react";
import type React from "react";

interface SideBarHeaderInterface {
  collapsed: boolean;
  title: string;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SideBarHearder: React.FC<SideBarHeaderInterface> = ({
  title,
  collapsed,
  setCollapsed,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        p: 2,
        borderBottom: "1px solid #eee",
      }}
    >
      {collapsed ? (
        <IconButton onClick={() => setCollapsed(false)}>
          <MenuIcon />
        </IconButton>
      ) : (
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};
