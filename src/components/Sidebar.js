"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import navListData from "../data/navListData.json";
import * as Icons from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  // Extract current active section
  const segments = pathname.split("/").filter(Boolean);
  const activeSegment = segments[1] || "dashboard";

  return (
    <aside className="bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col
      w-16 md:w-64 transition-all duration-300">
    
      <div className="px-6 py-4 text-xl font-bold text-white tracking-wide border-b border-[#2a2a2a] hidden md:block">
        HR Tool
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-3">
        {navListData.sidebarItems.map((item) => {
          const Icon = Icons[item.icon];
          const fullHref = item.href.startsWith("/")
            ? `/dashboard${item.href}`
            : item.href;

          const hrefSegments = fullHref.split("/").filter(Boolean);
          const itemSegment = hrefSegments[1] || "dashboard";

          const isActive = activeSegment === itemSegment;

          return (
            <Link
              key={item.name}
              href={fullHref}
              className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors relative
                ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"}`}
            >
              {/* Icon */}
              {Icon && <Icon className="w-5 h-5 shrink-0" />}

              {/* Label: hidden on small screens */}
              <span className="font-medium hidden md:inline">{item.name}</span>

              {/* Tooltip for small screens */}
               <span
                className="absolute md:hidden left-full ml-3 top-1/2 -translate-y-1/2
                           pointer-events-none opacity-0 group-hover:opacity-100
                           bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap
                           shadow-lg transition-opacity duration-150"
              >
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
