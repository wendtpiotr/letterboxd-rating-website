// app/api/movies/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const movieId = searchParams.get('movieId');

    const API_KEY = process.env.TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    let endpoint = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

    if (movieId) {
        endpoint = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,images`;
    } else if (query) {
        endpoint = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    }

    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}