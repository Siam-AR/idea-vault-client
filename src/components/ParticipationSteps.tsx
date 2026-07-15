"use client";

import type { IconType } from "react-icons";
import { FaHandsHelping, FaHeart, FaUsers } from "react-icons/fa";
import React from "react";

interface StepItem {
  icon: IconType;
  title: string;
  text: string;
}

const steps: StepItem[] = [
  {
    icon: FaHandsHelping,
    title: "Share a Need",
    text: "Post a clear community challenge and explain who it affects most.",
  },
  {
    icon: FaUsers,
    title: "Invite Support",
    text: "Ask volunteers, neighbors, and local partners to join the effort.",
  },
  {
    icon: FaHeart,
    title: "Grow Together",
    text: "Use feedback and updates to strengthen the project and keep the community engaged.",
  },
];

export default function ParticipationSteps() {
  return (
    <section className="max-w-7xl mx-auto mt-10">
      <div className="rounded-2xl surface-panel-soft p-8 shadow-sm">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-theme">How It Works</h3>
          <p className="mt-2 text-sm text-theme-muted">
            A simple path to bring people together around a meaningful community project.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center rounded-xl surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute top-3 right-3 text-xs font-medium text-slate-300">0{index + 1}</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-blue-500 text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-sm font-semibold text-theme">{item.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-theme-muted">{item.text}</p>
                <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition text-[10px] text-indigo-600 dark:text-indigo-300">
                  Learn more →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
