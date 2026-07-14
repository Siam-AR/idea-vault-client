"use client";

import type { IconType } from "react-icons";
import { FaClipboardList, FaComments, FaThumbsUp } from "react-icons/fa";
import React from "react";

interface StepItem {
  icon: IconType;
  title: string;
  text: string;
}

const steps: StepItem[] = [
  {
    icon: FaClipboardList,
    title: "Post Concisely",
    text: "Create a clear title and short description so others can quickly understand your idea.",
  },
  {
    icon: FaComments,
    title: "Request Feedback",
    text: "Ask specific questions in your post to get targeted suggestions from the community.",
  },
  {
    icon: FaThumbsUp,
    title: "Iterate & Share",
    text: "Apply feedback, update your idea, and share progress to attract collaborators.",
  },
];

export default function ParticipationSteps() {
  return (
    <section className="max-w-7xl mx-auto mt-10">
      <div className="rounded-2xl surface-panel-soft p-8 shadow-sm">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-theme">Participation Steps</h3>
          <p className="mt-2 text-sm text-theme-muted">
            A simple sequence to get meaningful engagement from the community.
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
