"use client";

import type { IconType } from "react-icons";
import { FaBolt, FaChartLine, FaRocket } from "react-icons/fa";
import React from "react";

interface HighlightItem {
  icon: IconType;
  title: string;
  desc: string;
}

const items: HighlightItem[] = [
  {
    icon: FaBolt,
    title: "Pitch Clearly",
    desc: "Structure ideas into concise problem and solution statements.",
  },
  {
    icon: FaChartLine,
    title: "Measure Interest",
    desc: "Track early signals like comments and saves to gauge traction.",
  },
  {
    icon: FaRocket,
    title: "Plan Experiments",
    desc: "Design small tests to validate assumptions before building.",
  },
  {
    icon: FaBolt,
    title: "Iterate Fast",
    desc: "Use feedback to refine scope and prioritize features.",
  },
  {
    icon: FaChartLine,
    title: "Share Progress",
    desc: "Post updates to keep the community engaged and informed.",
  },
  {
    icon: FaRocket,
    title: "Stay Concise",
    desc: "Keep descriptions short so readers can quickly grasp the idea.",
  },
];

export default function InfoHighlights() {
  return (
    <section className="max-w-7xl mx-auto mt-12">
      <div className="rounded-2xl surface-panel-soft p-8 shadow-sm">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-theme">Quick Tips</h3>
          <p className="mt-2 text-sm text-theme-muted">
            Short, actionable recommendations to get more useful feedback.
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
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm">
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
