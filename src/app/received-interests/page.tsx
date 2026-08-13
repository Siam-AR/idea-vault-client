"use client";

import Loader from "@/components/Loader";
import { interestsAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaInbox, FaEye, FaCalendarAlt, FaEnvelope, FaUser } from "react-icons/fa";
import type { Interest } from "@/types";

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

export default function ReceivedInterestsPage() {
  const router = useRouter();
  const { loading, isAuthenticated, user, isFounder } = useAuth();
  const { showToast } = useToast();

  const [interests, setInterests] = useState<Interest[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isFounder) {
        router.push("/ideas");
      }
    }
  }, [loading, isAuthenticated, isFounder, router]);

  useEffect(() => {
    let active = true;

    const loadInteractions = async () => {
      try {
        setPageLoading(true);
        const data = await interestsAPI.getReceivedInterests();

        if (!active) return;

        setInterests(Array.isArray(data) ? data : []);
        setError("");
      } catch (fetchError) {
        if (!active) return;

        const message = (fetchError as Error)?.message || "Unable to load received interests right now.";
        setInterests([]);
        setError(message);
        showToast(message, "error", 3500);
      } finally {
        if (active) {
          setPageLoading(false);
        }
      }
    };

    if (!loading && isAuthenticated && isFounder) {
      loadInteractions();
    }

    return () => {
      active = false;
    };
  }, [loading, isAuthenticated, isFounder, showToast]);

  const stats = useMemo(() => {
    return {
      total: interests.length,
    };
  }, [interests]);

  if (loading || pageLoading) {
    return (
      <div className="px-4 py-10 min-h-screen">
        <Loader message="Loading received interests..." />
      </div>
    );
  }

  if (!isAuthenticated || !isFounder) {
    return null;
  }

  return (
    <div className="px-4 py-8 md:py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:px-8 md:py-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                <FaInbox className="text-[0.7rem]" />
                Investor Interests
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                Interests Received
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Review the interests sent by investors regarding your startup ideas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 min-w-[150px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Interests received</p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {interests.length === 0 ? (
          <Card className="border border-slate-200 p-8 text-center shadow-sm">
            <FaInbox className="mx-auto text-3xl text-cyan-600" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">No interests received yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              When an investor expresses interest in one of your ideas, it will appear here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onPress={() => router.push("/my-ideas")}>Manage Ideas</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {interests.map((interest) => (
              <article
                key={interest._id}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">Idea Reference</p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                      {interest.idea?.title || "Unknown idea"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {interest.idea?.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-xs text-slate-500">
                    <p>{formatDate(interest.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 mb-4 text-sm text-slate-700 font-medium">
                    <FaUser className="text-cyan-600" />
                    <span>From: {interest.investor?.name || "Unknown Investor"}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4 text-sm text-slate-600">
                    <FaEnvelope className="text-cyan-600" />
                    <a href={`mailto:${interest.investor?.email}`} className="text-cyan-700 hover:underline">
                      {interest.investor?.email || "No email provided"}
                    </a>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      Message
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {interest.message}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link href={interest.idea?._id ? `/ideas/${interest.idea._id}` : "/ideas"} className="flex-1">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-700">
                        <FaEye className="mr-2" />
                        View Idea
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
