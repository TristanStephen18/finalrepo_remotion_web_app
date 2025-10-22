import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiEdit2,
  FiCamera,
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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
import { templatesWithTheirIds } from "../../data/TemplateIds";
import { updateUsername } from "../../utils/UsernameUpdater";
import { updatePassword } from "../../utils/PasswordUpdater";
import { useProfileFileUpload } from "../../hooks/uploads/ProfileUpload";
import toast from "react-hot-toast";

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
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(userData.name);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const { uploadFile, isUploading } = useProfileFileUpload({ type: "image" });
  const [profilePic, setProfilePic] = useState(userData.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formattedDate = new Date(userData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // ==== Data ====
  const renderingHistoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    renders.forEach((r) => {
      if (!r.renderedAt) return;
      const day = new Date(r.renderedAt).toLocaleDateString("en-US", {
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
      if (!r.templateId) return;
      counts[r.templateId] = (counts[r.templateId] || 0) + 1;
    });
    return Object.entries(counts).map(([templateId, usage]) => ({
      templateId,
      template: templatesWithTheirIds[templateId],
      usage,
    }));
  }, [renders]);

  const mostUsedTemplate = templatesUsageData.length
    ? templatesUsageData.reduce((prev, curr) =>
        curr.usage > prev.usage ? curr : prev
      ).template
    : "No templates used yet.";

  useEffect(() => {
    fetchProfileDetails();
  }, [profilePic]);

  // ==== Profile Picture Upload ====
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadFile(file);
      if (uploadedUrl) setProfilePic(uploadedUrl);
    }
  };

  // ==== UI ====
  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ==== Header ==== */}
      <motion.div
        layout
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-pink-50 opacity-60" />
        <div className="relative flex flex-col items-center gap-3 z-10">
          <div className="relative group">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 shadow transition"
            >
              {isUploading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="4" />
                </svg>
              ) : (
                <FiCamera size={16} />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-1 z-10">
          <div className="flex items-center gap-3">
            {isEditingUsername ? (
              <input
                type="text"
                value={usernameValue}
                onChange={(e) => setUsernameValue(e.target.value)}
                className="text-2xl font-semibold border-b-2 border-indigo-500 focus:outline-none bg-transparent"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">
                {usernameValue}
              </h2>
            )}
            {!isEditingUsername ? (
              <button
                onClick={() => setIsEditingUsername(true)}
                className="text-gray-400 hover:text-indigo-500 transition"
              >
                <FiEdit2 />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setIsUpdatingUsername(true);
                    try {
                      const res = await updateUsername(usernameValue);
                      if (res === "success") toast.success("Username updated!");
                    } finally {
                      setIsUpdatingUsername(false);
                      setIsEditingUsername(false);
                    }
                  }}
                  className="px-3 py-1 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 text-sm"
                >
                  {isUpdatingUsername ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditingUsername(false)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-500 mt-1">{userData.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Joined {formattedDate}
          </p>
        </div>

        <button
          onClick={() => setOpenPasswordModal(true)}
          className="z-10 border border-gray-200 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-50 transition"
        >
          <FiLock /> Change Password
        </button>
      </motion.div>

      {/* ==== Stats ==== */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        layout
      >
        {[
          { label: "Most Used Template", value: mostUsedTemplate, icon: <FiTrendingUp />, color: "text-indigo-600" },
          { label: "Created Templates", value: projects.length, icon: <FiPieChart />, color: "text-pink-500" },
          { label: "Uploads", value: userUploads.length, icon: <FiCamera />, color: "text-purple-500" },
          { label: "Datasets", value: userDatasets.length, icon: <FiTrendingUp />, color: "text-green-500" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ==== Charts ==== */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Rendering History</h3>
          <p className="text-sm text-gray-500 mb-4">Your daily render count.</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={renderingHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="renders" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Template Usage</h3>
          <p className="text-sm text-gray-500 mb-4">Frequency of template usage.</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={templatesUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="template" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="usage" stroke="#EC4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ==== Password Modal ==== */}
      <AnimatePresence>
        {openPasswordModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setOpenPasswordModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              {["old", "new", "confirm"].map((field) => (
                <div key={field} className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1 capitalize">
                    {field === "old"
                      ? "Old Password"
                      : field === "new"
                      ? "New Password"
                      : "Confirm Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field as keyof typeof showPassword] ? "text" : "password"}
                      value={passwords[field as keyof typeof passwords]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [field]: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [field]: !prev[field as keyof typeof prev],
                        }))
                      }
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword[field as keyof typeof showPassword] ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpenPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (passwords.new !== passwords.confirm)
                      return toast.error("Passwords do not match");
                    setIsUpdatingPassword(true);
                    try {
                      const res = await updatePassword(passwords.old, passwords.new);
                      if (res === "success") {
                        toast.success("Password updated successfully!");
                        setOpenPasswordModal(false);
                      }
                    } finally {
                      setIsUpdatingPassword(false);
                    }
                  }}
                  className="px-5 py-2 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 text-sm"
                >
                  {isUpdatingPassword ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
