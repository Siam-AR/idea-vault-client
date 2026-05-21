"use client";

import { FaClipboardList, FaComments, FaThumbsUp } from "react-icons/fa";

export default function ParticipationSteps() {
  const steps = [
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

  return (
    <section className="max-w-7xl mx-auto mt-10">
      <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-8 shadow-sm">

        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-slate-900">
            Participation Steps
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            A simple sequence to get meaningful engagement from the community.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;

            return (
              <div
                key={i}
                className="group relative flex flex-col items-center text-center rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Step number */}
                <div className="absolute top-3 right-3 text-xs font-medium text-slate-300">
                  0{i + 1}
                </div>

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h4 className="mt-4 text-sm font-semibold text-slate-900">
                  {s.title}
                </h4>

                {/* Text */}
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {s.text}
                </p>

                {/* Hover hint */}
                <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition text-[10px] text-indigo-600">
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