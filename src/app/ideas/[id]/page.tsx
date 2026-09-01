"use client";

import Loader from "@/components/Loader";
import IdeaComments from "@/components/IdeaComments";
import { ideasAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCommentDots,
  FaFire,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";
import type { Idea } from "@/types";

const formatDate = (value?: string) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatBudget = (budget?: number | string) => {
  if (!budget) return "Budget not shared";

  if (typeof budget === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(budget);
  }

  return budget;
};

const toTagList = (tags?: string[] | string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

export default function IdeaDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [submittingInterest, setSubmittingInterest] = useState(false);

  const ideaId = params?.id as string | undefined;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(
        `/login?redirectTo=${encodeURIComponent(pathname || `/ideas/${ideaId}`)}`,
      );
    }
  }, [authLoading, isAuthenticated, router, pathname, ideaId]);

  useEffect(() => {
    let active = true;

    const loadIdea = async () => {
      try {
        setLoading(true);
        const data = await ideasAPI.getById(ideaId as string);
        if (!active) return;
        setIdea(data);
        setError("");
      } catch (fetchError) {
        if (!active) return;
        setIdea(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load this idea right now.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (authLoading) return undefined;
    if (!isAuthenticated) return undefined;
    if (ideaId) {
      loadIdea();
    }

    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, ideaId]);

  const tags = useMemo(() => toTagList(idea?.tags), [idea]);
  const likesCount = Array.isArray(idea?.likes)
    ? idea.likes.length
    : (idea?.likes as number | undefined) || 0;
  const isInvestor = user?.role === "INVESTOR";

  const handleExpressInterest = async () => {
    if (!currentIdeaId) return;
    const trimmedMessage = interestMessage.trim();
    if (!trimmedMessage) {
      showToast(
        "Please add a short message before sending your interest.",
        "error",
        3000,
      );
      return;
    }

    try {
      setSubmittingInterest(true);
      await ideasAPI.expressInterest(currentIdeaId, trimmedMessage);
      showToast("Interest sent successfully.", "success", 3000);
      setInterestMessage("");
      setIsInterestModalOpen(false);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to send interest request.";
      showToast(message, "error", 4000);
    } finally {
      setSubmittingInterest(false);
    }
  };

  const details = [
    { label: "Category", value: idea?.category || "Uncategorized" },
    { label: "Estimated Budget", value: formatBudget(idea?.estimatedBudget) },
    {
      label: "Target Audience",
      value: idea?.targetAudience || "Not specified",
    },
    { label: "Created On", value: formatDate(idea?.createdAt) },
    { label: "Author", value: idea?.userName || "Anonymous builder" },
    { label: "Email", value: idea?.userEmail || "Not shared" },
  ];

  const insightCards = [
    {
      title: "Problem Statement",
      body:
        idea?.problemStatement ||
        "This idea does not include a problem statement yet.",
    },
    {
      title: "Proposed Solution",
      body:
        idea?.proposedSolution ||
        "The proposed solution has not been added yet.",
    },
    {
      title: "Detailed Description",
      body:
        idea?.detailedDescription ||
        idea?.description ||
        "The author has not added a detailed description yet.",
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="px-4 py-10 min-h-screen">
        <Loader message="Loading idea details..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">
            Idea Details
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Could not load idea details
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{error}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/ideas">
              <Button variant="primary">Back to Ideas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  const currentIdeaId = idea._id ?? idea.id;
  if (!currentIdeaId) {
    return (
      <div className="px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">
            Invalid idea
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Idea identifier is missing
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Unable to show comments because this idea has no valid identifier.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/ideas"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <FaArrowLeft />
          Back to Ideas
        </Link>

        <div className="mt-6 mx-auto max-w-4xl">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div
              className="min-h-80 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.18)), url(${idea.imageURL || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"})`,
              }}
            />

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  {idea.category || "Uncategorized"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
                  <FaCalendarAlt />
                  {formatDate(idea.createdAt)}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                {idea.title || "Untitled idea"}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                {idea.shortDescription ||
                  "No short description was provided for this idea."}
              </p>

              {isInvestor && user?.email !== idea.userEmail && (
                <div className="mt-6">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-cyan-500 to-blue-600 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
                    onPress={() => setIsInterestModalOpen(true)}
                  >
                    Express Interest
                  </Button>
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      {detail.label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {insightCards.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${
                      card.title === "Detailed Description" ? "md:col-span-2" : ""
                    }`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>

              {tags.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
                    Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <IdeaComments
                ideaId={currentIdeaId}
                initialCount={idea.commentCount}
              />
            </div>
          </article>
        </div>
      </div>

      {isInterestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Investor interest
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  Express your interest
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsInterestModalOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Message to founder
                </span>
                <textarea
                  value={interestMessage}
                  onChange={(event) => setInterestMessage(event.target.value)}
                  rows={5}
                  placeholder="Tell the founder why this idea stands out and what kind of collaboration you are looking for."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400/60 focus:bg-white"
                />
              </label>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onPress={() => setIsInterestModalOpen(false)}
                  className="border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-linear-to-r from-cyan-500 to-blue-600 text-white"
                  isDisabled={submittingInterest || !interestMessage.trim()}
                  onPress={handleExpressInterest}
                >
                  {submittingInterest ? "Sending..." : "Send Interest"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
