import React, { useState, useMemo, useEffect } from "react";
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
import { LoadingButton } from "@mui/lab";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { templatesWithTheirIds } from "../../data/templateids";
import { useProfileFileUpload } from "../../hooks/uploads/profileupload";
import { updateUsername } from "../../utils/usernameupdater";
import { updatePassword } from "../../utils/passwordupdater";

interface ProfilePageProps {
  userData: any;
  userDatasets: any[];
  projects: any[];
  userUploads: any[];
  renders: any[];
  fetchProfileDetails: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userData,
  userDatasets,
  userUploads,
  projects,
  renders,
  fetchProfileDetails,
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  const { uploadFile, isUploading } = useProfileFileUpload({
    type: "image",
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(userData.name);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const formattedDate = new Date(userData.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const [profilePic, setProfilePic] = useState<string | null>(
    userData.profilePicture || null
  );
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl) {
        setProfilePic(uploadedUrl);
      }
    }
  };

  const renderingHistoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    renders.forEach((r) => {
      if (!r.renderedAt) return;
      const date = new Date(r.renderedAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      counts[day] = (counts[day] || 0) + 1;
    });

    return Object.entries(counts).map(([day, renders]) => ({ day, renders }));
  }, [renders]);

  const templatesUsageData = useMemo(() => {
    const counts: Record<string, number> = {};
    renders.forEach((r) => {
      const templateId = r.templateId;
      if (!templateId) return;
      counts[templateId] = (counts[templateId] || 0) + 1;
    });

    return Object.entries(counts).map(([templateId, usage]) => ({
      templateId,
      template: templatesWithTheirIds[templateId],
      usage,
    }));
  }, [renders]);

  const mostUsedTemplate = useMemo(() => {
    if (templatesUsageData.length === 0)
      return "You have not used any template yet";

    const max = templatesUsageData.reduce((prev, curr) =>
      curr.usage > prev.usage ? curr : prev
    );

    return max.template;
  }, [templatesUsageData]);

  useEffect(() => {
    fetchProfileDetails();
  }, [profilePic]);

  useEffect(() => {
    if (userData?.name) {
      setUsernameValue(userData.name);
    }
  }, [userData]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", width: "100%", p: 1 }}>
      <Box
        sx={{
          maxWidth: "100%",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            p: { xs: 2, md: 4 },
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              src={profilePic || undefined}
              sx={{
                width: 90,
                height: 90,
                fontSize: "2rem",
                bgcolor: "#ccc",
                border: "3px solid #eee",
              }}
            >
              {!profilePic && userData.name.charAt(0).toUpperCase()}
            </Avatar>

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleProfilePicChange}
            />

            <LoadingButton
              size="small"
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              loading={isUploading}
              loadingPosition="start"
              startIcon={<CameraAltIcon fontSize="small" />}
            >
              Change Picture
            </LoadingButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                variant="standard"
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
                disabled={!isEditingUsername}
                sx={{
                  fontSize: "1.5rem",
                  minWidth: "150px",
                  maxWidth: "250px",
                }}
              />
              {!isEditingUsername ? (
                <IconButton
                  size="small"
                  onClick={() => setIsEditingUsername(true)}
                >
                  <EditIcon fontSize="small" color="action" />
                </IconButton>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LoadingButton
                    variant="contained"
                    size="small"
                    loading={isUpdatingUsername}
                    onClick={async () => {
                      setIsUpdatingUsername(true);
                      try {
                        const result = await updateUsername(usernameValue);
                        if (result === "success") {
                          alert("Username updated");
                        } else {
                          alert("There was an error updating your username");
                        }
                      } finally {
                        setIsUpdatingUsername(false);
                        setIsEditingUsername(false);
                      }
                    }}
                  >
                    Save
                  </LoadingButton>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setIsEditingUsername(false);
                      setUsernameValue(userData.name);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {userData.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Joined at {formattedDate}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<VpnKeyIcon />}
            onClick={() => setOpenPasswordModal(true)}
          >
            Change Password
          </Button>
        </Card>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Card
            sx={{
              flex: 0.7,
              p: 5,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Your Data
            </Typography>
            <Divider />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                ⭐ Most Used Template
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mostUsedTemplate}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                📂 Created Templates
              </Typography>
              <Typography variant="h5" fontWeight={900} color="primary">
                {projects.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                ⬆️ Uploads
              </Typography>
              <Typography variant="h5" fontWeight={900} color="secondary">
                {userUploads.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                📊 Number Datasets
              </Typography>
              <Typography variant="h5" fontWeight={900} color="success.main">
                {userDatasets.length}
              </Typography>
            </Box>
          </Card>

          <Card
            sx={{
              flex: 2.3,
              p: 5,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              History
            </Typography>
            <Divider />

            <Box sx={{ flex: 1, minHeight: 200 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                Rendering History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This graph shows the quantity of videos you have rendered since
                day 1.
              </Typography>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={renderingHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="renders"
                    stroke="#1976d2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ flex: 1, minHeight: 200, my: 10 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                Templates Usage Comparison
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This graph shows the comparison of the templates you have been
                using and rendering since day 1.
              </Typography>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={templatesUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="template" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#d81b60"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Box>
      </Box>

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
            type={showOldPassword ? "text" : "password"}
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowOldPassword((prev) => !prev)}>
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <TextField
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <TextField
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={isUpdatingPassword}
            onClick={async () => {
              if (newPassword !== confirmPassword) {
                alert("Passwords do not match");
                return;
              }

              setIsUpdatingPassword(true);
              try {
                const result = await updatePassword(oldPassword, newPassword);
                if (result === "success") {
                  alert("Password updated successfully");
                  setOpenPasswordModal(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                } else {
                  alert(result);
                }
              } finally {
                setIsUpdatingPassword(false);
              }
            }}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
