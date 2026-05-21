import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="relative mt-24 overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-xl font-black text-slate-900">
                V
              </div>
              <h2 className="text-2xl font-black tracking-tight">IdeaVault</h2>
            </div>

            <p className="text-sm leading-7 text-gray-400">
              Share startup ideas, get thoughtful feedback, and refine concepts
              with a collaborative community of builders.
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
                <Link href="/ideas" className="transition hover:text-cyan-400">
                  Ideas
                </Link>
              </li>
              <li>
                <Link
                  href="/my-interactions"
                  className="transition hover:text-cyan-400"
                >
                  My Interactions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Idea Topics</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="cursor-pointer transition hover:text-blue-400">Tech</li>
              <li className="cursor-pointer transition hover:text-blue-400">AI</li>
              <li className="cursor-pointer transition hover:text-blue-400">Health</li>
              <li className="cursor-pointer transition hover:text-blue-400">Education</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-lg font-semibold">Contact</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <p>Email: support@ideavault.app</p>
              <p>Phone: +880 1234-567890</p>
              <p>Location: Dhaka, Bangladesh</p>
            </div>

            <Link
              href="/ideas"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-105"
            >
              Explore Ideas
            </Link>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} IdeaVault - All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
