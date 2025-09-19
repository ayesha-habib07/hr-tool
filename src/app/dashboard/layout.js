"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout({ children, showHeader = true  }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  // const pathname = usePathname();
  //   // hide header for /pages routes
  // const hideHeader = pathname?.startsWith("/pages");


  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();

        console.log(data , "data")
        setUser(data.user);
      } catch (err) {
        router.push("/login");
      }
    };
    fetchUser();
  }, []);

  console.log(user , "user")
  if (!user) return <p className="text-white">Loading...</p>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* sidebar */}

      {console.log(user , "items")}
      <Sidebar userRole={user} />

      {/* main content */}
      <div className="flex flex-col flex-1 overflow-auto bg-[#111]">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
