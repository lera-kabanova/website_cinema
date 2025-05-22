import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black/80 text-white py-6 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 text-center">
        <div className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Racing Sans One', cursive" }}>
          CINEMA
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center justify-center">
          <Link to="/about" className="text-cinema-accent hover:underline text-sm">О нас</Link>
          <Link to="/privacy" className="text-cinema-accent hover:underline text-sm">Политика конфиденциальности</Link>
          <Link to="/terms" className="text-cinema-accent hover:underline text-sm">Политика использования</Link>
          <Link to="/contacts" className="text-cinema-accent hover:underline text-sm">Контакты</Link>
        </div>
        <div className="text-sm text-gray-400">© {new Date().getFullYear()} Все права защищены</div>
      </div>
    </footer>
  );
};

export default Footer; 