import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  duration: number;
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
  const [genres, setGenres] = useState<string[]>(["ВСЕ"]);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Загрузка всех фильмов при монтировании
  useEffect(() => {
    let isMounted = true;

    const fetchInitialMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/Movies/now-playing?take=40");
        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data: Movie[] = await response.json();
        
        if (isMounted) {
          setMovies(data);
          
          const allGenres = data.flatMap(movie => 
            movie.genre.split(',').map(g => g.trim()).filter(Boolean)
          );
          const uniqueGenres = Array.from(new Set(allGenres)).sort();
          setGenres(["ВСЕ", ...uniqueGenres]);

          // Инициализация состояний загрузки изображений
          const initialLoadingStates: Record<number, boolean> = {};
          data.forEach(movie => {
            initialLoadingStates[movie.id] = true;
          });
          setImageLoadingStates(initialLoadingStates);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Ошибка загрузки:", error);
          setError("Не удалось загрузить список фильмов");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  // Фильтрация фильмов по выбранному жанру и поисковому запросу
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // Фильтрация по жанру
    if (selectedGenre !== "ВСЕ") {
      filtered = filtered.filter(movie => 
        movie.genre.split(',').map(g => g.trim()).includes(selectedGenre)
      );
    }

    // Фильтрация по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [movies, selectedGenre, searchQuery]);

  const handleImageLoad = (movieId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [movieId]: false,
    }));
  };

  if (loading) {
    return (
      <section className="px-8 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
        <div className="flex justify-center items-center h-64">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white text-xl"
          >
            Загрузка фильмов...
          </motion.div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center h-64"
        >
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cinema-accent text-white rounded-md hover:bg-cinema-accent/90 transition-colors"
          >
            Попробовать снова
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-8 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
      {/* Поиск по фильмам */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск фильмов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-accent focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Панель фильтрации жанров */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar"
      >
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
      </motion.div>

      {/* Список фильмов */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <motion.div 
              key={movie.id} 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/movie/${movie.id}`}
                state={{ movie, source: "tmdb" }}
                className="group rounded-lg block transform transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                  {imageLoadingStates[movie.id] && (
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0.5 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        repeatType: "reverse",
                      }}
                      className="absolute inset-0 bg-gray-700"
                    />
                  )}
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className={`w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 ${
                      imageLoadingStates[movie.id] ? "opacity-0" : "opacity-100"
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(movie.id)}
                    onError={() => handleImageLoad(movie.id)}
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
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-12 text-gray-400 col-span-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchQuery.trim() 
              ? `Не найдено фильмов по запросу "${searchQuery}"`
              : "Нет фильмов в выбранном жанре"
            }
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Afisha;