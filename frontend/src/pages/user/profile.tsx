import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

interface ProfilePageProps {
  username?: string;
  email?: string;
  createdAt?: string;
  mostUsedTemplate?: string;
  totalTemplates?: number;
  totalUploads?: number;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  username = "Tristan",
  email = "tristan@gmail.com",
  createdAt = "September 19, 2025",
  mostUsedTemplate = "Quote SpotLight Template",
  totalTemplates = 20,
  totalUploads = 78,
}) => {
  const navigate = useNavigate();

  // Username editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(username);

  // Password modal state
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {/* 🔹 Navbar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid #eee",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            background:
              "linear-gradient(to right, #d81b60 0%, #d81b60 70%, #42a5f5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          ViralMotion Creator
        </Typography>
      </Box>

      {/* 🔹 Full-width Holder Card (continuous with navbar) */}
      <Card
        sx={{
          width: "100%",
          borderRadius: 0,
          boxShadow: "none",
          borderTop: "1px solid #eee",
          p: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Profile Management Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Left Column: Picture Actions */}
          <Card
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: "2.5rem",
                bgcolor: "#ccc",
                border: "3px solid #eee",
              }}
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Button
              startIcon={<CameraAltIcon />}
              variant="outlined"
              size="small"
            >
              Change Picture
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
              size="small"
            >
              Delete Picture
            </Button>
          </Card>

          {/* Right Column: Edit Account */}
          <Card
            sx={{
              flex: 2,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "relative",
            }}
          >
            {/* Top row with Save/Cancel when editing */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Edit Account
              </Typography>

              {isEditingUsername && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setIsEditingUsername(false);
                      // TODO: Save logic here
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setIsEditingUsername(false);
                      setUsernameValue(username); // reset
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
            <Divider />

            {/* Username */}
            <TextField
              label="Username"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
              disabled={!isEditingUsername}
              InputProps={{
                endAdornment: !isEditingUsername && (
                  <IconButton
                    size="small"
                    onClick={() => setIsEditingUsername(true)}
                  >
                    <EditIcon fontSize="small" color="action" />
                  </IconButton>
                ),
              }}
            />

            {/* Email (non-editable) */}
            <TextField label="Email" value={email} disabled />

            {/* Change Password */}
            <Button
              variant="outlined"
              startIcon={<VpnKeyIcon />}
              sx={{ alignSelf: "flex-start" }}
              onClick={() => setOpenPasswordModal(true)}
            >
              Change Password
            </Button>
          </Card>
        </Box>

        {/* Stats Section */}
        <Card sx={{ p: 3, display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              ⭐ Most Used Template
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {mostUsedTemplate}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              📂 Created Templates
            </Typography>
            <Typography variant="h4" fontWeight={900} color="primary">
              {totalTemplates}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              ⬆️ Uploads
            </Typography>
            <Typography variant="h4" fontWeight={900} color="secondary">
              {totalUploads}
            </Typography>
          </Box>
        </Card>
      </Card>

      {/* 🔹 Password Change Modal */}
      <Dialog
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Change Password
          <IconButton
            aria-label="close"
            onClick={() => setOpenPasswordModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            type="password"
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
          />
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
