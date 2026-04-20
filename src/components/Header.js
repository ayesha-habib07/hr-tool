"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import defaultAvatar from '../../public/images/admin.jpg'
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";



import logo from '../../public/images/Gemini_Generated_Image_17sz717sz717sz71.png'


const Header = ({ user }) => {
  const router = useRouter();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const normalizedRole = (user?.role || "").toString().trim().toLowerCase();

  const roleMenuItems = useMemo(() => {
    if (normalizedRole.includes("admin")) {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Employees", href: "/dashboard/employees" },
        { label: "Departments", href: "/dashboard/departments" },
        { label: "Projects", href: "/dashboard/projects" },
        { label: "Reports", href: "/dashboard/reports" },
        { label: "Settings", href: "/dashboard/settings" },
      ];
    }

    if (normalizedRole.includes("project") && normalizedRole.includes("manager")) {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Team Members", href: "/dashboard/team-members" },
        { label: "Tasks", href: "/dashboard/tasks" },
        { label: "Projects", href: "/dashboard/projects" },
        { label: "Reports", href: "/dashboard/reports" },
      ];
    }

    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Tasks", href: "/dashboard/tasks" },
      { label: "Attendance", href: "/dashboard/attendance" },
      { label: "Settings", href: "/dashboard/settings" },
    ];
  }, [normalizedRole]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });  //clear cookie on server
      router.push('/');
    } catch (err) {
      console.error('Logout failed!', err);
    }

  }

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file.");
      event.target.value = "";
      return;
    }

    // Keep image payload controlled since this is stored as a data URL.
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Image size must be 2MB or less.");
      event.target.value = "";
      return;
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(selectedFile);
    }).catch(() => null);

    if (!dataUrl) {
      alert("Could not read selected file.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: dataUrl }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Failed to update profile image");
      }

      setAvatarUrl(payload?.user?.avatar || dataUrl);
      setIsRoleMenuOpen(false);
    } catch (err) {
      console.error("Profile image update failed:", err);
      alert(err?.message || "Failed to update profile image.");
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  return (
    <header className=" text-secondary-dark800 bg-white mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg ">
      <div className="px-6 sm:px-6 flex justify-between items-center">
        <div className="">
          <Image
            src={logo}
            width={65}
            height={65}
            className="w-full h-full object-cover"
            alt="HR tool"

          />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-6">

         

          <div className="relative flex gap-3">
            <button
              type="button"
              className="px-3 py-2 bg-primary-light50 text-primary-dark600 hover:bg-primary-dark600 hover:text-grey-50 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 bg-secondary-light50 text-secondary-dark600 hover:bg-secondary-dark600 hover:text-grey-50 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>


          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 sm:space-x-3 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-3 border-secondary-dark600">
                <Image
                  src={avatarUrl || user.avatar || defaultAvatar}
                  alt={user.name || "User"}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden sm:block text-secondary-dark800 font-medium">
                {user.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-secondary-dark600" />
            </button>

            {isRoleMenuOpen ? (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                <div className="px-3 pb-2 mb-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-semibold text-secondary-dark800">
                    {user?.role || "Employee"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePickAvatar}
                  disabled={isUploadingAvatar}
                  className="w-full text-left px-3 py-2 text-sm text-secondary-dark700 hover:bg-secondary-light50 disabled:opacity-60"
                >
                  {isUploadingAvatar ? "Uploading..." : "Change Profile Image"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {roleMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsRoleMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-secondary-dark700 hover:bg-secondary-light50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
