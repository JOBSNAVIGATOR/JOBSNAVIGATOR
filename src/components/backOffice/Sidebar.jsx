"use client";
import {
  Book,
  Briefcase,
  LogOut,
  PieChart,
  User2,
  UserCheck,
  UserCog2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  MdOutlineWork,
  FaChartPie,
  FaUsers,
  FaUsersGear,
  FaUserShield,
  FaBook,
} from "react-icons/md";

export default function Sidebar() {
  const pathname = usePathname();
  //   const { data: session, status } = useSession();
  //   if (status === "loading") {
  //     <Loading />;
  //   }

  const sideNavMenuItems = [
    { title: "Dashboard", href: "/dashboard", icon: PieChart },
    { title: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { title: "Candidates", href: "/dashboard/candidates", icon: User2 },
    { title: "Consultants", href: "/dashboard/consultants", icon: UserCog2 },
    { title: "Clients", href: "/dashboard/clients", icon: UserCheck },
    { title: "Learning", href: "/dashboard/learning", icon: Book },
  ];

  const router = useRouter();
  async function handleLogout() {
    // await signOut();
    console.log("logged out");
    router.push("/");
  }

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {sideNavMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="rounded-full hover:bg-lime-600 focus:bg-lime-600"
              >
                <Link
                  href={item.href}
                  className="flex items-center p-2 text-gray-900 dark:text-white dark:hover:bg-lime-300 dark:hover:text-gray-700 group rounded-full hover:bg-lime-300 focus:bg-lime-600"
                >
                  <Icon />
                  <span className="ms-3">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="py-2">
          <button
            onClick={handleLogout}
            className="bg-lime-600 rounded-full flex items-center space-x-3 px-6 py-3"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
