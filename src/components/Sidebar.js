// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import * as Icons from "lucide-react";
// import { useState, useEffect } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// const Sidebar = ({ userRole }) => {
//   console.log(userRole, "userRole");

//   const [items, setItems] = useState([]);
//   const pathname = usePathname();

//   useEffect(() => {
//     // if (!userRole) return;

//     const fetchPermissions = async () => {
//       try {
//         const res = await fetch(`/api/permissions?role=${encodeURIComponent(userRole?.role)}`);
//         if (!res.ok) throw new Error("Failed to fetch permissions");
//         const data = await res.json();


//         // console.log(data, "apidata");
//         setItems(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   const segments = pathname.split("/").filter(Boolean);
//   const activeSegment = segments[1] || "dashboard";

//   // { console.log(items, "itemsitems") }

//   return (
//     <aside className="text-gray-400 p-4  flex flex-col w-24 md:w-64 transition-all duration-300 ">
//       {/* <div className="px-6 py-4 text-xl font-bold text-secondary-dark800 tracking-wide hidden md:block">
//         HR Tool
//       </div> */}
//       <nav className="flex-1 overflow-y-auto p-2 space-y-3">
//         {items.map((item) => {
//           const Icon = Icons[item.icon];
//           const fullHref = item.href.startsWith("/") ? `/dashboard${item.href}` : item.href;

//           const hrefSegments = fullHref.split("/").filter(Boolean);
//           const itemSegment = hrefSegments[1] || "dashboard";

//           {/* console.log({ fullHref, itemSegment, activeSegment }); */}
//           const isActive = activeSegment === itemSegment;

//           return (
//             <Link
//               key={item.name}
//               href={fullHref}
//               className={`group flex items-center gap-3 px-4 py-4 rounded-lg transition-colors relative
//                 ${isActive ? "bg-secondary-light50 text-secondary-dark800" : "text-grey-700 hover:bg-secondary-light50 hover:text-secondary-dark800"}`}
//             >
//               {Icon && <Icon className="w-5 h-5 shrink-0" />}
//               <span className="font-medium hidden md:inline">{item.name}</span>
//               <span className="absolute md:hidden left-full ml-3 top-1/2 -translate-y-1/2
//                 pointer-events-none opacity-0 group-hover:opacity-100
//                 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap
//                 shadow-lg transition-opacity duration-150">
//                 {item.name}
//               </span>
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Sidebar = ({ userRole }) => {
  const [items, setItems] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(
          `/api/permissions?role=${encodeURIComponent(userRole?.role)}`
        );
        if (!res.ok) throw new Error("Failed to fetch permissions");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPermissions();
  }, [userRole]);

  const segments = pathname.split("/").filter(Boolean);
  const activeSegment = segments[1] || "dashboard";

  return (
    <div className="flex flex-col h-full w-24 md:w-64 border-r bg-white pt-4">
      <ScrollArea className="flex-1 h-full">
        <nav className="p-4 space-y-2">
          {items.map((item, index) => {
            const Icon = Icons[item.icon];
            const fullHref = item.href.startsWith("/")
              ? `/dashboard${item.href}`
              : item.href;

            const hrefSegments = fullHref.split("/").filter(Boolean);
            const itemSegment = hrefSegments[1] || "dashboard";
            const isActive = activeSegment === itemSegment;

            return (
              <div key={item.name}>
                <Link
                  href={fullHref}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                    ${isActive
                      ? "bg-secondary-light50 text-secondary-dark800"
                      : "text-gray-700 hover:bg-secondary-light50 hover:text-secondary-dark800"
                    }`}
                >
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  <span className="font-medium hidden md:inline">{item.name}</span>

                  {/* Tooltip for collapsed sidebar */}
                  <span
                    className="absolute md:hidden left-full ml-3 top-1/2 -translate-y-1/2
                    pointer-events-none opacity-0 group-hover:opacity-100
                    bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap
                    shadow-lg transition-opacity duration-150"
                  >
                    {item.name}
                  </span>
                </Link>

                {/* Add separator except after the last item */}
                {index < items.length - 1 && <Separator className="my-2" />}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
