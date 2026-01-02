"use client";
import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, X, Target, Sparkles } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RatingStar from "@/components/rating/RatingStar";

// --- DATA LOGIC ---
import { GENRE_INFO } from '@/lib/GENRE_INFO';
import { QUESTIONS } from "@/lib/QUESTIONS";
import { TMDB_GENRE_MAP } from "@/lib/TMBD_GENRE_MAP";

// --- ANIMATION VARIANTS ---
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const modalVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2 } }
};
const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

const RatingModal = ({
                         step,
                         setStep,
                         selectedMovie,
                         cast,
                         currentQuestion,
                         setCurrentQuestion,
                         hoverRating,
                         setHoverRating,
                         handleRatingSubmit,
                         finalRating,
                         closeModal
                     }) => {

    // 1. Determine the Genre Key (e.g., "Adventure", "Sci-Fi")
    const genreName = useMemo(() => {
        if (!selectedMovie?.genre_ids?.[0]) return 'Drama';
        return TMDB_GENRE_MAP[selectedMovie.genre_ids[0]] || 'Drama';
    }, [selectedMovie]);

    // 2. Get the info for the sidebar
    const genreData = useMemo(() => {
        return GENRE_INFO[genreName] || GENRE_INFO['Drama'];
    }, [genreName]);

    // 3. MERGE LOGIC: 10 Universal + All Genre Specific
    const currentGenreQs = useMemo(() => {
        if (!selectedMovie) return [];

        const universal = QUESTIONS.universal || [];

        // Match the key exactly as it appears in QUESTIONS.js
        // If your key is "Sci-Fi" in QUESTIONS but "SciFi" in MAP,
        // handle that mapping here.
        const specific = QUESTIONS[genreName] || [];

        return [...universal, ...specific];
    }, [selectedMovie, genreName]);

    // Calculate if current question is genre-specific (index > 9)
    const isGenreSpecific = currentQuestion >= 10;

    return (
        <AnimatePresence>
            {step !== 'idle' && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-300 flex items-center justify-center p-4 md:p-12 bg-black/90 transform-gpu"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 overflow-hidden" onClick={closeModal}>
                        {selectedMovie?.backdrop_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover opacity-20"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent" />
                    </div>

                    {/* Modal Container */}
                    <motion.div
                        variants={modalVariants}
                        className="relative w-full max-w-7xl h-[90vh] bg-[#0c0c0c] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] transform-gpu"
                    >
                        {/* --- Left Column: Context --- */}
                        <div className="hidden md:flex w-100 border-r border-white/5 flex-col bg-gradient-to-b from-white/[0.03] to-transparent p-10 overflow-y-auto no-scrollbar">
                            <div className="rounded-2xl overflow-hidden aspect-[2/3] border border-white/10 shadow-2xl mb-8 group transform-gpu">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
                                    alt={selectedMovie?.title}
                                />
                            </div>

                            <div className="space-y-10">
                                <section>
                                    <h4 className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase mb-3 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-cyan-500" />
                                        {genreName} Focus
                                    </h4>
                                    <p className="text-white/50 text-xs leading-relaxed italic mb-4">
                                        {genreData?.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {genreData?.focusAreas.map(area => (
                                            <li key={area} className="text-[11px] text-white/30 flex items-center gap-3">
                                                <ChevronRight size={10} className="text-white/20" /> {area}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-4 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        Key Cast
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {cast.slice(0, 5).map((c, i) => (
                                            <span key={i} className="text-[10px] text-white/40 px-2.5 py-1 bg-white/5 rounded border border-white/5">
                                                {c.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* --- Right Column: Interaction --- */}
                        <div className="flex-1 relative flex flex-col p-8 md:p-20 justify-center items-center text-center">
                            <button onClick={closeModal} className="absolute top-8 right-8 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                                <X size={20} />
                            </button>

                            <AnimatePresence mode="wait">
                                {step === 'preview' && (
                                    <motion.div key="preview" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="max-w-2xl">
                                        <h2 className="text-6xl md:text-8xl font-thin tracking-tighter mb-8 leading-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                                            {selectedMovie?.title}
                                        </h2>
                                        <p className="text-white/40 text-lg font-light mb-12 italic">Ready for an analytical deep-dive?</p>
                                        <div className="flex justify-center">
                                            <PrimaryButton onClick={() => setStep('rating')} icon={ChevronRight}>
                                                Start {currentGenreQs.length}-Metric Review
                                            </PrimaryButton>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'rating' && (
                                    <motion.div key="rating" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl flex flex-col items-center">
                                        {/* Progress Bar Header */}
                                        <div className="mb-16 w-full">
                                            <div className="flex justify-between items-end mb-4">
                                                <div className="text-left">
                                                    <span className="text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase block mb-1">
                                                        Metric {currentQuestion + 1} / {currentGenreQs.length}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isGenreSpecific ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                                            {isGenreSpecific ? `${genreName.toUpperCase()} SPECIALTY` : 'CORE CRITERIA'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold tracking-[0.2em] text-white/10 uppercase">
                                                    {Math.round(((currentQuestion + 1) / currentGenreQs.length) * 100)}% Complete
                                                </span>
                                            </div>
                                            <div className="w-full h-[1px] bg-white/5 overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${isGenreSpecific ? 'bg-cyan-500' : 'bg-white/60'}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${((currentQuestion + 1) / currentGenreQs.length) * 100}%` }}
                                                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                                />
                                            </div>
                                        </div>

                                        {/* Main Question Text */}
                                        <h3 className="text-4xl md:text-5xl font-extralight tracking-tight mb-8 leading-tight min-h-[140px]">
                                            {currentGenreQs[currentQuestion]?.text}
                                        </h3>

                                        {/* Question Focus Areas */}
                                        <div className="flex flex-wrap justify-center gap-3 mb-16">
                                            {currentGenreQs[currentQuestion]?.focusAreas?.map((focus, idx) => (
                                                <span key={idx} className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                                    <Target size={10} className="text-cyan-500/40" /> {focus}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stars */}
                                        <div className="relative mb-24" onMouseLeave={() => setHoverRating(0)}>
                                            <div className="flex gap-2">
                                                {[0, 1, 2, 3, 4].map(i => (
                                                    <RatingStar
                                                        key={i} index={i}
                                                        hoverValue={hoverRating}
                                                        onHover={setHoverRating}
                                                        onClick={(val) => handleRatingSubmit(val, currentGenreQs)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-white/20 font-bold whitespace-nowrap">
                                                {hoverRating > 0 ? `Assigning ${hoverRating}.0` : "Select Score"}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
                                            disabled={currentQuestion === 0}
                                            className="px-8 py-3 rounded-full border border-white/5 text-[9px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 hover:text-white hover:border-white/20 transition-all disabled:opacity-0"
                                        >
                                            <ChevronLeft size={12} /> Previous Metric
                                        </button>
                                    </motion.div>
                                )}

                                {step === 'result' && (
                                    <motion.div key="result" variants={contentVariants} initial="initial" animate="animate" className="flex flex-col items-center">
                                        <Trophy size={40} className="text-cyan-500/20 mb-8" />
                                        <div className="relative">
                                            <h2 className="text-[12rem] md:text-[15rem] font-thin leading-none tracking-tighter text-white">
                                                {finalRating?.toFixed(1)}
                                            </h2>
                                            <div className="absolute top-0 -right-8 h-full flex items-center">
                                                <div className="[writing-mode:vertical-lr] text-[10px] tracking-[1em] uppercase text-white/20 font-bold">
                                                    FINAL SCORE
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-8 mb-16">
                                            <Sparkles size={14} className="text-cyan-500/40" />
                                            <p className="text-[11px] tracking-[0.8em] text-white/30 uppercase">Analysis Logged</p>
                                        </div>
                                        <PrimaryButton onClick={closeModal}>
                                            Close Evaluation
                                        </PrimaryButton>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RatingModal;