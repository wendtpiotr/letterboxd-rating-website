import { useState, useEffect } from 'react';
import { TMDB_GENRE_MAP } from "@/lib/TMBD_GENRE_MAP";

export const useMovies = (limit = 60, genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction']) => {
    const [sections, setSections] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/movies?limit=${limit}`);
                const data = await res.json();
                const allMovies = data.results || [];

                const validSections = genres
                    .map(name => {
                        // 1. Normalize name for "Science Fiction" vs "SciFi"
                        const searchName = name === 'Science Fiction' ? 'SciFi' : name;

                        // 2. Find the ID by looking at the VALUES of the map
                        const genreId = Object.keys(TMDB_GENRE_MAP).find(
                            id => TMDB_GENRE_MAP[id] === searchName
                        );

                        if (!genreId) {
                            console.warn(`Genre name "${name}" not found in TMDB_GENRE_MAP`);
                            return null;
                        }

                        // 3. Filter movies. Convert genreId to Number because Object.keys returns strings.
                        const filteredMovies = allMovies.filter(movie =>
                            movie.genre_ids?.includes(Number(genreId))
                        );

                        return {
                            title: name,
                            movies: filteredMovies.slice(0, 10)
                        };
                    })
                    .filter(section => section !== null && section.movies.length > 0);

                setSections(validSections);

                if (allMovies.length > 0) {
                    setFeatured(allMovies[0]);
                }
            } catch (err) {
                console.error("Error loading movies:", err);
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, [limit]); // Added genres to dependency array for safety

    return { sections, featured, loading };
};