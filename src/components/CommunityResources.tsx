"use client";

import type { IconType } from "react-icons";
import { FaBookOpen, FaLink, FaTools } from "react-icons/fa";
import Link from "next/link";
import React from "react";

interface ResourceCard {
  icon: IconType;
  title: string;
  hint: string;
  href: string;
}

const cards: ResourceCard[] = [
  {
    icon: FaBookOpen,
    title: "Guides & Templates",
    hint: "Templates to structure your idea and experiment plans.",
    href: "/resources",
  },
  {
    icon: FaTools,
    title: "Starter Kits",
    hint: "Minimal checklists for early validation and prototyping.",
    href: "/resources",
  },
  {
    icon: FaLink,
    title: "External Tools",
    hint: "Recommended tools for landing pages, surveys, and analytics.",
    href: "/resources",
  },
];

export default function CommunityResources() {
  return (
    <section className="max-w-7xl mx-auto mt-8 mb-8">
      <div className="rounded-2xl surface-panel p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-theme text-center">Resources</h3>
        <p className="mt-2 text-sm text-theme-muted text-center">
          Useful links and starting points to turn ideas into testable experiments.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                href={card.href}
                className="block transform rounded-lg surface-card p-4 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-r from-purple-600 to-indigo-500 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-theme">{card.title}</div>
                    <div className="text-sm text-theme-muted">{card.hint}</div>
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
