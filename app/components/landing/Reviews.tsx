"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

import Image from "next/image";
import { Star as LucideStar } from "lucide-react";

type GoogleReview = {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description?: string;
  text: string;
  time?: number;
};

type GoogleReviewResponse = {
  result?: {
    rating?: number;
    user_ratings_total?: number;
    reviews?: GoogleReview[];
  };
  reviews?: GoogleReview[];
  rating?: number;
  user_ratings_total?: number;
};

const MOBILE_COMMENT_CHAR_LIMIT = 120;
const DESKTOP_COMMENT_CHAR_LIMIT = 220;

const sanitizeRelativeTime = (value?: string) =>
  value?.replace(/\u00A0/g, " ") ?? "";

const getInitial = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trimEnd()}...`;
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews")

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data: GoogleReviewResponse = await response.json();
        const fetchedReviews =
          data.result?.reviews ?? data.reviews ?? [];

        setReviews(fetchedReviews);
        setAverageRating(data.result?.rating ?? data.rating ?? null);
        setTotalRatings(
          data.result?.user_ratings_total ?? data.user_ratings_total ?? null,
        );
      } catch (err) {
        console.error("Erreur lors de la récupération des avis Google:", err);
        setError("Impossible de récupérer les avis pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== "undefined") {
        setIsMobileViewport(window.innerWidth < 768);
      }
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const renderStars = (rating: number) => {
    const filledStars = Math.round(rating);
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`w-7 h-7 md:w-8 md:h-8 ${i < filledStars ? "text-yellow-500" : "text-slate-300"}`}
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    ));
  };
  const computedAverageRating =
    averageRating ??
    (reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : null);
  const roundedAverageRating = useMemo(
    () => (computedAverageRating != null ? Math.round(computedAverageRating) : 0),
    [computedAverageRating],
  );

  return (
    <section
      className="py-20 bg-[linear-gradient(135deg,_#ECFFF6_0%,_#E8FFF0_40%,_#E9FFF7_70%,_#F4FFF9_100%)]"
    >
      <div className="w-full px-4 sm:px-8 lg:px-16">
        {/* Grande card VERTE (même gabarit qu'avant) */}
        <div className="relative rounded-[32px] p-[3px] bg-[linear-gradient(135deg,#b0ff7c_0%,#87f072_40%,#49d86a_100%)] shadow-[0_25px_80px_-20px_rgba(34,197,94,0.55),0_12px_30px_rgba(0,0,0,0.1)]">
          <div className="relative rounded-[28px] bg-[linear-gradient(180deg,#f6fff9_0%,#effff4_15%,#eaffef_60%,#f8fff9_100%)] p-10 border-[3px] border-white/60 shadow-[inset_0_2px_0_rgba(255,255,255,0.8)]">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-white/30 [mask-image:linear-gradient(to_bottom,white,transparent_35%)]"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-10">
              {/* Colonne GAUCHE : titre + note */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
                    <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#EA4335]">
                      G
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-700">
                      Avis Google
                    </div>
                    <div className="text-sm text-slate-500">
                      Nos clients nous recommandent
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
                  Ce que disent nos clients
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Découvrez les retours authentiques laissés par notre
                  communauté. Votre confiance est au cœur de notre service.
                </p>

                <div className="mt-6">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-5xl font-bold text-slate-900">
                      {computedAverageRating != null
                        ? computedAverageRating.toFixed(1)
                        : "—"}
                    </span>
                    <span className="text-sm font-medium uppercase tracking-wide text-emerald-600">
                      Note moyenne
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <LucideStar
                        key={i}
                        className={`w-6 h-6 ${i < roundedAverageRating ? "text-yellow-400" : "text-slate-300"}`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    {totalRatings ?? reviews.length
                      ? `Basé sur ${totalRatings ?? reviews.length} avis clients vérifiés.`
                      : "Avis Google authentiques."}
                  </p>
                </div>
              </div>

              {/* Colonne DROITE : Swiper effet "cards" intégré */}
              <div className="w-full lg:w-[520px]">
                <Swiper
                  effect="cards"
                  grabCursor
                  modules={[EffectCards, Pagination]}
                  pagination={{ clickable: true }}
                  className="md:w-[450px] md:h-[350px] w-[90%] h-[320px] mx-auto"
                >
                  {isLoading && (
                    <SwiperSlide className="bg-white rounded-[22px] overflow-hidden flex items-center justify-center text-slate-600 text-sm">
                      Chargement des avis...
                    </SwiperSlide>
                  )}
                  {error && !isLoading && (
                    <SwiperSlide className="bg-white rounded-[22px] overflow-hidden flex items-center justify-center text-center text-slate-600 text-sm px-6">
                      {error}
                    </SwiperSlide>
                  )}
                  {!isLoading && !error && reviews.length === 0 && (
                    <SwiperSlide className="bg-white rounded-[22px] overflow-hidden flex items-center justify-center text-slate-600 text-sm">
                      Aucun avis disponible pour le moment.
                    </SwiperSlide>
                  )}
                  {reviews.map((review) => {
                    const relativeTime = sanitizeRelativeTime(
                      review.relative_time_description,
                    );

                    return (
                      <SwiperSlide
                        key={`${review.author_name}-${review.time}`}
                        className="bg-white rounded-[22px] overflow-hidden"
                        style={{
                          boxShadow:
                            "0 26px 44px -18px rgba(2,6,23,0.25), 0 12px 24px rgba(2,6,23,0.08)",
                          border: "2px solid rgba(226,232,240,1)",
                        }}
                      >
                        <div className="w-[86%] mx-auto h-full flex flex-col py-8">
                          {/* HAUT : étoiles + note */}
                          <div className="flex items-center gap-1.5 mb-8">
                            {renderStars(review.rating)}
                          </div>

                          {/* MILIEU : commentaire centré verticalement */}
                          <div className="flex-1 flex items-center justify-center text-center">
                            <p className="max-w-[42ch] text-[13px] sm:text-sm md:text-[15px] font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                              {truncateText(
                                review.text,
                                isMobileViewport
                                  ? MOBILE_COMMENT_CHAR_LIMIT
                                  : DESKTOP_COMMENT_CHAR_LIMIT,
                              )}
                            </p>
                          </div>

                          {/* BAS : auteur */}
                          <div className="flex items-center gap-4 mt-8">
                            {review.profile_photo_url ? (
                              <Image
                                src={review.profile_photo_url}
                                alt={review.author_name}
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600">
                                {getInitial(review.author_name)}
                              </div>
                            )}

                            <div>
                              <p className="text-[15px] sm:text-lg font-semibold text-slate-900">
                                {review.author_name}
                              </p>
                              <p className="text-slate-500 text-xs sm:text-sm">
                                Avis Google
                                {relativeTime ? ` • ${relativeTime}` : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
