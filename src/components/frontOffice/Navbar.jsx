"use client";
import { AlignJustify, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import ThemeSwitcherBtn from "../ui/ThemeSwitcherBtn";

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  //   const { data: session, status } = useSession();
  //   if (status === "loading") {
  //     <Loading />;
  //   }

  let status = "unauthenticated";

  const user = {
    name: "Bonnie Green",
    email: "name@gmail.com",
    image: "", // Replace with actual user image URL
  };

  const navMenuItems = [
    { title: "Home", href: "/" },
    { title: "Jobs", href: "/jobs" },
    { title: "Activity", href: "/activity" },
    { title: "Learning", href: "/learning" },
    // { title: "Contact", href: "/contact" },
  ];

  //   const userMenuItems = [
  //     { title: "Home", href: "/" },
  //     { title: "Profile", href: "/profile" },
  //     { title: "Sign Out", href: "/signout" },
  //   ];

  return (
    <nav className="bg-slate-200 border-slate-200 dark:bg-slate-700 fixed w-full z-40 top-0 start-0">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="/jobsnavigatorLogo.webp"
            alt="JOBSNAVIGATOR Logo"
            height={175}
            width={175}
          />
        </Link>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="flex gap-8">
            <ThemeSwitcherBtn />
            {/* login */}
            {status === "unauthenticated" ? (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-green-950  transition-all duration-200  hover:bg-slate-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-slate-700 dark:hover:text-white md:dark:hover:bg-transparent text-xl"
              >
                <User />
                <span>Login</span>
              </Link>
            ) : (
              <UserAvatar user={user} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:focus:ring-slate-600"
            aria-controls="navbar-user"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <AlignJustify className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`items-center justify-between ${
            menuOpen ? "flex" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-slate-100 rounded-lg bg-slate-200 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-slate-700 md:dark:bg-slate-700 dark:border-slate-700 text-xl">
            {navMenuItems.map(({ title, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className={`block py-2 px-3 rounded md:p-0 ${
                    router.pathname === href
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                      : "text-slate-900 hover:bg-slate-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-slate-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
