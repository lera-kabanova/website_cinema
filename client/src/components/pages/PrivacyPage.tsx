import React from "react";
import { Shield } from "lucide-react";

const PrivacyPage: React.FC = () => (
  <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center px-4">
    <Shield className="w-12 h-12 text-cinema-accent mb-4" />
    <h1 className="text-3xl font-bold mb-6 text-cinema-accent">Политика конфиденциальности</h1>
    <div className="text-gray-200 space-y-4 text-lg max-w-2xl">
      <p>Мы уважаем вашу конфиденциальность и не передаем ваши данные третьим лицам.</p>
      <p>Все персональные данные используются только для предоставления сервисов сайта <span className="text-cinema-accent font-semibold">CINEMA</span>.</p>
      <p>Если у вас есть вопросы по поводу обработки данных — напишите нам через раздел <b>Контакты</b>.</p>
    </div>
  </div>
);

export default PrivacyPage; 