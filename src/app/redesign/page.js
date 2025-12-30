"use client"
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, ChevronRight, Trophy, ChevronLeft, Star, StarHalf, Command
} from 'lucide-react';

// --- DATA LOGIC ---
import { GENRE_INFO } from '@/lib/GENRE_INFO';
import { QUESTIONS } from "@/lib/QUESTIONS";
import { TMDB_GENRE_MAP } from "@/lib/TMBD_GENRE_MAP";

const GENRE_NAME_TO_ID = Object.entries(TMDB_GENRE_MAP).reduce((acc, [id, name]) => {
    acc[name] = parseInt(id);
    return acc;
}, {});

const fade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 }
};

// --- COMPONENTS ---

const RatingStar = React.memo(({ index, hoverValue, ratingValue, onHover, onClick }) => {
    const starRef = useRef(null);
    const handleMove = useCallback((e) => {
        const rect = starRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isHalf = x < rect.width / 2;
        onHover(index + (isHalf ? 0.5 : 1));
    }, [index, onHover]);

    const activeValue = hoverValue || ratingValue;
    const isFull = activeValue >= index + 1;
    const isHalf = activeValue >= index + 0.5 && !isFull;

    return (
        <motion.div
            ref={starRef}
            onMouseMove={handleMove}
            onClick={() => onClick(activeValue)}
            className="relative cursor-pointer p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Star size={42} strokeWidth={1} className="text-white/20 transition-colors" />
            <div className="absolute inset-0 p-1 flex overflow-hidden pointer-events-none">
                {isHalf && <StarHalf size={42} strokeWidth={1} className="text-white fill-white" />}
                {isFull && <Star size={42} strokeWidth={1} className="text-white fill-white" />}
            </div>
        </motion.div>
    );
});

const MovieCard = React.memo(({ movie, onClick }) => (
    <motion.div
        whileHover={{ y: -10 }}
        onClick={() => onClick(movie)}
        className="min-w-[200px] w-[200px] cursor-pointer group/item"
    >
        <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/5 bg-white/5 relative shadow-2xl">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="w-full h-full object-cover grayscale-[0.3] group-hover/item:grayscale-0 transition-all duration-700"
                alt={movie.title}
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-[10px] tracking-widest font-medium uppercase border-b border-white/40 pb-1">Evaluate</span>
            </div>
        </div>
        <h3 className="mt-4 text-[12px] font-medium text-white/40 group-hover/item:text-white transition-colors truncate">
            {movie.title}
        </h3>
    </motion.div>
));

// --- MAIN PLATFORM ---

