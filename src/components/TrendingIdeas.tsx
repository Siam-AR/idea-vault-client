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
    <section className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-emerald-600">Trending Projects</p>
          <h2 className="mt-2 text-2xl md:text-4xl font-bold text-theme">Explore community initiatives people are supporting right now</h2>
        </div>
        <Link href="/ideas" className="hidden sm:inline-flex">
          <Button variant="outline">View All Projects</Button>
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
              className="group flex h-full flex-col overflow-hidden rounded-2xl surface-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="h-52 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${idea.imageURL})`,
                }}
              />

              <div className="flex h-full flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {idea.category}
                  </span>
                  <span className="text-xs text-theme-muted">
                    {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-theme line-clamp-2 min-h-14">{idea.title}</h3>

                <p className="mt-3 text-sm text-theme-muted line-clamp-3 min-h-18">{idea.shortDescription}</p>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 font-medium text-green-700 border border-green-100 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200">
                    <FaMoneyBillWave className="text-green-600 text-xs" />
                    Budget: {idea.estimatedBudget || 'Not listed'}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600 border border-blue-100 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                    <FaUser className="text-blue-500 text-xs" />
                    {idea.userName || idea.userEmail || 'Anonymous'}
                  </span>
                </div>

                <div className="mt-auto pt-5">
                  <Link href={`/ideas/${idea._id}`} className="inline-flex w-full">
                    <Button className="w-full" variant="primary">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
