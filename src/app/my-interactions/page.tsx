"use client";

import Loader from "@/components/Loader";
import { commentsAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaCommentDots, FaEye, FaRegCommentDots, FaUserEdit } from "react-icons/fa";
import type { Comment } from "@/types";

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

const formatTime = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const normalizeCommentText = (text?: string) => {
  const value = String(text || "").trim();
  if (!value) return "No comment text provided.";
  return value;
};

export default function MyInteractionPage() {
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    let active = true;

    const loadInteractions = async () => {
      try {
        setPageLoading(true);
        const data = await commentsAPI.getMyComments();

        if (!active) return;

        setComments(Array.isArray(data) ? data : []);
        setError("");
      } catch (fetchError) {
        if (!active) return;

        const message = (fetchError as Error)?.message || "Unable to load your interactions right now.";
        setComments([]);
        setError(message);
        showToast(message, "error", 3500);
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    };

    if (!loading && isAuthenticated) {
      loadInteractions();
    }

    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, showToast]);

  const stats = useMemo(() => {
    const totalComments = comments.length;
    const latestComment = comments[0];

    return {
      totalComments,
      latestActivity: latestComment ? formatDate(latestComment.updatedAt || latestComment.createdAt) : "No activity yet",
    };
  }, [comments]);

  const openIdeaDetails = (ideaId?: string) => {
    if (!ideaId) return;
    router.push(`/ideas/${ideaId}`);
  };

  if (loading || pageLoading) {
    return (
      <div className="px-4 py-10 min-h-screen">
        <Loader message="Loading your interactions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="px-4 py-8 md:py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:px-8 md:py-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                <FaRegCommentDots className="text-[0.7rem]" />
                My Interactions
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                Your comment activity
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                This section shows the ideas you commented on, so you can review your feedback and jump back into any discussion.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{stats.totalComments}</p>
                <p className="text-sm text-slate-600">Comments posted</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{stats.latestActivity}</p>
                <p className="text-sm text-slate-600">Latest activity</p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {comments.length === 0 ? (
          <Card className="border border-slate-200 p-8 text-center shadow-sm">
            <FaCommentDots className="mx-auto text-3xl text-cyan-600" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">No comments yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Start participating in idea discussions and your comments will appear here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="primary" onPress={() => router.push("/ideas")}>Browse Ideas</Button>
              <Button variant="outline" onPress={() => router.push("/my-ideas")}>My Ideas</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {comments.map((comment) => (
              <article
                key={comment._id ?? `${comment.idea?._id ?? comment.ideaId}-${comment.createdAt ?? comment.updatedAt ?? "unknown"}`}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Commented idea</p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                      {comment.idea?.title || comment.ideaTitle || "Unknown idea"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {comment.idea?.category || comment.ideaCategory || "Uncategorized"} · by {comment.idea?.authorName || comment.ideaAuthorName || "Anonymous builder"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-xs text-slate-500">
                    <p>{formatDate(comment.updatedAt || comment.createdAt)}</p>
                    <p>{formatTime(comment.updatedAt || comment.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FaUserEdit className="text-cyan-600" />
                      Your comment
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {normalizeCommentText(comment.text)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
                    <span>{comment.userName || user?.name || "You"}</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>

                  <div className="mt-auto flex gap-3 pt-5">
                    <Button
                      className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600 text-white"
                      onPress={() => openIdeaDetails(comment.idea?._id || comment.ideaId)}
                      isDisabled={!comment.idea?._id && !comment.ideaId}
                    >
                      <FaEye className="mr-2" />
                      View Idea
                    </Button>
                    <Link href={comment.idea?._id ? `/ideas/${comment.idea._id}` : "/ideas"} className="flex-1">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-700">
                        Open Discussion
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
