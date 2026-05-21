import { Button } from "@heroui/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaCalendarAlt, FaCommentDots, FaFire, FaMoneyBillWave, FaUser } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatBudget = (budget) => {
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

const toTagList = (tags) => {
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

async function getIdea(id) {
  try {
    const response = await fetch(`${API_URL}/ideas/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (String(error?.message || "").toLowerCase().includes("404")) {
      return null;
    }

    throw error;
  }
}

export default async function IdeaDetailsPage({ params }) {
  const { id } = await params;

  const idea = await getIdea(id).catch((error) => {
    return { error: error?.message || "Unable to load this idea right now." };
  });

  if (!idea) {
    notFound();
  }

  if (idea.error) {
    return (
      <div className="px-4 py-10 text-slate-100">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-rose-500/20 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Idea Details
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">Could not load idea details</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">{idea.error}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/ideas">
              <Button color="primary">Back to Ideas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tags = toTagList(idea.tags);
  const likesCount = Array.isArray(idea.likes) ? idea.likes.length : idea.likes || 0;

  const details = [
    { label: "Category", value: idea.category || "Uncategorized" },
    { label: "Estimated Budget", value: formatBudget(idea.estimatedBudget) },
    { label: "Target Audience", value: idea.targetAudience || "Not specified" },
    { label: "Created On", value: formatDate(idea.createdAt) },
    { label: "Author", value: idea.userName || "Anonymous builder" },
    { label: "Email", value: idea.userEmail || "Not shared" },
  ];

  const insightCards = [
    {
      title: "Problem Statement",
      body: idea.problemStatement || "This idea does not include a problem statement yet.",
    },
    {
      title: "Proposed Solution",
      body: idea.proposedSolution || "The proposed solution has not been added yet.",
    },
    {
      title: "Detailed Description",
      body:
        idea.detailedDescription ||
        idea.description ||
        "The author has not added a detailed description yet.",
    },
  ];

  return (
    <div className="px-4 py-6 md:py-10 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <Link href="/ideas" className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white">
          <FaArrowLeft />
          Back to Ideas
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/40">
            <div
              className="min-h-80 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.72)), url(${idea.imageURL || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop"})`,
              }}
            />

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  {idea.category || "Uncategorized"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
                  <FaCalendarAlt />
                  {formatDate(idea.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
                  <FaFire />
                  {likesCount} likes
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-white md:text-5xl">
                {idea.title || "Untitled idea"}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                {idea.shortDescription || "No short description was provided for this idea."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {details.map((detail) => (
                  <div key={detail.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                      {detail.label}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-200">{detail.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {insightCards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                      {card.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{card.body}</p>
                  </div>
                ))}
              </div>

              {tags.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Idea Snapshot</p>
              <div className="mt-5 space-y-4 text-sm text-slate-200">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <FaUser className="text-cyan-300" />
                  <span>{idea.userName || idea.userEmail || "Anonymous builder"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <FaMoneyBillWave className="text-cyan-300" />
                  <span>{formatBudget(idea.estimatedBudget)}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <FaCommentDots className="text-cyan-300" />
                  <span>{idea.commentCount ?? 0} community comments</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <FaCalendarAlt className="text-cyan-300" />
                  <span>{formatDate(idea.createdAt)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-sm font-semibold text-cyan-200">Why it matters</p>
                <p className="mt-3 text-sm leading-7 text-slate-200/90">
                  This idea is ready for comments, validation, and iteration. Explore the concept, review the problem it solves, and use community feedback to refine it further.
                </p>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Contact</p>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <p>{idea.userName || "Anonymous builder"}</p>
                  <p>{idea.userEmail || "No email shared"}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/ideas" className="inline-flex w-full">
                  <Button className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                    Browse More Ideas
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}