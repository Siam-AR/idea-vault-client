"use client";

import { useState } from "react";
import { useToast } from "@/lib/toast-context";
import {
  FaCalendarAlt,
  FaHeart,
  FaMoneyBillWave,
  FaStar,
  FaUser,
} from "react-icons/fa";
import type { Idea } from "@/types";

interface IdeaCardProps {
  idea: Idea;
  saved?: boolean;
  onToggleSave?: (ideaId: string) => Promise<boolean | void>;
  onOpenDetails?: (ideaId?: string) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatBudget = (budget?: number | string) => {
  if (!budget) return "Budget not shared";

  if (typeof budget === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(budget);
  }

  return budget;
};

export default function IdeaCard({
  idea,
  saved = false,
  onToggleSave,
  onOpenDetails,
}: IdeaCardProps) {
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    const ideaId = idea._id || idea.id;
    if (!ideaId || saving) return;

    setSaving(true);
    const previousState = isSaved;
    setIsSaved((current) => !current);

    try {
      const result = await onToggleSave?.(ideaId);
      if (result === false) {
        setIsSaved(previousState);
      }
    } catch (error) {
      setIsSaved(previousState);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update saved ideas.";
      showToast(message, "error", 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDetails = () => {
    onOpenDetails?.(idea._id || idea.id);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenDetails();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={handleCardKeyDown}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <div
          className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.12)), url(${idea.imageURL || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"})`,
          }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur-sm">
          {idea.category || "Uncategorized"}
        </div>
        <button
          type="button"
          aria-label={isSaved ? "Remove idea from saved list" : "Save idea"}
          onClick={handleSaveToggle}
          disabled={saving}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border text-lg shadow-lg backdrop-blur-sm transition ${
            isSaved
              ? "border-amber-200 bg-amber-100 text-amber-600"
              : "border-slate-200 bg-white/90 text-slate-600 hover:text-amber-500"
          }`}
        >
          {isSaved ? <FaStar /> : <FaHeart />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5 text-slate-900">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{formatDate(idea.createdAt)}</span>
          <span>{idea.commentCount ?? 0} comments</span>
        </div>

        <h2 className="mt-3 min-h-16 text-2xl font-bold tracking-tight text-slate-900">
          {idea.title || "Untitled idea"}
        </h2>

        <p className="mt-3 min-h-20 text-sm leading-7 text-slate-600">
          {idea.shortDescription ||
            "No short description was provided for this idea."}
        </p>

        <div className="mt-4 grid gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaMoneyBillWave className="text-cyan-600" />
            <span>{formatBudget(idea.estimatedBudget)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FaUser className="text-cyan-600" />
            <span>
              {idea.userName || idea.userEmail || "Anonymous builder"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <FaCalendarAlt className="text-cyan-600" />
              {formatDate(idea.createdAt)}
            </span>
            <span className="font-semibold text-cyan-700">Open details →</span>
          </div>
        </div>
      </div>
    </article>
  );
}
