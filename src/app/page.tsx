"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Loader from '@/components/Loader';
import TrendingIdeas from '@/components/TrendingIdeas';
import InfoHighlights from '@/components/InfoHighlights';
import ParticipationSteps from '@/components/ParticipationSteps';
import CommunityResources from '@/components/CommunityResources';
import { ideasAPI } from '@/lib/api';
import { FaArrowRight, FaChartLine, FaHandsHelping, FaRegCommentDots, FaSeedling } from 'react-icons/fa';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import type { Idea } from '@/types';

const slides = [
  {
    image:
      'https://distresscentre.com/wp-content/uploads/2024/03/community-service-1024x672.jpg',
    title: 'Turn local needs into shared action',
    description:
      'Share community projects, invite support, and bring practical ideas to life with neighbors and changemakers.',
    overlayOpacity: 0.5,
  },
  {
    image:
      'https://charitysmith.org/wp-content/uploads/2023/09/community.webp',
    title: 'Explore community projects that strengthen neighborhoods',
    description:
      'Discover trending initiatives, learn from local builders, and gather support before bringing a project to life.',
    overlayOpacity: 0.48,
  },
  {
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGDokh1GOFDD4UINIHrSgHoPDhAezJwQM44ybU5k-IoTChzJQ43Z2fVKs&s=10',
    title: 'Validate projects with real community insight',
    description:
      'Use comments, discussions, and project discovery to shape better community decisions faster.',
    overlayOpacity: 0.52,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [featuredIdeas, setFeaturedIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState('');

  const impactStats = useMemo(() => {
    const totalProjects = featuredIdeas.length;
    const categories = new Set(
      featuredIdeas
        .map((idea) => idea.category)
        .filter((category): category is string => Boolean(category)),
    ).size;
    const conversations = featuredIdeas.reduce((sum, idea) => sum + (idea.commentCount || 0), 0);

    return [
      {
        label: 'Featured Projects',
        value: String(totalProjects),
        hint: 'Live projects highlighted from the community feed',
        icon: FaHandsHelping,
      },
      {
        label: 'Categories Covered',
        value: String(categories),
        hint: 'Education, health, environment, and more',
        icon: FaSeedling,
      },
      {
        label: 'Community Conversations',
        value: String(conversations),
        hint: 'Comments and feedback helping projects grow',
        icon: FaChartLine,
      },
    ];
  }, [featuredIdeas]);

  const communityVoices = [
    {
      name: 'Ayesha Rahman',
      role: 'Volunteer coordinator',
      quote:
        'Community Spark made it easy to explain a neighborhood cleanup and find people who wanted to help the same week.',
    },
    {
      name: 'Tanvir Hassan',
      role: 'Youth mentor',
      quote:
        'The project pages feel practical and clear, so supporters can quickly understand what a local initiative needs.',
    },
    {
      name: 'Nadia Islam',
      role: 'Community organizer',
      quote:
        'It is a simple place to gather ideas, feedback, and momentum around projects that actually improve daily life.',
    },
  ];

  const featuredProjectCards = featuredIdeas.slice(0, 3);

  useEffect(() => {
    const preload = async () => {
      await Promise.all(
        slides.map(
          (slide) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = slide.image;
              img.onload = img.onerror = () => resolve();
            }),
        ),
      );
      setLoading(false);
    };

    preload();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadFeaturedIdeas = async () => {
      try {
        setIdeasLoading(true);
        const data = await ideasAPI.getFeatured();

        if (mounted) {
          setFeaturedIdeas(Array.isArray(data) ? data : []);
          setIdeasError('');
        }
      } catch (error) {
        if (mounted) {
          setIdeasError(error instanceof Error ? error.message : 'Failed to load trending initiatives.');
          setFeaturedIdeas([]);
        }
      } finally {
        if (mounted) {
          setIdeasLoading(false);
        }
      }
    };

    loadFeaturedIdeas();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[75vh]">
        <Loader message="Loading banner…" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 space-y-10">
      <div className="relative rounded-xl overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[50vh] sm:h-[60vh] md:h-[75vh]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[50vh] sm:h-[60vh] md:h-[75vh] bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div
                  className="absolute inset-0 flex items-center"
                  style={{
                    backgroundColor: `rgba(0,0,0,${slide.overlayOpacity})`,
                  }}
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 text-white">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold whitespace-pre-line mb-2 sm:mb-4">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-4 sm:mb-6 text-gray-200">
                      {slide.description}
                    </p>

                    <div className="flex gap-4">
                      <Link href="/ideas">
                        <Button variant="primary">Explore Community Projects</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <TrendingIdeas ideas={featuredIdeas} loading={ideasLoading} error={ideasError} />
        <section className="max-w-7xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-emerald-600">Featured Projects</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-bold text-theme">Highlighted community initiatives with real momentum</h2>
            </div>
            <Link href="/ideas" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Browse all projects
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(featuredProjectCards.length > 0 ? featuredProjectCards : Array.from({ length: 3 }, () => null)).map((idea, index) => {
              if (!idea) {
                return (
                  <div key={index} className="overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                    <div className="h-44 rounded-xl bg-slate-100" />
                    <div className="mt-4 space-y-3">
                      <div className="h-4 w-28 rounded-full bg-slate-200" />
                      <div className="h-5 w-3/4 rounded-full bg-slate-200" />
                      <div className="h-4 w-full rounded-full bg-slate-200" />
                    </div>
                  </div>
                );
              }

              return (
                <article key={idea._id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url(${idea.imageURL || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop'})`,
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {idea.category || 'Community'}
                      </span>
                      <span className="text-xs text-theme-muted">
                        {idea.location || 'Local project'}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-theme line-clamp-2">{idea.title || 'Community project'}</h3>
                    <p className="mt-3 text-sm text-theme-muted line-clamp-3">{idea.shortDescription || 'A local initiative looking for support and collaboration.'}</p>
                    <Link href={`/ideas/${idea._id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                      Read project details
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <TrendingIdeas ideas={featuredIdeas} loading={ideasLoading} error={ideasError} />

        <section className="max-w-7xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-emerald-600">Impact Highlights</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-bold text-theme">How the platform is helping communities move faster</h2>
            </div>
            <p className="max-w-2xl text-sm text-theme-muted md:text-right">
              These numbers give a quick snapshot of live community activity and the conversations taking place around it.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {impactStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">{stat.label}</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{stat.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-amber-500 text-white shadow-sm">
                      <Icon />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-theme-muted">{stat.hint}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-emerald-600">Community Voices</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-bold text-theme">What supporters and organizers are saying</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <FaRegCommentDots />
              Real feedback from community builders
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {communityVoices.map((voice) => (
              <article key={voice.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-7 text-slate-700">&ldquo;{voice.quote}&rdquo;</p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <h3 className="font-semibold text-slate-900">{voice.name}</h3>
                  <p className="text-sm text-theme-muted">{voice.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      <InfoHighlights />
      <ParticipationSteps />
      <CommunityResources />
    </div>
  );
}
