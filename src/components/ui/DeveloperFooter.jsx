import { Linkedin } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";

export default function DeveloperFooter() {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        <Link
          href={process.env.NEXT_PUBLIC_DEVELOPER_PORTFOLIO_URL}
          className="hover:underline"
          target="_blank"
        >
          Developed & Maintained by - {process.env.NEXT_PUBLIC_DEVELOPER_NAME}
        </Link>
      </span>
      <div className="flex mt-4 sm:justify-center sm:mt-0">
        <Link
          href={process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN_URL}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          target="_blank"
        >
          <Linkedin
            className="w-6 h-5"
            aria-hidden="true"
            fill="currentColor"
          />
          <span className="sr-only">LinkedIn page</span>
        </Link>
        {/* github */}
        <Link
          href={process.env.NEXT_PUBLIC_DEVELOPER_GITHUB_URL}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          target="_blank"
        >
          <FaGithub
            className="w-6 h-5"
            aria-hidden="true"
            fill="currentColor"
          />
          <span className="sr-only">GitHub account</span>
        </Link>
      </div>
    </div>
  );
}
