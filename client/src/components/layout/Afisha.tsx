import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  duration: string;
  genre: string;
  imageUrl: string;
  ageRating?: string;
  year?: number;
}

const Afisha: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("ВСЕ");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5218/api/Movies");
        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        setError("Не удалось загрузить список фильмов");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const genres = useMemo(() => {
    const allGenres = movies.flatMap(movie => 
      movie.genre.split(',').map(g => g.trim())
    );
    const uniqueGenres = Array.from(new Set(allGenres)).filter(Boolean);
    uniqueGenres.sort();
    return ["ВСЕ", ...uniqueGenres];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (selectedGenre === "ВСЕ") return movies;
    return movies.filter(movie => 
      movie.genre.split(',').some(g => g.trim() === selectedGenre)
    );
  }, [movies, selectedGenre]);

  if (loading) {
    return (
      <section className="px-8 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Загрузка фильмов...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cinema-accent text-white rounded-md"
          >
            Попробовать снова
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
      {/* Панель фильтрации жанров */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full uppercase whitespace-nowrap text-xs md:text-sm font-medium transition-all border-2 ${
              selectedGenre === genre
                ? "bg-cinema-accent text-white border-cinema-accent shadow-md"
                : "bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800 hover:border-gray-500"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Список фильмов */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="group rounded-lg hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {movie.ageRating && (
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-bold">
                    {movie.ageRating}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-white font-medium text-center line-clamp-2">
                  {movie.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          Нет фильмов в выбранном жанре
        </div>
      )}
    </section>
  );
};

export default Afisha;
