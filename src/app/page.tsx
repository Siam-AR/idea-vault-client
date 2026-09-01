"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import TrendingIdeas from '@/components/TrendingIdeas';
import CategoryChart from '@/components/CategoryChart';
import ParticipationSteps from '@/components/ParticipationSteps';
import ShareIdeaCTA from '@/components/ShareIdeaCTA';
import { ideasAPI } from '@/lib/api';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import type { Idea } from '@/types';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Turn startup ideas into real products',
    description:
      'Share, validate, and refine ideas with a community built for founders, creators, and innovators.',
    overlayOpacity: 0.5,
  },
  {
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Explore ideas that inspire action',
    description:
      'Discover trending startup concepts, learn from other builders, and gather feedback before you launch.',
    overlayOpacity: 0.48,
  },
  {
    image:
      'https://images.unsplash.com/photo-1630958234938-4f6a4a9dbf3a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Validate ideas with real community insight',
    description:
      'Use comments, discussions, and idea discovery to shape better startup decisions faster.',
    overlayOpacity: 0.52,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [featuredIdeas, setFeaturedIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState('');

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
          setIdeasError(error instanceof Error ? error.message : 'Failed to load trending ideas.');
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
    <div className="w-full flex flex-col">
      {/* SECTION A: Hero (Ambient Background) */}
      <section className="w-full relative overflow-hidden">
        {/* Light Mode Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C4E2F5]/40 via-[#F8FAFC] to-white dark:hidden z-[-2]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 dark:hidden z-[-1]"></div>
        
        {/* Dark Mode Depth */}
        <div className="hidden dark:block absolute inset-0 bg-[#070B14] z-[-3]"></div>
        <div className="hidden dark:block absolute top-0 -left-20 w-96 h-96 rounded-full bg-[#2C5EAD]/25 blur-[120px] pointer-events-none z-[-2]"></div>
        <div className="hidden dark:block absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-[#1591DC]/20 blur-[100px] pointer-events-none z-[-2]"></div>

        <div className="w-full relative z-10">
          <div className="relative overflow-hidden shadow-xl shadow-blue-900/5 dark:shadow-2xl dark:shadow-black/60 border-y border-[#C4E2F5] dark:border-white/10">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[calc(100vh-73px)]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[calc(100vh-73px)] bg-cover bg-center bg-no-repeat relative w-full"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div
                  className="absolute inset-0 flex items-center bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20"
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 text-left p-8 md:p-14 w-full">
                    {/* Feature Pill Badge */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-semibold px-3.5 py-1 rounded-full inline-flex items-center gap-2 mb-4">
                      ✨ Discover, Validate & Build
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-3">
                      {slide.title}
                    </h1>

                    <p className="text-slate-300 text-base md:text-lg max-w-xl mt-3 mb-6">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link href="/ideas">
                        <Button className="bg-[#1591DC] hover:bg-[#2C5EAD] text-white font-medium px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/25 border-none inline-flex items-center gap-2">
                          Explore Ideas
                        </Button>
                      </Link>
                      <Link href="/add-idea">
                        <Button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-lg font-medium backdrop-blur-sm ml-3">
                          Share Your Idea
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
          </div>
        </div>
      </section>

      <TrendingIdeas ideas={featuredIdeas} loading={ideasLoading} error={ideasError} />
      <CategoryChart />
      <ParticipationSteps />
      <ShareIdeaCTA />
    </div>
  );
}
