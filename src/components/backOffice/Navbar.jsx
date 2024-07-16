import { AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeSwitcherBtn from "../ui/ThemeSwitcherBtn";
import UserAvatar from "../frontOffice/UserAvatar";

export default function Navbar() {
  const user = {
    name: "Bonnie Green",
    email: "name@gmail.com",
    image: "", // Replace with actual user image URL
  };
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            {/* burger sign */}
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <AlignJustify
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
              />
            </button>
            {/* Logo */}
            <Link href="/" className="flex ms-2 md:me-24">
              <Image
                src="/jobsnavigatorLogo.webp"
                className="me-3"
                alt="FlowBite Logo"
                height={20}
                width={175}
              />
            </Link>
          </div>
          {/* <div className="flex items-center"> */}
          <div className="flex items-center ms-3 md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="flex gap-8">
              <ThemeSwitcherBtn />
              <UserAvatar user={user} />
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
}
