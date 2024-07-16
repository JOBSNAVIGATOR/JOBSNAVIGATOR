"use client";
import { GitBranchPlus, Github, Linkedin } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Footer = () => {
  return (
    <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24 dark:bg-slate-700 shadow-lg dark:shadow-blue-400 mb-4">
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
              JobsNavigator: Your Path to Success!
            </p>

            <ul className="flex items-center space-x-3 mt-9">
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex items-center justify-center transition-all duration-200  rounded-full w-7 h-7 hover:bg-lime-600 focus:bg-lime-600"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
                  </svg>
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex items-center justify-center transition-all duration-200  rounded-full w-7 h-7 hover:bg-lime-600 focus:bg-lime-600"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                  </svg>
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex items-center justify-center  transition-all duration-200 rounded-full w-7 h-7 hover:bg-lime-600 focus:bg-lime-600"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                    <circle cx="16.806" cy="7.207" r="1.078"></circle>
                    <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"></path>
                  </svg>
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex items-center justify-center  transition-all duration-200 rounded-full w-7 h-7 hover:bg-lime-600 focus:bg-lime-600"
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                    ></path>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest  uppercase">
              Company
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  About{" "}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Features{" "}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Works{" "}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Career{" "}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest uppercase">
              Help
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Customer Support{" "}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Delivery Details{" "}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Terms & Conditions{" "}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  title=""
                  className="flex text-base transition-all duration-200 hover:text-lime-600 focus:text-lime-600"
                >
                  {" "}
                  Privacy Policy{" "}
                </Link>
              </li>
            </ul>
          </div>

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

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold transition-all duration-200 bg-lime-600 rounded-md hover:bg-lime-700 focus:bg-lime-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />
        {/* Developer Footer */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-lg text-gray-500 sm:text-center dark:text-gray-400">
            <Link
              href={process.env.NEXT_PUBLIC_DEVELOPER_PORTFOLIO_URL}
              className="hover:underline"
              target="_blank"
            >
              Developed & Maintained by -{" "}
              {process.env.NEXT_PUBLIC_DEVELOPER_NAME}
            </Link>
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link
              href={process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN_URL}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
            >
              <Linkedin
                className="w-8 h-6"
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
                className="w-8 h-6"
                aria-hidden="true"
                fill="currentColor"
              />
              {/* <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                  clip-rule="evenodd"
                />
              </svg> */}
              <span className="sr-only">GitHub account</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Footer;
