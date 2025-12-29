"use client"
import {motion, AnimatePresence} from 'framer-motion';
import React, {useState, useEffect, useRef} from 'react';
import {
    Star, ChevronRight, RotateCcw, Film, Search,
    Clock, ArrowLeft, StarHalf, Info, Target, Trophy
} from 'lucide-react';
import {GENRE_INFO} from '@/lib/GENRE_INFO';
import {GENRES} from "@/lib/GENRES";
import {QUESTIONS} from "@/lib/QUESTIONS";
import {TMDB_GENRE_MAP} from "@/lib/TMBD_GENRE_MAP";


const RatingStar = ({index, hoverValue, ratingValue, onHover, onClick}) => {
    const starRef = useRef(null);
    const handleMove = (e) => {
        const rect = starRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isHalf = x < rect.width / 2;
        onHover(index + (isHalf ? 0.5 : 1));
    };

    const activeValue = hoverValue || ratingValue;
    const isFull = activeValue >= index + 1;
    const isHalf = activeValue >= index + 0.5 && !isFull;

    return (
        <motion.div
            ref={starRef}
            onMouseMove={handleMove}
            onClick={() => onClick(activeValue)}
            className="relative cursor-pointer p-1"
            whileHover={{scale: 1.25, rotate: 5}}
            whileTap={{scale: 0.9}}
        >
            <Star size={64} className="text-white/10 transition-colors"/>
            <div className="absolute inset-0 p-1 flex overflow-hidden pointer-events-none">
                {isHalf && <StarHalf size={64} className="text-green-500 fill-green-500"/>}
                {isFull && <Star size={64} className="text-green-500 fill-green-500"/>}
            </div>
        </motion.div>
    );
};

