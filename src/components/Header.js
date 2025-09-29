"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import flag from '../../public/images/flag.png';
import defaultAvatar from '../../public/images/admin.jpg'

const Header = ({ user }) => {
  return (
    <header className="  text-secondary-dark800 bg-secondary-light50 mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg ">
      <div className="py-4 px-6 sm:px-6 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
          Dashboard
        </h1>

        <div className="flex items-center space-x-2 sm:space-x-6">

          {/* <div className="relative w-[20px] h-[18px] md:w-[30px] md:h-[30px]">
            <Image
              src={flag}
              alt="country-flag"
              fill
              sizes="(max-width: 768px) 25px, 40px"
              className="rounded-full shadow-md cursor-pointer object-contain"
            />
          </div> */}

          <div className="relative">
            <button
              type="button"
              className="px-3 py-2 bg-primary-light50 text-primary-dark600 hover:bg-primary-dark600 hover:text-grey-50 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>


          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-3 border-secondary-dark600">
              <Image
                src={user.avatar || defaultAvatar} // fallback avatar
                alt={user.name || "User"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-secondary-dark800 font-medium">
              {user.name || "User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
