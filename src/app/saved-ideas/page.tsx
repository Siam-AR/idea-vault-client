"use client";

import Loader from "@/components/Loader";
import RoleGuard from "@/components/auth/RoleGuard";
import { ideasAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookmark, FaSearch } from "react-icons/fa";
import type { Idea } from "@/types";

export default function SavedIdeasPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!loading && isAuthenticated) {
      let active = true;

      const loadSavedIdeas = async () => {
        try {
          setPageLoading(true);
          const data = await ideasAPI.getSavedIdeas();
          if (!active) return;

          setIdeas(Array.isArray(data) ? data : []);
          setError("");
        } catch (fetchError) {
          if (!active) return;

          const message =
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load your saved ideas.";
          setIdeas([]);
          setError(message);
          showToast(message, "error", 4000);
        } finally {
          if (active) {
            setPageLoading(false);
          }
        }
      };

      loadSavedIdeas();
      return () => {
        active = false;
      };
    }
  }, [loading, isAuthenticated, router, showToast]);

  const pageContent = (
    <div className="px-4 py-8 md:py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:px-8 md:py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
                <FaBookmark className="text-[0.7rem]" />
                Saved ideas
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                Your curated shortlist
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Keep track of ideas you want to revisit, compare, or reach out
                about later.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              {ideas.length} saved idea{ideas.length === 1 ? "" : "s"}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {pageLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <Loader message="Loading saved ideas..." />
          </div>
        ) : ideas.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FaSearch className="mx-auto text-3xl text-cyan-600" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              No saved ideas yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start bookmarking ideas from the browse page and they will appear
              here.
            </p>
            <div className="mt-6 flex justify-center">
              <Button variant="primary" onPress={() => router.push("/ideas")}>
                Browse Ideas
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ideas.map((idea) => (
              <article
                key={idea._id}
                onClick={() => router.push(`/ideas/${idea._id}`)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
              >
                <div
                  className="h-56 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.12)), url(${idea.imageURL || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"})`,
                  }}
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>{idea.category || "Uncategorized"}</span>
                    <span>{idea.commentCount ?? 0} comments</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    {idea.title || "Untitled idea"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {idea.shortDescription ||
                      "No short description was provided for this idea."}
                  </p>
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      <span>Saved for later</span>
                      <span className="font-semibold text-cyan-700">
                        Open detail →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <RoleGuard allowedRoles={["INVESTOR", "ADMIN"]}>{pageContent}</RoleGuard>
  );
}
