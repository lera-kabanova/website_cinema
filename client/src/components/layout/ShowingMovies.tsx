import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const formatDuration = (minutes: number | string): string => {
  // Если пришла строка, пытаемся преобразовать в число
  const mins = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes;
  
  // Проверка на NaN и отрицательные значения
  if (isNaN(mins) || mins < 0) return '0 мин';
  
  const hours = Math.floor(mins / 60);
  const remainingMinutes = mins % 60;
  
  let result = '';
  if (hours > 0) {
    result += `${hours}ч`;
  }
  if (remainingMinutes > 0) {
    if (result) result += ' ';
    result += `${remainingMinutes}мин`;
  }
  
  return result || '0 мин';
};

interface Movie {
  id: number;
  title: string;
  duration: number; // Изменено с string на number
  genre: string;
  imageUrl: string;
  ageRating?: string;
  year?: number;
  description?: string;
  trailerUrl?: string;
  backgroundImageUrl?: string;
}

export default function NowShowingHero() {
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const currentMovie = moviesData[currentIndex] || {};

useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/Movies/now-playing?take=6');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setMoviesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
}, []);



  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1); 
      }
      if (urlObj.hostname.includes("youtube.com")) {
        if (urlObj.pathname.startsWith("/embed/")) {
          return urlObj.pathname.split("/embed/")[1].split("?")[0]; 
        }
        if (urlObj.searchParams.has("v")) {
          return urlObj.searchParams.get("v");
        }
      }
    } catch (e) {
      console.error("Неверный URL трейлера:", url);
    }
    return null;
  };

  const youtubeId = getYouTubeId(currentMovie.trailerUrl);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (moviesData.length > 1 && !isTransitioning) {
      intervalRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(prev => (prev === moviesData.length - 1 ? 0 : prev + 1));
          setIsTransitioning(false);
        }, 700);
      }, 10000);
    }
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const openTrailer = () => {
    if (youtubeId) {
      stopAutoPlay();
      setShowTrailer(true);
    }
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    startAutoPlay();
  };

  const nextMovie = () => {
    if (!showTrailer && moviesData.length > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev === moviesData.length - 1 ? 0 : prev + 1));
        setIsTransitioning(false);
      }, 700);
    }
  };

  const prevMovie = () => {
    if (moviesData.length > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev === 0 ? moviesData.length - 1 : prev - 1));
        setIsTransitioning(false);
      }, 700);
    }
  };

  const goToMovie = (index: number) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 700);
    }
  };

  useEffect(() => {
    if (moviesData.length > 0 && !showTrailer) {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [currentIndex, showTrailer, moviesData, isTransitioning]);

  if (isLoading) {
    return (
      <section className="relative w-full h-[100vh] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка данных...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full h-[100vh] bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </section>
    );
  }

  if (moviesData.length === 0) {
    return (
      <section className="relative w-full h-[100vh] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Нет доступных фильмов</div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[100vh] bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      {/* Фоновое изображение с плавным появлением */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src={currentMovie.backgroundImageUrl || currentMovie.imageUrl}
            alt={`${currentMovie.title} Background`}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ${
              isTransitioning ? 'opacity-0' : 'opacity-40'
            }`}
          />
          {/* Предзагрузка следующего изображения */}
          {moviesData.length > 1 && (
            <img
              src={
                moviesData[
                  currentIndex === moviesData.length - 1 ? 0 : currentIndex + 1
                ].backgroundImageUrl || 
                moviesData[
                  currentIndex === moviesData.length - 1 ? 0 : currentIndex + 1
                ].imageUrl
              }
              alt="Next movie background"
              className="w-full h-full object-cover absolute inset-0 opacity-0"
              loading="eager"
            />
          )}
        </div>
      </div>

      {/* Кнопки навигации */}
      <button 
        onClick={prevMovie}
        className={`absolute left-4 top-1/2 z-20 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center transition-all duration-300 ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/70 hover:scale-110'
        }`}
        aria-label="Previous movie"
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={nextMovie}
        className={`absolute right-4 top-1/2 z-20 h-12 w-12 rounded-full bg-black/50 text-white flex items-center justify-center transition-all duration-300 ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/70 hover:scale-110'
        }`}
        aria-label="Next movie"
        disabled={isTransitioning}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Кнопка трейлера */}
      {youtubeId && (
        <div className={`absolute right-[300px] top-1/2 transform -translate-y-1/2 z-20 transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          <button 
            onClick={openTrailer}
            className="flex items-center gap-3 border-cinema-accent font-medium hover:underline group"
            disabled={isTransitioning}
          >
            <span className="w-14 h-14 rounded-full border-2 border-cinema-accent flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
              <span className="absolute inset-0 rounded-full bg-cinema-accent opacity-30 blur-lg animate-pulse"></span>
              <Play className="w-6 h-6 z-10 text-white" />
            </span>
            <span className="text-white text-base">Трейлер</span>
          </button>
        </div>
      )}

      {/* Контент фильма */}
      <div 
        key={`movie-content-${currentIndex}`}
        className="relative z-10 max-w-6xl mx-auto px-6 py-10 h-full flex flex-col justify-end"
      >
        <div className={`max-w-2xl transition-all duration-700 ease-out ${
          isTransitioning 
            ? 'opacity-0 translate-y-10' 
            : 'opacity-100 translate-y-0'
        }`}>
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            {currentMovie.title}
          </h2>

          <div className="flex gap-3 text-sm text-gray-300 mb-3 items-center">
            {currentMovie.year && (
              <>
                <span>{currentMovie.year}</span>
                <span className="text-gray-300">|</span>
              </>
            )}
            {currentMovie.ageRating && (
              <>
                <span className="px-2 py-0.5 bg-cinema-accent rounded text-white font-semibold">
                  {currentMovie.ageRating}
                </span>
                <span className="text-gray-300">|</span>
              </>
            )}
            <span>{formatDuration(currentMovie.duration)}</span>
            <span className="text-gray-300">|</span>
            <span>{currentMovie.genre}</span>
          </div>

          {currentMovie.description && (
            <p className="text-gray-300 text-sm mb-6">
              {currentMovie.description}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button 
              className="bg-cinema-accent text-white font-semibold px-6 py-2 hover:bg-cinema-mouse rounded transition-colors"
              disabled={isTransitioning}
            >
              Купить билет
            </button>
          </div>
        </div>
      </div>

      {/* Индикаторы */}
      {moviesData.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {moviesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToMovie(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-cinema-accent w-6' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${moviesData[index].title}`}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}

      {/* Модальное окно трейлера */}
      {showTrailer && youtubeId && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={closeTrailer}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-50"
              aria-label="Закрыть трейлер"
            >
              <X className="w-8 h-8" />
            </button>
            
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Трейлер: ${currentMovie.title}`}
            />
          </div>
        </div>
      )}
    </section>
  );
}