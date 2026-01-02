import {AnimatePresence, motion} from "framer-motion";
import {ChevronRight, Search, Star, X} from "lucide-react";
import {TMDB_GENRE_MAP} from "@/lib/TMBD_GENRE_MAP";
import {useState} from "react";
import useDebounce from "@/hooks/useDebounce";

const SearchOverlay = ({isSearchOpen, onSearchClose, onMovieSelect}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useDebounce(searchQuery, async (query) => {
        if (query.trim().length > 1) {
            try {
                const res = await fetch(`/api/movies?query=${encodeURIComponent(query)}`);
                const data = await res.json();
                setSearchResults(data.results || []);
            } catch (e) {
                console.error("Search error", e);
            }
        } else {
            setSearchResults([]);
        }
    }, 300)

    return (<AnimatePresence>
        {isSearchOpen && (<motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 flex flex-col items-center pt-[15vh] px-6 z-100"
        >
            <motion.div
                initial={{backdropFilter: "blur(0px)", opacity: 0}}
                animate={{backdropFilter: "blur(8px)", opacity: 1}}
                exit={{backdropFilter: "blur(0px)", opacity: 0}}
                onClick={onSearchClose}
                className="absolute inset-0 bg-black/80 cursor-pointer"
            />

            {/* Centered Modal */}
            <motion.div
                initial={{scale: 0.95, y: 20}}
                animate={{scale: 1, y: 0}}
                exit={{scale: 0.95, y: 20}}
                className="relative w-full max-w-2xl bg-[#0e0e0e] rounded-4xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-10000"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex items-center px-8 py-6 border-b border-white/5 bg-white/2">
                    <Search className="text-white/40 mr-4" size={22}/>
                    <input
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-xl font-extralight placeholder:text-white/10 text-white"
                        placeholder="Analyze cinematic works..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        onClick={onSearchClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/20 hover:text-white"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Results Area */}
                <div className="max-h-[70vh] overflow-y-auto no-scrollbar p-6 min-h-50">
                    {searchResults.length > 0 ? (<div className="flex flex-col gap-6">
                        {searchResults.map((movie) => (<div
                            key={movie.id}
                            onClick={() => onMovieSelect(movie)}
                            className="flex flex-row items-stretch gap-8 p-4 rounded-4xl hover:bg-white/3 cursor-pointer transition-all group border border-transparent hover:border-white/10"
                        >
                            {/* Large Vertical Poster - Set to 45% width */}
                            <div
                                className="w-[45%] aspect-2/3 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl shrink-0">
                                {movie.poster_path ? (<img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    alt={movie.title}
                                />) : (<div
                                    className="w-full h-full flex items-center justify-center bg-white/5 uppercase text-[10px] tracking-widest text-white/20">
                                    No Poster
                                </div>)}
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
                                        <Star size={14} className="text-white fill-white"/>
                                        <span className="text-sm font-medium text-white/60">
                                    {movie.vote_average?.toFixed(1)}
                                </span>
                                    </div>
                                    <div className="h-4 w-px bg-white/10"/>
                                    <span className="text-sm text-white/40 font-light">
                                {movie.release_date?.split('-')[0] || "Release Unknown"}
                            </span>
                                </div>

                                <p className="text-white/30 text-xs leading-relaxed font-light line-clamp-3 mb-8">
                                    {movie.overview}
                                </p>

                                <div
                                    className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open Analysis <ChevronRight size={14}/>
                                </div>
                            </div>
                        </div>))}
                    </div>) : searchQuery.length > 1 ? (<div className="py-32 text-center">
                        <div
                            className="text-white/10 text-[10px] tracking-[0.5em] uppercase italic animate-pulse">
                            Scanning Global Archives
                        </div>
                    </div>) : (
                        <div className="py-32 text-center text-white/5 text-[10px] tracking-[0.4em] uppercase">
                            Awaiting Command
                        </div>)}
                </div>
            </motion.div>
        </motion.div>)}
    </AnimatePresence>)
}
export default SearchOverlay;