const ProfessionalRatingPlatform = () => {
    const [sections, setSections] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [step, setStep] = useState('idle');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [finalRating, setFinalRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // Search Specific State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Keyboard Shortcut (Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') setIsSearchOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Initial Data Fetch
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const genresToFetch = ['Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction'];
                const res = await fetch('/api/movies?limit=60');
                const data = await res.json();
                const allMovies = data.results || [];

                const validSections = genresToFetch.map(genreName => {
                    const genreId = GENRE_NAME_TO_ID[genreName];
                    return {
                        title: genreName,
                        movies: allMovies.filter(m => m.genre_ids?.includes(genreId)).slice(0, 10)
                    };
                }).filter(s => s.movies.length > 0);

                setSections(validSections);
                if (allMovies.length > 0) setFeatured(allMovies[0]);
            } catch (error) {
                console.error('Error loading:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Buffered Search Logic (Debounce)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const res = await fetch(`/api/movies?query=${encodeURIComponent(searchQuery)}`);
                    const data = await res.json();
                    setSearchResults(data.results || []);
                } catch (e) {
                    console.error("Search error", e);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const openRatingModal = useCallback(async (movie) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSelectedMovie(movie);
        setStep('preview');
        setCurrentQuestion(0);
        setAnswers({});

        try {
            const res = await fetch(`/api/movies?movieId=${movie.id}&append=credits`);
            const data = await res.json();
            setCast(data.credits?.cast?.slice(0, 6) || []);
        } catch (error) {
            setCast([]);
        }
    }, []);

    const PrimaryButton = ({ onClick, children, icon: Icon }) => (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-center gap-4 bg-white/5 border border-white/10 px-12 py-5 rounded-2xl transition-all duration-500 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <span className="text-[12px] font-bold tracking-[0.4em] uppercase z-10">{children}</span>
            {Icon && <Icon size={16} className="group-hover:translate-x-1 transition-transform" />}
        </motion.button>
    );

    const handleRatingSubmit = useCallback((val) => {
        const currentGenreQs = [...QUESTIONS.universal, ...(QUESTIONS[TMDB_GENRE_MAP[selectedMovie.genre_ids?.[0]]?.toLowerCase()] || [])];
        const newAnswers = { ...answers, [currentGenreQs[currentQuestion].id]: val };
        setAnswers(newAnswers);

        if (currentQuestion < currentGenreQs.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setHoverRating(0);
        } else {
            const totalScore = currentGenreQs.reduce((acc, curr) => acc + (newAnswers[curr.id] || 3) * curr.weight, 0);
            const totalWeight = currentGenreQs.reduce((acc, curr) => acc + curr.weight, 0);
            setFinalRating(Math.round((totalScore / totalWeight) * 2) / 2);
            setStep('result');
        }
    }, [selectedMovie, answers, currentQuestion]);

    const closeModal = useCallback(() => {
        setStep('idle');
        setSelectedMovie(null);
        setAnswers({});
        setSearchQuery('');
    }, []);

    const genreData = useMemo(() => {
        if (!selectedMovie) return null;
        return GENRE_INFO[TMDB_GENRE_MAP[selectedMovie.genre_ids?.[0]]] || GENRE_INFO['Drama'];
    }, [selectedMovie]);

    const currentGenreQs = useMemo(() => {
        if (!selectedMovie) return [];
        return [...QUESTIONS.universal, ...(QUESTIONS[TMDB_GENRE_MAP[selectedMovie.genre_ids?.[0]]?.toLowerCase()] || [])];
    }, [selectedMovie]);

    return (
        <div className="min-h-screen bg-[#050505] text-white/90 font-light tracking-tight selection:bg-white/20">

            {/* --- TOP NAV --- */}
            <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-12 py-6 backdrop-blur-md bg-[#050505]/40 border-b border-white/5">
                <div className="flex items-center gap-10">
                    <div className="text-xl font-medium tracking-widest flex items-center cursor-pointer" onClick={closeModal}>
                        MOOV<span className="opacity-40 ml-1">CRITIC</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* FIXED: Trigger Area for Search */}
                    <div
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/30 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all group w-72 shadow-lg"
                    >
                        <Search size={14} className="group-hover:text-white transition-colors" />
                        <span className="text-[11px] tracking-wider select-none">Search Repository...</span>
                        <div className="ml-auto flex items-center gap-1 opacity-40">
                            <Command size={10} /> <span className="text-[9px]">K</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
                        <img src="https://ui-avatars.com/api/?name=User&background=333&color=fff" alt="user" />
                    </div>
                </div>
            </nav>

            {/* --- APPLE-STYLE SEARCH OVERLAY --- */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ zIndex: 9999 }} // Ensure this is higher than the Nav (100) and Modal (300)
                        className="fixed inset-0 flex flex-col items-center pt-[15vh] px-6"
                    >
                        {/* Background Blur - Added pointer-events-auto to ensure clicks register */}
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                            animate={{ backdropFilter: "blur(20px)", opacity: 1 }}
                            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-black/80 cursor-pointer"
                        />

                        {/* Centered Modal */}
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0e0e0e] rounded-[2rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-[10000]"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <div className="flex items-center px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <Search className="text-white/40 mr-4" size={22} />
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none text-xl font-extralight placeholder:text-white/10 text-white"
                                    placeholder="Analyze cinematic works..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/20 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[70vh] overflow-y-auto no-scrollbar p-6 min-h-[200px]">
                                {searchResults.length > 0 ? (
                                    <div className="flex flex-col gap-6">
                                        {searchResults.map((movie) => (
                                            <div
                                                key={movie.id}
                                                onClick={() => openRatingModal(movie)}
                                                className="flex flex-row items-stretch gap-8 p-4 rounded-[2rem] hover:bg-white/[0.03] cursor-pointer transition-all group border border-transparent hover:border-white/10"
                                            >
                                                {/* Large Vertical Poster - Set to 45% width */}
                                                <div className="w-[45%] aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl flex-shrink-0">
                                                    {movie.poster_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                                            alt={movie.title}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-white/5 uppercase text-[10px] tracking-widest text-white/20">
                                                            No Poster
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Movie Information - Vertical Center */}
                                                <div className="flex flex-col justify-center flex-1 pr-6">
                        <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase mb-2 font-medium">
                            {TMDB_GENRE_MAP[movie.genre_ids?.[0]] || "Cinematic Work"}
                        </span>

                                                    <h4 className="text-3xl font-extralight tracking-tight text-white mb-4 leading-tight group-hover:text-white transition-colors">
                                                        {movie.title}
                                                    </h4>

                                                    <div className="flex items-center gap-6 mb-6">
                                                        <div className="flex items-center gap-2">
                                                            <Star size={14} className="text-white fill-white" />
                                                            <span className="text-sm font-medium text-white/60">
                                    {movie.vote_average?.toFixed(1)}
                                </span>
                                                        </div>
                                                        <div className="h-4 w-[1px] bg-white/10" />
                                                        <span className="text-sm text-white/40 font-light">
                                {movie.release_date?.split('-')[0] || "Release Unknown"}
                            </span>
                                                    </div>

                                                    <p className="text-white/30 text-xs leading-relaxed font-light line-clamp-3 mb-8">
                                                        {movie.overview}
                                                    </p>

                                                    <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Open Analysis <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchQuery.length > 1 ? (
                                    <div className="py-32 text-center">
                                        <div className="text-white/10 text-[10px] tracking-[0.5em] uppercase italic animate-pulse">
                                            Scanning Global Archives
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-32 text-center text-white/5 text-[10px] tracking-[0.4em] uppercase">
                                        Awaiting Command
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- CONTENT (Hero & Rows) --- */}
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
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
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
                                    <div className="h-[1px] flex-1 mx-8 bg-white/5" />
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

            {/* --- EVALUATION MODAL --- */}
            {/* --- EVALUATION MODAL --- */}
            <AnimatePresence>
                {step !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12"
                    >
                        {/* 1. BLURRED DYNAMIC BACKGROUND LAYER */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-0 overflow-hidden bg-[#050505]"
                        >
                            <motion.img
                                key={selectedMovie?.id}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1.1, opacity: 0.4 }} // 40% opacity to keep it moody
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                src={`https://image.tmdb.org/t/p/original${selectedMovie?.backdrop_path}`}
                                className="w-full h-full object-cover blur-[80px] saturate-[1.5]"
                                alt=""
                            />
                            {/* Dark Vignette to focus the center modal */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#050505]/80 to-[#050505]" />
                            <div className="absolute inset-0 cursor-zoom-out" onClick={closeModal} />
                        </motion.div>

                        {/* 2. THE MODAL CONTAINER */}
                        <motion.div
                            layoutId="modal"
                            initial={{ y: 100, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.9 }}
                            className="relative z-10 w-full max-w-7xl h-[90vh] bg-[#0c0c0c]/80 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
                        >
                            {/* --- Left Column: Context --- */}
                            <div className="w-full md:w-[400px] border-r border-white/5 flex flex-col bg-white/[0.02] p-10 overflow-y-auto no-scrollbar">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-2xl overflow-hidden aspect-[2/3] border border-white/10 shadow-2xl mb-8 group"
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                                        alt=""
                                    />
                                </motion.div>

                                <div className="space-y-10">
                                    <section>
                                        <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-4 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-white/20" /> Leading Talent
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {cast.map((c, i) => (
                                                <span key={i} className="text-[11px] text-white/60 font-light px-3 py-1 bg-white/5 rounded-md border border-white/5">
                                        {c.name}
                                    </span>
                                            ))}
                                        </div>
                                    </section>

                                    {genreData && (
                                        <section>
                                            <h4 className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-4 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-white/20" /> Analysis Focus
                                            </h4>
                                            <ul className="space-y-3">
                                                {genreData.focusAreas.map(area => (
                                                    <li key={area} className="text-[12px] text-white/40 flex items-center gap-3 italic">
                                                        <ChevronRight size={10} className="text-white/20" /> {area}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}
                                </div>
                            </div>

                            {/* --- Right Column: Interaction --- */}
                            <div className="flex-1 relative flex flex-col p-8 md:p-20 justify-center items-center text-center">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-8 right-8 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                                >
                                    <X size={20} strokeWidth={1.5}/>
                                </button>

                                <AnimatePresence mode="wait">
                                    {step === 'preview' && (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            className="max-w-2xl"
                                        >
                                            <h2 className="text-6xl md:text-8xl font-thin tracking-tighter mb-8 leading-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                                                {selectedMovie.title}
                                            </h2>
                                            <p className="text-white/40 text-lg md:text-xl font-light mb-12 leading-relaxed italic">
                                                "{selectedMovie.overview}"
                                            </p>
                                            <div className="flex justify-center">
                                                <PrimaryButton onClick={() => setStep('rating')} icon={ChevronRight}>
                                                    Start Analytical Review
                                                </PrimaryButton>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 'rating' && (
                                        <motion.div
                                            key="rating"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="w-full max-w-2xl flex flex-col items-center"
                                        >
                                            <div className="mb-20 w-full">
                                                <div className="flex justify-between items-end mb-4">
                                        <span className="text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase">
                                            Metric {currentQuestion + 1} of {currentGenreQs.length}
                                        </span>
                                                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/10 uppercase">
                                            {Math.round(((currentQuestion + 1) / currentGenreQs.length) * 100)}% Complete
                                        </span>
                                                </div>
                                                <div className="w-full h-[1px] bg-white/5 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-white/60"
                                                        animate={{ width: `${((currentQuestion + 1) / currentGenreQs.length) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <h3 className="text-4xl md:text-5xl font-extralight tracking-tight mb-16 leading-tight min-h-[120px]">
                                                {currentGenreQs[currentQuestion]?.text}
                                            </h3>

                                            <div className="relative mb-24" onMouseLeave={() => setHoverRating(0)}>
                                                <div className="flex gap-2">
                                                    {[0, 1, 2, 3, 4].map(i => (
                                                        <RatingStar
                                                            key={i} index={i}
                                                            hoverValue={hoverRating}
                                                            onHover={setHoverRating}
                                                            onClick={handleRatingSubmit}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-white/20 font-bold whitespace-nowrap">
                                                    {hoverRating > 0 ? `Select ${hoverRating} Stars` : "Awaiting Input"}
                                                </div>
                                            </div>

                                            {currentQuestion > 0 && (
                                                <button
                                                    onClick={() => setCurrentQuestion(q => q - 1)}
                                                    className="text-[10px] tracking-widest uppercase text-white/20 hover:text-white transition-colors"
                                                >
                                                    Back to previous metric
                                                </button>
                                            )}
                                        </motion.div>
                                    )}

                                    {step === 'result' && (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-8 border border-white/20">
                                                <Trophy className="text-white" size={40} />
                                            </div>
                                            <h2 className="text-[10px] tracking-[0.6em] uppercase text-white/40 mb-4">Critical Consensus</h2>
                                            <div className="text-9xl font-thin tracking-tighter mb-12">
                                                {finalRating}<span className="text-3xl text-white/20">/5</span>
                                            </div>
                                            <PrimaryButton onClick={closeModal}>
                                                Finalize Analysis
                                            </PrimaryButton>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && step === 'idle' && (
                <div className="h-screen flex flex-col items-center justify-center gap-8">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-[1px] border-white/5 rounded-full" />
                        <motion.div
                            className="absolute inset-0 border-t-[1px] border-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <div className="text-[10px] text-white/20 tracking-[0.6em] uppercase animate-pulse">Establishing Connection</div>
                </div>
            )}

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProfessionalRatingPlatform;