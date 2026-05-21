"use client";

import { FaBookOpen, FaLink, FaTools } from "react-icons/fa";
import Link from "next/link";

export default function CommunityResources() {
  const cards = [
    { icon: FaBookOpen, title: "Guides & Templates", hint: "Templates to structure your idea and experiment plans.", href: "/resources" },
    { icon: FaTools, title: "Starter Kits", hint: "Minimal checklists for early validation and prototyping.", href: "/resources" },
    { icon: FaLink, title: "External Tools", hint: "Recommended tools for landing pages, surveys, and analytics.", href: "/resources" },
  ];

  return (
    <section className="max-w-7xl mx-auto mt-8 mb-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 text-center">Resources</h3>
        <p className="mt-2 text-sm text-slate-600 text-center">Useful links and starting points to turn ideas into testable experiments.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                href={c.href}
                className="block transform rounded-lg border border-transparent bg-linear-to-br from-slate-50 to-white p-4 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-r from-purple-600 to-indigo-500 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{c.title}</div>
                    <div className="text-sm text-slate-600">{c.hint}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
