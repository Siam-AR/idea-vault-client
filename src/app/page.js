"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import TrendingIdeas from "@/components/TrendingIdeas";
import InfoHighlights from "@/components/InfoHighlights";
import ParticipationSteps from "@/components/ParticipationSteps";
import CommunityResources from "@/components/CommunityResources";
import { ideasAPI } from "@/lib/api";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Turn startup ideas into real products",
    description:
      "Share, validate, and refine ideas with a community built for founders, creators, and innovators.",
    overlayOpacity: 0.5,
  },
  {
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Explore ideas that inspire action",
    description:
      "Discover trending startup concepts, learn from other builders, and gather feedback before you launch.",
    overlayOpacity: 0.48,
  },
  {
    image:
      "https://images.unsplash.com/photo-1630958234938-4f6a4a9dbf3a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Validate ideas with real community insight",
    description:
      "Use comments, discussions, and idea discovery to shape better startup decisions faster.",
    overlayOpacity: 0.52,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [featuredIdeas, setFeaturedIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState("");

  useEffect(() => {
    const preload = async () => {
      await Promise.all(
        slides.map(
          (slide) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = slide.image;
              img.onload = img.onerror = () => resolve(null);
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
          setIdeasError("");
        }
      } catch (error) {
        if (mounted) {
          setIdeasError(error?.message || "Failed to load trending ideas.");
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
                        <Button color="primary">Explore Ideas</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <TrendingIdeas
        ideas={featuredIdeas}
        loading={ideasLoading}
        error={ideasError}
      />

      <InfoHighlights />
      <ParticipationSteps />
      <CommunityResources />
    </div>
  );
}