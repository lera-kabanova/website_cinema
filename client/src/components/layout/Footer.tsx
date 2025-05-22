import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Логотип и описание */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold tracking-wide mb-2" style={{ fontFamily: "'Racing Sans One', cursive" }}>
              CINEMA
            </div>
            <p className="text-gray-400 text-xs">
              Данные о киносеансах и бронировании. Автоматическая система отслеживает статистику просмотров.
            </p>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h3 className="text-sm font-semibold mb-2">ПОЛЕЗНЫЕ ССЫЛКИ</h3>
            <ul className="space-y-1 text-xs">
              <li><Link to="/" className="text-gray-400 hover:text-cinema-accent transition">Главная</Link></li>
              <li><Link to="/movies" className="text-gray-400 hover:text-cinema-accent transition">Фильмы</Link></li>
              <li><Link to="/my-list" className="text-gray-400 hover:text-cinema-accent transition">Мой список</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-cinema-accent transition">Условия использования</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-cinema-accent transition">Политика конфиденциальности</Link></li>
            </ul>
          </div>

          {/* Наши каналы */}
          <div>
            <h3 className="text-sm font-semibold mb-2">НАШИ КАНАЛЫ</h3>
            <ul className="space-y-1 text-xs">
              <li><a href="#" className="text-gray-400 hover:text-cinema-accent transition">Deloitte Optio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cinema-accent transition">Non MM Menu</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cinema-accent transition">Cost Formation NDAA</a></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold mb-2">КОНТАКТЫ</h3>
            <address className="text-gray-400 not-italic space-y-1 text-xs">
              <p>ул. Домашняя</p>
              <p>Город, Магазин 123456</p>
              <p>Австралия</p>
              <p>+1 2345 6789 00</p>
              <p>info@example.com</p>
            </address>
          </div>
        </div>

        {/* Копирайт */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-500 text-xs">
          <p>© Copyright <strong className="text-white">Cinema Technology</strong>. Все права защищены</p>
          <p className="mt-1">Обозначение климата: Повышение</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;