import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  duration: string;
  genre: string;
  imageUrl: string;
  description?: string;
  director?: string;
  year?: number;
  ageRating?: string;
  trailerUrl?: string;
  backgroundImageUrl?: string;
}

interface SessionData {
  id: number;
  time: string;
  hall: string;
  date: string;
}

const hallDescriptions: Record<string, string> = {
  'Зал 1 (Стандартный)': 'Стандартный зал',
  'Зал 2 (Комфортный)': 'Комфортный зал',
  'VIP Зал': 'VIP-зал',
};

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const movieResponse = await fetch(`http://localhost:5218/api/Movies/${id}`);
        if (!movieResponse.ok) {
          throw new Error('Не удалось загрузить информацию о фильме');
        }
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Здесь можно добавить загрузку сеансов, если они есть в вашей БД
        // const sessionsResponse = await fetch(`http://localhost:5218/api/Sessions?movieId=${id}`);
        // const sessionsData = await sessionsResponse.json();
        // setSessions(sessionsData);

      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Не удалось загрузить информацию о фильме');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  const handleBookTicket = () => {
    if (!movie) return;
    
    navigate(`/booking/${movie.id}`, {
      state: {
        movie,
        bookingType: 'full'
      }
    });
  };

  const handleSessionClick = (session: SessionData) => {
    if (!movie) return;
    
    navigate(`/booking/${session.id}`, {
      state: {
        movie,
        bookingType: 'quick',
        sessionData: session
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white text-xl">{error || 'Фильм не найден'}</div>
        <Link
          to="/"
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-black">
      {movie.backgroundImageUrl && (
        <div className="fixed inset-0 z-0">
          <img
            src={movie.backgroundImageUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/20"></div>
        </div>
      )}

      <div className="relative z-10 mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
            <div className="w-full md:w-1/4">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl mt-4">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-3/4 flex flex-col">
              <h1 className="text-3xl lg:text-4xl font-bold text-white uppercase mb-4 tracking-tight mt-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-3 mb-4">
                {movie.genre.split(',').map((g, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 bg-transparent text-white rounded-full text-sm font-medium border border-white/50"
                  >
                    {g.trim()}
                  </span>
                ))}
                {movie.ageRating && (
                  <span className="px-4 py-1 bg-transparent text-white rounded-full text-sm font-medium border border-white/50">
                    {movie.ageRating}
                  </span>
                )}
              </div>

              {movie.description && (
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-4 max-w-3xl">
                  {movie.description}
                </p>
              )}

              {sessions.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Clock size={20} className="text-cinema-accent" />
                    Выберите сеанс
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {sessions.map(session => (
                      <button
                        key={session.id}
                        onClick={() => handleSessionClick(session)}
                        className="flex flex-col items-center justify-center w-16 h-16 bg-white/10 text-white rounded-lg border border-white/30 hover:bg-white/20 transition relative overflow-hidden text-[10px] font-medium"
                      >
                        <span className="text-sm font-bold">{session.time}</span>
                        <span className="opacity-70">
                          {hallDescriptions[session.hall] || session.hall}
                        </span>
                        <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition duration-300"></span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleBookTicket}
                  className="self-start px-8 py-3 bg-cinema-accent text-white rounded-full text-base font-bold hover:bg-cinema-mouse transition hover:scale-105 mt-6"
                >
                  Купить билет
                </button>
              )}
            </div>
          </div>

          {movie.trailerUrl && (
            <div className="w-full mb-12 mt-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-white uppercase mb-6 tracking-wider">
                Официальный трейлер
              </h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/50 border border-white/20">
                <iframe
                  width="100%"
                  height="100%"
                  src={movie.trailerUrl}
                  title={`${movie.title} трейлер`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;