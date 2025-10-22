import React, { useState } from "react";
import {
  FiHome,
  FiFolder,
  FiGrid,
  FiFilm,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import "../../../assets/Logo.css";

export type DashboardSection =
  | "home"
  | "templates"
  | "files"
  | "renders"
  | "profile";

interface DashboardSidebarNavProps {
  userPfp: string | null;
  active: DashboardSection;
  onChange: (section: DashboardSection) => void;
  userInitials?: string;
}

export const DashboardSidebarNav: React.FC<DashboardSidebarNavProps> = ({
  active,
  onChange,
  userPfp,
  userInitials = "U",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navItems = [
    { id: "home", label: "Home", icon: <FiHome /> },
    { id: "templates", label: "My templates", icon: <FiGrid /> },
    { id: "files", label: "My files", icon: <FiFolder /> },
    { id: "renders", label: "My Renders", icon: <FiFilm /> },
  ] as const;

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 z-50">
        <div className="flex items-center gap-2">
          <span className="logo__dot"></span>
          <div className="flex flex-col leading-tight">
            <span className="logo__text text-lg text-gray-800 font-bold">
              ViralMotion
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">
              Create. Edit. Inspire.
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* SIDEBAR (desktop) */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex-col justify-between py-5 shadow-sm z-40">
        {/* Logo section */}
        <div
          className="flex flex-col gap-2 px-5 mb-6 cursor-pointer"
          onClick={() => onChange("home")}
        >
          <div className="flex items-center gap-2">
            <span className="logo__dot"></span>
            <span className="logo__text text-lg text-gray-800">ViralMotion</span>
          </div>
          <span className="text-xs text-gray-500 font-medium tracking-wide ml-[50px]">
            Create. Edit. Inspire.
          </span>

          {/* Divider under logo */}
          <div className="border-b border-gray-100 mt-3"></div>
        </div>

        <nav className="flex flex-col flex-1 space-y-1 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile section */}
        <div className="px-4 mt-4 border-t border-gray-100 pt-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 w-full hover:bg-gray-50 rounded-lg p-2 transition"
          >
            {userPfp ? (
              <img
                src={userPfp}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                {userInitials}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-gray-800">My Account</span>
              <span className="text-xs text-gray-500">Manage profile</span>
            </div>
          </button>

          {menuOpen && (
            <div className="absolute bottom-20 left-4 bg-white shadow-md rounded-lg border border-gray-100 w-48 text-left z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onChange("profile");
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiUser /> View Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="logo flex flex-col gap-[2px]">
            <div className="flex items-center gap-2">
              <span className="logo__dot"></span>
              <span className="logo__text text-lg text-gray-800">ViralMotion</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide ml-[26px]">
              Create. Edit. Inspire.
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-500">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              onChange("profile");
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiUser className="text-xl" /> View Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <FiLogOut className="text-xl" /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};
