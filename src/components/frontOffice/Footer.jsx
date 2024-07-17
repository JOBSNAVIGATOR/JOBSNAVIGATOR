"use client";
import { GitBranchPlus, Github, Linkedin } from "lucide-react";
import { FaGithub, FaLinkedin, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import DeveloperFooter from "../ui/DeveloperFooter";

const Footer = () => {
  const footerMenuItems = [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Careers", href: "/careers" },
    { title: "Terms & Condition", href: "#" },
    { title: "Privacy Policy", href: "#" },
  ];
  return (
    <section className="py-2 bg-slate-200 sm:pt-16 lg:pt-17 dark:bg-slate-700 shadow-lg dark:shadow-blue-400 mb-4">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-green-950 dark:text-slate-100">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <Image
              src="/jobsnavigatorLogo.webp"
              alt=""
              width={200}
              height={200}
            />

            <p className="text-base leading-relaxed mt-7">
              Navigating Your Career, One Job at a Time
            </p>
            <p className="text-base leading-relaxed">
              JobsNavigator : Your Path to Success !
            </p>
            {/* icons */}
            <ul className="flex items-center space-x-3 mt-9">
              <li>
                <Link
                  href="#"
                  target="_blank"
                  title=""
                  className="flex items-center justify-center transition-all duration-200  rounded-full w-7 h-7 hover:bg-lime-600 focus:bg-lime-600"
                >
                  <FaTwitter className="w-4 h-4" fill="currentColor" />
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_JOBSNAVIGATOR_LINKEDIN_URL}
                  target="_blank"
                  title=""
                  className="flex items-center justify-center transition-all duration-200  rounded-full w-7 h-7 hover:bg-lime-600 focus:bg-lime-600"
                >
                  <FaLinkedinIn className="w-4 h-4" fill="currentColor" />
                </Link>
              </li>
            </ul>
          </div>

          {/* employes */}
          <div>
            <p className="text-sm font-semibold tracking-widest  uppercase">
              Employers
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Post Job{" "}
                </Link>
              </li>
            </ul>
          </div>

          {/* about , career, t&c, privacy policy */}
          <div>
            <p className="text-sm font-semibold tracking-widest  uppercase">
              JOBSNAVIGATOR
            </p>

            <ul className="mt-6 space-y-4">
              {footerMenuItems.map((item) => {
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      title=""
                      className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                    >
                      {" "}
                      {item.title}{" "}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Subscribe to Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest uppercase">
              Subscribe to newsletter
            </p>

            <form action="#" method="POST" className="mt-6">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-lime-600 caret-lime-600"
                />
              </div>
              <Button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold transition-all duration-200 bg-lime-600 rounded-lg hover:bg-lime-700 focus:bg-lime-700"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 dark:border-gray-200 border-gray-700" />
        {/* Developer Footer */}
        <DeveloperFooter />
      </div>
    </section>
  );
};
export default Footer;
