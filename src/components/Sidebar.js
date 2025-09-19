"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = ({ userRole }) => {
  console.log(userRole, "userRole");

  const [items, setItems] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    // if (!userRole) return;

    const fetchPermissions = async () => {
      try {
        const res = await fetch(`/api/permissions?role=${encodeURIComponent(userRole?.role)}`);
        if (!res.ok) throw new Error("Failed to fetch permissions");
        const data = await res.json();


        console.log(data , "apidata")
        
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPermissions();
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const activeSegment = segments[1] || "dashboard";

  {console.log(items , "itemsitems")}

  return (
    <aside className="bg-[#1e1e1e] border-r  border-[#2a2a2a] flex flex-col w-16 md:w-64 transition-all duration-300">
      <div className="px-6 py-4 text-xl font-bold text-white tracking-wide border-b border-[#2a2a2a] hidden md:block">
        HR Tool
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-3">
        {items.map((item) => {
          const Icon = Icons[item.icon];
          const fullHref = item.href.startsWith("/") ? `/dashboard${item.href}` : item.href;

          const hrefSegments = fullHref.split("/").filter(Boolean);
          const itemSegment = hrefSegments[1] || "dashboard";

          console.log({ fullHref, itemSegment, activeSegment });
          const isActive = activeSegment === itemSegment;

          return (
            <Link
              key={item.name}
              href={fullHref}
              className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors relative
                ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"}`}
            >
              {Icon && <Icon className="w-5 h-5 shrink-0" />}
              <span className="font-medium hidden md:inline">{item.name}</span>
              <span className="absolute md:hidden left-full ml-3 top-1/2 -translate-y-1/2
                pointer-events-none opacity-0 group-hover:opacity-100
                bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap
                shadow-lg transition-opacity duration-150">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

