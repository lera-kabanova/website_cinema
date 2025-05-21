import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Session {
  id: number;
  time: string;
  hall: string;
  date: string;
  zones: { id: number; name: string; basePrice: number }[];
}

interface Movie {
  id: number;
  title: string;
  duration: string;
  genre: string;
  imageUrl: string;
  backgroundImageUrl?: string;
}

interface MovieSessionsProps {
  sessions: Session[];
  movie: Movie;
}

const MovieSessions: React.FC<MovieSessionsProps> = ({ sessions, movie }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSessionClick = (session: Session) => {
    navigate(`/booking/${session.id}`, {
      state: {
        movie,
        bookingType: 'quick',
        sessionData: {
          id: session.id,
          time: session.time,
          hall: session.hall,
          date: session.date,
          zones: session.zones,
        },
      },
    });
  };

  return (
    <div className="mt-6">
      {location.state?.fromSchedule ? null : (
        <h2 className="text-2xl font-bold mb-4 text-white">Доступные сеансы</h2>
      )}
      {sessions.length ? (
        <div className="flex flex-wrap gap-2">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session)}
              className="border border-white/30 rounded-md text-center px-3 py-2 text-sm inline-flex items-start justify-center min-w-[100px] cursor-pointer hover:bg-white/10 transition"
            >
              {session.time} • {session.hall}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">Нет доступных сеансов</p>
      )}
    </div>
  );
};

export default MovieSessions;