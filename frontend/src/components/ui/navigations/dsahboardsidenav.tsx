import React, { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Fab,
  Menu,
  MenuItem,
} from "@mui/material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

export type DashboardSection = "home" | "templates" | "projects" | "renders";

interface DashboardSidebarNavProps {
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  onCreate?: () => void;
  userInitials?: string;
}

export const DashboardSidebarNav: React.FC<DashboardSidebarNavProps> = ({
  active,
  onChange,
  onCreate,
  userInitials = "U",
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    // redirect or refresh
    window.location.href = "/login"; // adjust route as needed
  };

  return (
    <Box
      sx={{
        width: 80,
        height: "100vh",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        borderRight: "1px solid rgba(0,0,0,0.08)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Create Button */}
      <Tooltip title="Create New" placement="right">
        <Fab
          color="primary"
          size="medium"
          onClick={onCreate}
          sx={{
            mb: 3,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Nav Items */}
      <List sx={{ flexGrow: 1, width: "100%" }}>
        {/* Home */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <Tooltip title="Home" placement="right">
            <ListItemButton
              selected={active === "home"}
              onClick={() => onChange("home")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{
                  variant: "caption",
                  fontSize: 12,
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Templates */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <Tooltip title="Templates" placement="right">
            <ListItemButton
              selected={active === "templates"}
              onClick={() => onChange("templates")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                <ViewModuleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Templates"
                primaryTypographyProps={{
                  variant: "caption",
                  fontSize: 12,
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Projects */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <Tooltip title="Projects" placement="right">
            <ListItemButton
              selected={active === "projects"}
              onClick={() => onChange("projects")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary="Saved"
                primaryTypographyProps={{
                  variant: "caption",
                  fontSize: 12,
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Renders */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <Tooltip title="Renders" placement="right">
            <ListItemButton
              selected={active === "renders"}
              onClick={() => onChange("renders")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                <VideoLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary="Renders"
                primaryTypographyProps={{
                  variant: "caption",
                  fontSize: 12,
                  textAlign: "center",
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>

      {/* Bottom User Profile with Menu */}
      <Box sx={{ pb: 2 }}>
        <Tooltip title="My Profile">
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
              {userInitials}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
