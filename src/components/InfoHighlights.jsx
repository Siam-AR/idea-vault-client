"use client";

import { FaBolt, FaChartLine, FaRocket } from "react-icons/fa";

export default function InfoHighlights() {
  const items = [
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

  return (
    <section className="max-w-7xl mx-auto mt-12">
      <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-8 shadow-sm">

        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            Quick Tips
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Short, actionable recommendations to get more useful feedback.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, idx) => {
            const Icon = it.icon;

            return (
              <div
                key={idx}
                className="group relative flex gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {it.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {it.desc}
                  </p>
                </div>

                {/* Hover badge */}
                <span className="absolute right-3 top-3 hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 group-hover:block">
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