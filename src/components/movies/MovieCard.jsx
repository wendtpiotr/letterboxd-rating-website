import { motion } from 'framer-motion';

const MovieCard = ({ movie, onClick }) => (
    <motion.div
        whileHover={{ y: -10 }}
        onClick={() => onClick(movie)}
        className="min-w-50 w-50 cursor-pointer group/item"
    >
        <div className="aspect-2/3 rounded-lg overflow-hidden border border-white/5 bg-white/5 relative shadow-2xl">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="w-full h-full object-cover grayscale-[0.3] group-hover/item:grayscale-0 transition-all duration-700"
                alt={movie.title}
                loading="lazy"
            />
            <div
                className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
            >
                <span className="text-[10px] tracking-widest font-medium uppercase border-b border-white/40 pb-1">
                    Evaluate
                </span>
            </div>
        </div>
        <h3 className="mt-4 text-[12px] font-medium text-white/40 group-hover/item:text-white transition-colors truncate">
            {movie.title}
        </h3>
    </motion.div>
);

// Wrap with React.memo before exporting
export default MovieCard;
