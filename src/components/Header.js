import Image from "next/image";
import { Bell } from "lucide-react";
import flag  from '../../public/images/flag.png';
import admin from '../../public/images/admin.jpg';
const Header = () => {
    return (
        <>
            <header className="bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg">
                <div className="mx-w-7xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100">Dashboard</h1>
                    <div className="flex items-center space-x-3 sm:space-x-6">
                    <Image 
                        src={flag}
                        alt='country-flag'
                        width={25}
                        height={18}
                        className="rounded-full shadow-md cursor-pointer"
                    />
                    <div className="relative">
                        <Bell className='w-5 sm:w-6 h-5 sm:h-6  text-gray-300 cursor-pointer hover:text-white' />
                    </div>
                    
                    <div className="flex items-center space-x-2  sm:space-x-3 ">
                    <Image src={admin} alt="admin" width={30} height={25} className="rounded-full border border-gray-300" />
                    <span className="hidden sm:block text-gray-100 font-medium">Alice</span>

                    </div>

                    </div>


                </div>

            </header>
        </>

    )
}

export default Header