import React from "react";

const AboutPage: React.FC = () => (
  <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-3xl font-bold mb-6 text-cinema-accent">О нас</h1>
    <div className="text-gray-200 space-y-4 text-lg max-w-2xl">
      <p>Добро пожаловать в <span className="text-cinema-accent font-semibold">CINEMA</span> — современный онлайн-кинотеатр, где вы всегда найдете лучшие фильмы и удобный сервис для покупки билетов.</p>
      <p>Наша команда стремится сделать ваш киноопыт максимально комфортным и ярким. Мы ценим каждого пользователя и всегда открыты для обратной связи!</p>
      <p>Спасибо, что выбираете нас. Приятного просмотра!</p>
    </div>
  </div>
);


export default AboutPage; 