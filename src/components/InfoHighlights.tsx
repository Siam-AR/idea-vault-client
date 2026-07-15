"use client";

import type { IconType } from "react-icons";
import { FaHandsHelping, FaHeart, FaLeaf, FaUsers } from "react-icons/fa";
import React from "react";

interface HighlightItem {
  icon: IconType;
  title: string;
  desc: string;
}

const items: HighlightItem[] = [
  {
    icon: FaHandsHelping,
    title: "Start With a Need",
    desc: "Describe the community challenge clearly so supporters understand the purpose.",
  },
  {
    icon: FaUsers,
    title: "Invite Local Support",
    desc: "Share the project with volunteers, neighbors, and community leaders who can help.",
  },
  {
    icon: FaLeaf,
    title: "Focus on Impact",
    desc: "Center your idea on practical outcomes that improve daily life and shared spaces.",
  },
  {
    icon: FaHeart,
    title: "Show Care",
    desc: "Use warm, clear language that makes people feel connected to the mission.",
  },
  {
    icon: FaHandsHelping,
    title: "Share Progress",
    desc: "Post updates so the community can follow the journey and stay involved.",
  },
  {
    icon: FaUsers,
    title: "Build Together",
    desc: "Keep your description short and welcoming so more people can join in.",
  },
];

export default function InfoHighlights() {
  return (
    <section className="max-w-7xl mx-auto mt-12">
      <div className="rounded-2xl surface-panel-soft p-8 shadow-sm">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-theme">Community Tips</h3>
          <p className="mt-2 text-sm text-theme-muted">
            Simple ways to present a project so it feels practical, welcoming, and worth supporting.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className="group relative flex gap-4 rounded-xl surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-linear-to-tr from-emerald-500 to-amber-500 text-white shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-theme">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-theme-muted">{item.desc}</p>
                </div>

                <span className="absolute right-3 top-3 hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 group-hover:block dark:bg-slate-800 dark:text-slate-300">
                  Tip
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
