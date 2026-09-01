"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { FaMoneyBillWave, FaUser } from 'react-icons/fa';
import type { Idea } from '@/types';

interface TrendingIdeasProps {
  ideas?: Idea[];
  loading?: boolean;
  error?: string;
}

export default function TrendingIdeas({ ideas = [], loading = false, error = '' }: TrendingIdeasProps) {
  return (
    <section className="w-full bg-[var(--surface-elevated)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--brand-deep)] dark:text-[var(--brand-bright)]">Trending Ideas</p>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-theme">Explore ideas people are talking about right now</h2>
          </div>
          <Link href="/ideas" className="hidden sm:inline-flex">
            <Button className="border-[var(--brand-deep)] text-[var(--brand-deep)] dark:border-[var(--brand-bright)] dark:text-[var(--brand-bright)] bg-transparent hover:bg-[var(--accent-bg)]" variant="bordered">View All Ideas</Button>
          </Link>
        </div>

      {loading ? (
        <div className="min-h-55 rounded-2xl surface-panel" />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch">
          {ideas.map((idea) => (
            <article
              key={idea._id}
              role="button"
              tabIndex={0}
              onClick={() => window.location.assign(`/ideas/${idea._id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  window.location.assign(`/ideas/${idea._id}`);
                }
              }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--surface-base)] border border-[var(--border-card)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl shadow-[0_4px_20px_rgba(44,94,173,0.05)]"
            >
              <div
                className="h-52 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${idea.imageURL})`,
                }}
              />

              <div className="flex h-full flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[var(--accent-bg)] px-3 py-1 text-xs font-semibold text-[var(--accent-text)]">
                    {idea.category}
                  </span>
                  <span className="text-xs text-theme-muted">
                    {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-theme line-clamp-2 min-h-14">{idea.title}</h3>

                <p className="mt-3 text-sm text-theme-muted line-clamp-3 min-h-18">{idea.shortDescription}</p>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-bg)]/50 px-3 py-1 font-medium text-theme border border-[var(--border-card)]">
                    <FaMoneyBillWave className="text-[var(--brand-mid)] text-xs" />
                    Budget: {idea.estimatedBudget || 'Not listed'}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-bg)]/50 px-3 py-1 font-medium text-theme border border-[var(--border-card)]">
                    <FaUser className="text-[var(--brand-mid)] text-xs" />
                    {idea.userName || idea.userEmail || 'Anonymous'}
                  </span>
                </div>

                <div className="mt-auto pt-6">
                  <Link href={`/ideas/${idea._id}`} className="inline-flex w-full">
                    <Button className="w-full bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] font-medium">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
    </section>
  );
}