const MovieImage = ({path, alt, size = "w500", className = ""}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    if (!path) return <div className={`bg-slate-900 animate-pulse ${className}`}/>;
    return (
        <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
            <motion.img
                src={`https://image.tmdb.org/t/p/${size}${path}`}
                alt={alt}
                initial={{opacity: 0}}
                animate={{opacity: isLoaded ? 1 : 0}}
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default function RATR() {
    const [step, setStep] = useState('movie');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieDetails, setMovieDetails] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('Drama');
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [finalRating, setFinalRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [hoveredMovie, setHoveredMovie] = useState(null);

    // Inside your RATR component:
    const fetchMovies = async (query = '') => {
        // Call YOUR internal API route
        const endpoint = query
            ? `/api/movies?query=${encodeURIComponent(query)}`
            : `/api/movies`;

        const res = await fetch(endpoint);
        const data = await res.json();
        setMovies(data.results || []);
    };

    useEffect(() => {
        fetchMovies();
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) fetchMovies(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleMovieSelect = async (movie) => {
        setStep('preview');
        // Call YOUR internal API route for details
        const res = await fetch(`/api/movies?movieId=${movie.id}`);
        const details = await res.json();

        setMovieDetails(details);
        setSelectedMovie(movie);

        const mappedGenre = movie.genre_ids?.map(id => TMDB_GENRE_MAP[id])
            .find(name => GENRES.includes(name)) || 'Drama';
        setSelectedGenre(mappedGenre);
    };

    const allQuestions = [...QUESTIONS.universal];

    const handleAnswer = (val) => {
        const q = allQuestions[currentQuestion];
        const newAnswers = {...answers, [q.id]: val};
        setAnswers(newAnswers);

        if (currentQuestion < allQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setHoverRating(0);
        } else {
            const totalScore = allQuestions.reduce((acc, curr) => acc + (newAnswers[curr.id] || 3) * curr.weight, 0);
            const totalWeight = allQuestions.reduce((acc, curr) => acc + curr.weight, 0);
            setFinalRating(Math.round((totalScore / totalWeight) * 2) / 2);
            setStep('result');
        }
    };

    const getVerdict = (rating) => {
        if (rating >= 4.5) return {text: "MASTERPIECE", color: "text-green-400"};
        if (rating >= 3.5) return {text: "RECOMMENDED", color: "text-blue-400"};
        if (rating >= 2.5) return {text: "WATCHABLE", color: "text-yellow-400"};
        return {text: "SKIP IT", color: "text-red-400"};
    };

    const resetToHome = () => {
        setStep('movie');
        setMovieDetails(null);
        setSelectedMovie(null);
        setAnswers({});
        setCurrentQuestion(0);
        setFinalRating(null);
    };

    const activeBackdrop = movieDetails?.backdrop_path || hoveredMovie?.backdrop_path;
    const genreData = GENRE_INFO[selectedGenre] || GENRE_INFO['Drama'];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30 overflow-x-hidden font-sans">
            <AnimatePresence>
                {activeBackdrop && (
                    <motion.div
                        key={activeBackdrop}
                        initial={{opacity: 0}}
                        animate={{opacity: step === 'movie' ? 0.15 : 0.35}}
                        exit={{opacity: 0}}
                        transition={{duration: 1.5}}
                        className="fixed inset-0 z-0 pointer-events-none"
                    >
                        <img src={`https://image.tmdb.org/t/p/original${activeBackdrop}`}
                             className="w-full h-full object-cover blur-[110px] scale-110" alt=""/>
                        <div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/70 to-[#050505]"/>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <button onClick={resetToHome}
                            className="text-3xl font-black tracking-tighter hover:text-green-500 transition-colors">
                        RATR<span className="text-green-500">.</span>
                    </button>
                    {step === 'movie' && (
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-green-500/50 outline-none transition-all backdrop-blur-md"
                                placeholder="Search cinematic history..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {step === 'movie' && (
                        <motion.div
                            key="grid" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.95}}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                        >
                            {movies.map((movie, i) => (
                                <motion.div
                                    key={movie.id}
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0, transition: {delay: i * 0.03}}}
                                    whileHover={{y: -8}}
                                    onMouseEnter={() => setHoveredMovie(movie)}
                                    onMouseLeave={() => setHoveredMovie(null)}
                                    onClick={() => handleMovieSelect(movie)}
                                    className="cursor-pointer group relative"
                                >
                                    <MovieImage path={movie.poster_path} alt={movie.title}
                                                className="aspect-[2/3] rounded-2xl shadow-xl border border-white/10 group-hover:border-green-500/50 transition-colors"/>
                                    <div className="mt-3">
                                        <h3 className="font-bold text-sm truncate leading-tight mb-1">{movie.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{movie.release_date?.split('-')[0]}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {step === 'preview' && movieDetails && (
                        <motion.div
                            key="preview" initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, x: -20}}
                            className="grid lg:grid-cols-12 gap-12 pt-4 items-center"
                        >
                            <div className="lg:col-span-4 perspective-1000">
                                <motion.div initial={{rotateY: -10}} animate={{rotateY: 0}}
                                            transition={{type: "spring", stiffness: 50}}>
                                    <MovieImage path={movieDetails.poster_path} alt={movieDetails.title} size="original"
                                                className="rounded-[2.5rem] shadow-2xl border border-white/5"/>
                                </motion.div>
                            </div>
                            <div className="lg:col-span-8 space-y-8">
                                <button onClick={resetToHome}
                                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                                    <ArrowLeft size={14}/> Back to Library
                                </button>
                                <div className="space-y-2">
                                    <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-balance">{movieDetails.title}</h1>
                                    {movieDetails.tagline &&
                                        <p className="text-green-500 font-medium text-lg italic opacity-80">"{movieDetails.tagline}"</p>}
                                </div>
                                <div className="flex gap-4 items-center flex-wrap">
                                    <span
                                        className="bg-green-500 text-black px-4 py-1 rounded-full font-black text-xs uppercase">{selectedGenre}</span>
                                    <span
                                        className="flex items-center gap-2 text-slate-300 font-bold text-xs bg-white/5 px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-tighter">
                    <Clock size={12}/> {movieDetails.runtime} MIN
                  </span>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <p className="text-xs font-black text-green-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                        <Info size={14}/> Genre Overview
                                    </p>
                                    <p className="text-slate-300 leading-relaxed mb-4">{genreData.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {genreData.focusAreas.map(area => (
                                            <span key={area}
                                                  className="text-[10px] bg-white/10 px-3 py-1 rounded-md border border-white/5 text-slate-400 uppercase font-bold tracking-wider">{area}</span>
                                        ))}
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{scale: 1.02}}
                                    whileTap={{scale: 0.98}}
                                    onClick={() => setStep('questions')}
                                    className="bg-white text-black text-lg font-black py-6 px-12 rounded-2xl hover:bg-green-500 transition-colors flex items-center gap-3 w-full md:w-auto justify-center"
                                >
                                    COMMENCE RATING <ChevronRight size={20}/>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'questions' && (
                        <motion.div key="q" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, y: -20}} className="max-w-5xl mx-auto py-10">
                            <div className="grid lg:grid-cols-3 gap-12 items-start">
                                <div className="hidden lg:block space-y-6">
                                    <div
                                        className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 aspect-[2/3]">
                                        <MovieImage path={movieDetails.poster_path} size="w500"/>
                                    </div>
                                    <div
                                        className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <Target size={14}/> {selectedGenre} Focus
                                        </p>
                                        <ul className="space-y-3">
                                            {genreData.focusAreas.map((area, idx) => (
                                                <li key={idx}
                                                    className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"/>
                                                    {area}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 text-center lg:text-left py-12">
                                    <div className="mb-12">
                                        <div className="flex justify-between items-end mb-4">
                                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Metric {currentQuestion + 1} of {allQuestions.length}</p>
                                            <p className="text-xs font-black uppercase tracking-[0.3em] text-green-500">{Math.round(((currentQuestion + 1) / allQuestions.length) * 100)}%
                                                Complete</p>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div className="h-full bg-green-500" initial={{width: 0}}
                                                        animate={{width: `${((currentQuestion + 1) / allQuestions.length) * 100}%`}}
                                                        transition={{type: "spring", bounce: 0}}/>
                                        </div>
                                    </div>
                                    <motion.h2
                                        key={currentQuestion}
                                        initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                                        className="text-5xl md:text-7xl font-black mb-16 leading-[0.9] tracking-tighter"
                                    >
                                        {allQuestions[currentQuestion].text}
                                    </motion.h2>
                                    <div className="flex justify-center lg:justify-start gap-4 mb-16"
                                         onMouseLeave={() => setHoverRating(0)}>
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <RatingStar key={i} index={i} hoverValue={hoverRating} ratingValue={0}
                                                        onHover={setHoverRating} onClick={handleAnswer}/>
                                        ))}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <button onClick={() => handleAnswer(3)}
                                                className="text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] font-black text-xs px-8 py-4 border border-white/5 rounded-xl bg-white/5">Skip
                                            metric
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'result' && (
                        <motion.div key="res" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}}
                                    className="max-w-6xl mx-auto py-10">
                            <div
                                className="grid lg:grid-cols-12 gap-10 items-stretch bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full"/>

                                {/* Result Info */}
                                <div
                                    className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
                                    <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
                                        <Trophy size={16} className="text-green-500"/>
                                        <p className={`font-black tracking-[0.4em] uppercase text-xs ${getVerdict(finalRating).color}`}>
                                            Official Verdict: {getVerdict(finalRating).text}
                                        </p>
                                    </div>

                                    <motion.h2
                                        initial={{scale: 0.8, opacity: 0}}
                                        animate={{scale: 1, opacity: 1}}
                                        transition={{type: "spring", delay: 0.2}}
                                        className="text-[10rem] md:text-[14rem] font-black leading-none mb-4 tracking-tighter drop-shadow-2xl"
                                    >
                                        {finalRating.toFixed(1)}
                                    </motion.h2>

                                    <div className="flex justify-center lg:justify-start gap-3 mb-8">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <div key={s} className="relative">
                                                <Star size={32} className="text-white/5"/>
                                                <div className="absolute inset-0 flex overflow-hidden">
                                                    {finalRating >= s ?
                                                        <Star size={32} className="text-green-500 fill-green-500"/> :
                                                        finalRating >= s - 0.5 ? <StarHalf size={32}
                                                                                           className="text-green-500 fill-green-500"/> : null}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 className="text-4xl md:text-5xl font-black mb-3 uppercase tracking-tighter text-balance">{selectedMovie.title}</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-12">
                                        {selectedGenre} • {selectedMovie.release_date?.split('-')[0]} • {movieDetails.runtime}m
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button onClick={resetToHome}
                                                className="bg-white text-black font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-green-500 transition-all">
                                            <RotateCcw size={18}/> RATE ANOTHER
                                        </button>
                                        <a href={`https://letterboxd.com/search/films/${encodeURIComponent(selectedMovie.title)}/`}
                                           target="_blank"
                                           className="bg-[#40bcf4] text-black font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                                            <Film size={18}/> OPEN LETTERBOXD
                                        </a>
                                    </div>
                                </div>

                                {/* The Poster on Result Page */}
                                <div
                                    className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center lg:justify-end">
                                    <motion.div
                                        initial={{rotate: 10, y: 40, opacity: 0}}
                                        animate={{rotate: 0, y: 0, opacity: 1}}
                                        transition={{type: "spring", stiffness: 40, delay: 0.4}}
                                        className="w-full max-w-[340px] aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 relative group"
                                    >
                                        <MovieImage path={movieDetails.poster_path} alt="Final Score Poster"
                                                    size="original"/>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <p className="text-[10px] font-black tracking-[0.3em] text-white">GENRE
                                                FOCUS: {selectedGenre}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

                body {
                    font-family: 'Inter', sans-serif;
                }

                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
}