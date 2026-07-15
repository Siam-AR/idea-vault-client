"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import TrendingIdeas from '@/components/TrendingIdeas';
import InfoHighlights from '@/components/InfoHighlights';
import ParticipationSteps from '@/components/ParticipationSteps';
import CommunityResources from '@/components/CommunityResources';
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
                        <Button variant="primary">Explore Projects</Button>
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
      <InfoHighlights />
      <ParticipationSteps />
      <CommunityResources />
    </div>
  );
}
