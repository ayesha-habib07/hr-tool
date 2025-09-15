"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p className="text-white">Loading...</p>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* sidebar */}
      <Sidebar userRole={user.role?.name || user.role || "Admin"} />

      {/* main content */}
      <div className="flex flex-col flex-1 overflow-auto bg-[#111]">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
