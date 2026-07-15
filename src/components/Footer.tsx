import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-black text-slate-900">
                CS
              </div>
              <h2 className="text-2xl font-black tracking-tight">Community Spark</h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              Share community projects, invite support, and grow practical ideas
              that make neighborhoods and local groups stronger.
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-blue-600"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-pink-500"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-slate-700"
              >
                <FaXTwitter size={16} />
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-blue-500"
              >
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition hover:text-cyan-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-cyan-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="transition hover:text-emerald-400">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/resources" className="transition hover:text-emerald-400">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-emerald-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Community Topics</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="cursor-pointer transition hover:text-emerald-400">Education</li>
              <li className="cursor-pointer transition hover:text-emerald-400">Environment</li>
              <li className="cursor-pointer transition hover:text-emerald-400">Health</li>
              <li className="cursor-pointer transition hover:text-emerald-400">Community Welfare</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Contact</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p>Email: hello@communityspark.org</p>
              <p>Phone: +880 1234-567890</p>
              <p>Location: Dhaka, Bangladesh</p>
            </div>

            <Link href="/about" className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-amber-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition duration-300 hover:scale-105">
              Learn More
            </Link>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} Community Spark - All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
            <Link href="/resources" className="transition hover:text-white">
              Resources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
