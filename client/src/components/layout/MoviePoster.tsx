import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

interface Movie {
    id: number;
    title: string;
    duration: string;
    genre: string;
    imageUrl: string;
    ageRating?: string;
    year?: number;
    description?: string;
    trailerUrl?: string;
    backgroundImageUrl?: string;
}

const MoviePoster: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('http://localhost:5218/api/Movies/mini');
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                setError('Не удалось загрузить список фильмов');
                console.error('Ошибка загрузки:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) {
        return (
            <section className="px-8 py-6 bg-cinema-primary text-cinema-text">
                <div className="flex items-center justify-center h-64">
                    <div className="text-white text-xl">Загрузка...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-8 py-6 bg-cinema-primary text-cinema-text">
                <div className="flex items-center justify-center h-64">
                    <div className="text-white text-xl">{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="px-8 py-6 bg-cinema-primary text-cinema-text">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                    Сейчас в кино
                </h2>
                <Link 
                    to="/afisha" 
                    className="px-4 py-2 bg-cinema-accent text-white rounded-md text-sm font-medium hover:bg-cinema-accent/90 transition"
                >
                    Вся афиша →
                </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
                {movies.map((movie) => (
                    <Link 
                        to={`/movie/${movie.id}`}
                        key={movie.id} 
                        className="group rounded-lg hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                            <img 
                                src={movie.imageUrl} 
                                alt={movie.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-medium text-center line-clamp-2">
                                    {movie.title}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <div className="flex gap-2 text-sm text-gray-400 justify-center">
                                <span>{movie.duration}</span>
                                <span>|</span>
                                <span>{movie.genre}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default MoviePoster;