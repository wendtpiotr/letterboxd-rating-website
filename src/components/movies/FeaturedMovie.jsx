const FeaturedMovie = ({ movie, onStart }) => (
    <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            alt=""
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/20 to-transparent" />
        <div className="relative z-10 px-12 max-w-3xl">
      <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase mb-4 block font-medium">
        Spotlight Analysis
      </span>
            <h1 className="text-8xl font-thin tracking-tighter mb-6">{movie.title}</h1>
            <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-xl font-light">
                {movie.overview.slice(0, 160)}...
            </p>
            <button
                onClick={() => onStart(movie)}
                className="bg-white text-black px-10 py-3.5 rounded-full text-[11px] tracking-[0.2em] uppercase font-bold hover:scale-105 transition-all shadow-xl"
            >
                Initiate Review
            </button>
        </div>
    </section>
);

export default FeaturedMovie;
