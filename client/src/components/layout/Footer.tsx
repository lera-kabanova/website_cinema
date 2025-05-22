import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-cinema-accent pt-8 pb-4 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        <div>
          <div
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "'Racing Sans One', cursive" }}
          >
            CINEMA
          </div>
          <p className="text-gray-300 mb-3 leading-snug">
             Наслаждайтесь просмотром в нашем кинотеатре.
          </p>
          <div className="flex gap-3 text-white text-lg">
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://youtube.com" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Полезные ссылки</h3>
          <ul className="space-y-1 text-gray-300">
            <li><Link to="/about" className="hover:text-gray-500">О нас</Link></li>
            <li><Link to="/privacy" className="hover:text-gray-500">Политика конфиденциальности</Link></li>
            <li><Link to="/terms" className="hover:text-gray-500">Политика использования</Link></li>
            <li><Link to="/contacts" className="hover:text-gray-500">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Наши кинотеатры</h3>
          <ul className="space-y-1 text-gray-300">
            <li>Синема Парк</li>
            <li>Киносфера</li>
            <li>Аврора</li>
            <li>Фалькон</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Контакты</h3>
          <p className="text-gray-300">Ул. Интернациональная, 1<br />Минск, Беларусь</p>
          <p className="mt-1 text-gray-300"><strong>Тел.:</strong> +375 (29) 234-34-89</p>
          <p className="text-gray-300"><strong>Email:</strong> cinemawebwelcome@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-cinema-accent mt-6 pt-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CINEMA. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
