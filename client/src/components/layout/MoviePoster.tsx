import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

interface Movie {
    id: number;
    title: string;
    duration: number;
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragStartX, setDragStartX] = useState<number | null>(null);
    const [hasSwiped, setHasSwiped] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/Movies/now-playing?take=10');
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const data = await response.json();
                setMovies(data);
                const center = Math.floor(data.length / 2);
                setActiveIndex(center);
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

    const coverflowStyles = (index: number) => {
        const offset = index - activeIndex;
        const abs = Math.abs(offset);
        const translateX = offset * 150;
        const rotateY = offset * -26;
        const tilt = offset * -1.5;
        const translateZ = Math.max(90, 260 - abs * 60);
        const scale = offset === 0 ? 1.06 : 0.9;

        return {
            transform: `
                translate(-50%, -50%)
                translateX(${translateX}px)
                translateZ(${translateZ}px)
                rotateY(${rotateY}deg)
                rotateZ(${tilt}deg)
                scale(${scale})
            `,
            transformOrigin: "center center",
            zIndex: movies.length - abs,
            filter: offset === 0 ? "none" : "grayscale(0.08) brightness(0.96)",
            opacity: abs > 5 ? 0 : 1,
            transition: "transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1), filter 320ms ease, opacity 280ms ease",
            boxShadow: offset === 0 
              ? "0 20px 50px rgba(0,0,0,0.45)" 
              : "0 10px 30px rgba(0,0,0,0.3)",
        } as React.CSSProperties;
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setDragStartX(e.clientX);
        setHasSwiped(false);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (dragStartX === null || hasSwiped) return;
        const deltaX = e.clientX - dragStartX;
        if (Math.abs(deltaX) > 60) {
            if (deltaX < 0) {
                setActiveIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
            } else {
                setActiveIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
            }
            setHasSwiped(true);
        }
    };

    const handlePointerUp = () => {
        setDragStartX(null);
        setHasSwiped(false);
    };

    return (
        <section className="px-8 py-10 bg-cinema-primary text-cinema-text space-y-10">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Сейчас в кино</h2>
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
                        state={{ movie, source: "tmdb" }}
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

            {/* <div className="flex items-center justify-between pt-2">
                <h3 className="text-3xl font-bold text-white">Скоро в кино</h3>
                <span className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-white/25 to-transparent" />
            </div>

            <div className="relative mt-6 rounded-2xl bg-gradient-to-br from-black via-cinema-secondary to-black border border-white/5 px-4 md:px-8 py-8 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(228,90,31,0.1),transparent_35%)]" />

                <div 
                    className="relative h-[320px] md:h-[380px] touch-pan-y" 
                    style={{ perspective: "1400px" }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <div className="absolute inset-0 left-1/2 top-1/2">
                        {movies.map((movie, index) => (
                            <div
                                key={movie.id}
                                className="absolute origin-center drop-shadow-2xl cursor-pointer"
                                style={coverflowStyles(index)}
                                onClick={() => setActiveIndex(index)}
                            >
                                <div className="relative w-[180px] md:w-[220px] aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/60">
                                    <img
                                        src={movie.imageUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                        <p className="text-white font-semibold text-sm line-clamp-2">
                                            {movie.title}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 mt-6 flex justify-center gap-2">
                    {movies.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-2 w-2 rounded-full transition-all ${
                                idx === activeIndex ? "w-6 bg-cinema-accent" : "bg-white/30 hover:bg-white/60"
                            }`}
                            aria-label={`Показать постер ${idx + 1}`}
                        />
                    ))}
                </div>
            </div> */}
        </section>
    );
};

export default MoviePoster;