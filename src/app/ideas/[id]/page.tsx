"use client";

import Loader from '@/components/Loader';
import IdeaComments from '@/components/IdeaComments';
import { ideasAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaCommentDots, FaFire, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import type { Idea } from '@/types';

const formatDate = (value?: string) => {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatBudget = (budget?: number | string) => {
  if (!budget) return 'Budget not shared';

  if (typeof budget === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(budget);
  }

  return budget;
};

const toTagList = (tags?: string[] | string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
};

export default function IdeaDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ideaId = params?.id as string | undefined;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname || `/ideas/${ideaId}`)}`);
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
        setError('');
      } catch (fetchError) {
        if (!active) return;
        setIdea(null);
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load this idea right now.');
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
  const likesCount = Array.isArray(idea?.likes) ? idea.likes.length : (idea?.likes as number | undefined) || 0;

  const details = [
    { label: 'Category', value: idea?.category || 'Uncategorized' },
    { label: 'Estimated Budget', value: formatBudget(idea?.estimatedBudget) },
    { label: 'Target Audience', value: idea?.targetAudience || 'Not specified' },
    { label: 'Created On', value: formatDate(idea?.createdAt) },
    { label: 'Author', value: idea?.userName || 'Anonymous builder' },
    { label: 'Email', value: idea?.userEmail || 'Not shared' },
  ];

  const insightCards = [
    {
      title: 'Problem Statement',
      body: idea?.problemStatement || 'This idea does not include a problem statement yet.',
    },
    {
      title: 'Proposed Solution',
      body: idea?.proposedSolution || 'The proposed solution has not been added yet.',
    },
    {
      title: 'Detailed Description',
      body: idea?.detailedDescription || idea?.description || 'The author has not added a detailed description yet.',
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
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Idea Details</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Could not load idea details</h1>
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
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Invalid idea</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Idea identifier is missing</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">Unable to show comments because this idea has no valid identifier.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <Link href="/ideas" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
          <FaArrowLeft />
          Back to Ideas
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <div
              className="min-h-80 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.18)), url(${idea.imageURL || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop'})`,
              }}
            />

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  {idea.category || 'Uncategorized'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
                  <FaCalendarAlt />
                  {formatDate(idea.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
                  <FaFire />
                  {likesCount} likes
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                {idea.title || 'Untitled idea'}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                {idea.shortDescription || 'No short description was provided for this idea.'}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {details.map((detail) => (
                  <div key={detail.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">{detail.label}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{detail.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {insightCards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                  </div>
                ))}
              </div>

              {tags.length > 0 && (
                <div className="mt-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <IdeaComments ideaId={currentIdeaId} initialCount={idea.commentCount} />
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Idea Snapshot</p>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FaUser className="text-cyan-600" />
                  <span>{idea.userName || idea.userEmail || 'Anonymous builder'}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FaMoneyBillWave className="text-cyan-600" />
                  <span>{formatBudget(idea.estimatedBudget)}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FaCommentDots className="text-cyan-600" />
                  <span>{idea.commentCount ?? 0} community comments</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FaCalendarAlt className="text-cyan-600" />
                  <span>{formatDate(idea.createdAt)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-cyan-100 bg-cyan-50 p-5">
                <p className="text-sm font-semibold text-cyan-700">Why it matters</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  This idea is ready for comments, validation, and iteration. Explore the concept, review the problem it solves, and use community feedback to refine it further.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
