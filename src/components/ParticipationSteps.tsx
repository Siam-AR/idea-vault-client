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
    <section className="w-full bg-[var(--surface-elevated)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)]">Participation Steps</h3>
          <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] max-w-2xl mx-auto">
            A simple sequence to get meaningful engagement from the community.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center rounded-2xl bg-[var(--surface-base)] border border-[var(--border-card)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-[0_4px_20px_rgba(44,94,173,0.05)]"
              >
                <div className="absolute top-4 right-4 text-sm font-bold text-[var(--brand-soft)] dark:text-[var(--brand-deep)] opacity-50">0{index + 1}</div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-bg)] text-[var(--accent-text)] mb-6 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-[var(--text-primary)]">{item.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{item.text}</p>
                <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition text-[11px] font-bold uppercase tracking-wider text-[var(--brand-mid)]">
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
