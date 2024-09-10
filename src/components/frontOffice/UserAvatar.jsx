"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
import Link from "next/link";
import { generateInitials } from "@/lib/generateInitials";
import { Button } from "../ui/button";

export default function UserAvatar({ user = {} }) {
  const { name, image } = user;
  const initials = generateInitials(name);
  const role = user?.role;
  const router = useRouter();
  async function handleLogout() {
    console.log("Logged Out");
    // await signOut();
    // router.push("/");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {image ? (
          <Image
            src="/profile.png"
            alt="User Profile"
            width={200}
            height={200}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full p-4 flex items-center justify-center dark:bg-slate-900 bg-slate-200 shadow-md dark:shadow-blue-800 border  border-blue-500 dark:text-slate-50 text-slate-700">
            {initials}
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="px-4 py-2 pr-8 dark:bg-slate-700 bg-gray-100">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-full hover:bg-lime-600 focus:bg-lime-600 transition-all duration-200 ">
          <Link href="/" className="flex items-center space-x-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Home</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-full hover:bg-lime-600 focus:bg-lime-600 transition-all duration-200 ">
          <Link href="/" className="flex items-center space-x-2">
            <Settings className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        {role === "CONSULTANT" && (
          <DropdownMenuItem className="rounded-full hover:bg-lime-600 focus:bg-lime-600 transition-all duration-200 ">
            <Link href="/" className="flex items-center space-x-2">
              <Settings className="mr-2 h-4 w-4" />
              <span>Consultant</span>
            </Link>
          </DropdownMenuItem>
        )}
        {role === "CLIENT" && (
          <DropdownMenuItem className="rounded-full hover:bg-lime-600 focus:bg-lime-600 transition-all duration-200 ">
            <Link href="/" className="flex items-center space-x-2">
              <Settings className="mr-2 h-4 w-4" />
              <span>Consultant</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="rounded-full hover:bg-lime-600 focus:bg-lime-600 transition-all duration-200 ">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
