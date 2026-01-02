"use client"
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

import MovieCard from "@/components/movies/MovieCard";
import Navbar from "@/components/layout/Navbar";
import RatingModal from "@/components/rating/RatingModal";
import SearchOverlay from "@/components/search/SearchOverlay";
import LoadingScreen from "@/components/layout/LoadingScreen";

import { useMovies } from "@/hooks/useMovies";
import {calculateFinalScore} from "@/lib/ratingUtils";

const ProfessionalRatingPlatform = () => {
    const [step, setStep] = useState('idle');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [finalRating, setFinalRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { sections, featured, loading } = useMovies();
    const [movieCache, setMovieCache] = useState({});

    const openRatingModal = useCallback(async (movie) => {
        setIsSearchOpen(false);
        if (setSearchQuery) setSearchQuery('');
        setSelectedMovie(movie);
        setStep('preview');
        setCurrentQuestion(0);
        setAnswers({});

        // Check if we already have the cast for this movie
        if (movieCache[movie.id]) {
            setCast(movieCache[movie.id]);
            return;
        }

        try {
            const res = await fetch(`/api/movies?movieId=${movie.id}&append=credits`);
            const data = await res.json();
            const castData = data.credits?.cast?.slice(0, 6) || [];

            setCast(castData);
            // Store in cache for future clicks
            setMovieCache(prev => ({ ...prev, [movie.id]: castData }));
        } catch (error) {
            console.error("Failed to fetch credits:", error);
            setCast([]);
        }
    }, [movieCache]);

    const handleRatingSubmit = useCallback((val, currentGenreQs) => {
        // Update answers locally first
        const newAnswers = { ...answers, [currentGenreQs[currentQuestion].id]: val };
        setAnswers(newAnswers);

        if (currentQuestion < currentGenreQs.length - 1) {
            // Move to next question
            setCurrentQuestion(prev => prev + 1);
            setHoverRating(0);
        } else {
            // 2. Use the utility for the final calculation
            const result = calculateFinalScore(newAnswers, currentGenreQs);

            setFinalRating(result);
            setStep('result');
        }
    }, [answers, currentQuestion]);

    const closeModal = useCallback(() => {
        setStep('idle');
        setSelectedMovie(null);
        setAnswers({});
        setSearchQuery('');
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white/90 font-light tracking-tight selection:bg-white/20">
            <Navbar
                onSearchOpen={() => setIsSearchOpen(true)}
                onSearchClose={() => setIsSearchOpen(false)}
            />

            <SearchOverlay
                isSearchOpen={isSearchOpen}
                onSearchClose={() => setIsSearchOpen(false)}
                onMovieSelect={openRatingModal}
            />

            {step === 'idle' && !loading && (
                <>
                    {featured && (
                        <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
                            <motion.img
                                initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }}
                                src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
                                className="absolute inset-0 w-full h-full object-cover opacity-40"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                            <div className="relative z-10 px-12 max-w-3xl">
                                <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-4 block font-medium">Spotlight Analysis</span>
                                <h1 className="text-8xl font-thin tracking-tighter mb-6">{featured.title}</h1>
                                <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-xl font-light">{featured.overview.slice(0, 160)}...</p>
                                <button onClick={() => openRatingModal(featured)} className="bg-white text-black px-10 py-3.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-bold hover:scale-105 transition-all shadow-xl">
                                    Initiate Review
                                </button>
                            </div>
                        </section>
                    )}

                    <section className="px-12 pb-24 relative z-20 space-y-20 -mt-24">
                        {sections.map((section) => (
                            <div key={section.title} className="group">
                                <div className="flex items-end justify-between mb-8">
                                    <h2 className="text-[10px] font-medium tracking-[0.5em] text-white/30 uppercase">{section.title}</h2>
                                    <div className="h-px flex-1 mx-8 bg-white/5" />
                                </div>
                                <div className="flex gap-8 overflow-x-auto no-scrollbar pb-6 scroll-smooth">
                                    {section.movies.map(movie => (
                                        <MovieCard key={movie.id} movie={movie} onClick={openRatingModal} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                </>
            )}

            <RatingModal
                step={step}
                setStep={setStep}
                selectedMovie={selectedMovie}
                cast={cast}
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                handleRatingSubmit={handleRatingSubmit}
                finalRating={finalRating}
                closeModal={closeModal}
            />

            <LoadingScreen loading={loading} step={step} />
        </div>
    );
};

export default ProfessionalRatingPlatform;