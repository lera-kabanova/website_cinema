import React from "react";
import { FileText } from "lucide-react";

const TermsPage: React.FC = () => (
  <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center px-4">
    <FileText className="w-12 h-12 text-cinema-accent mb-4" />
    <h1 className="text-3xl font-bold mb-6 text-cinema-accent">Политика использования</h1>
    <div className="text-gray-200 space-y-4 text-lg max-w-2xl">
      <p>Используя сайт <span className="text-cinema-accent font-semibold">CINEMA</span>, вы соглашаетесь соблюдать правила пользования сервисом.</p>
      <p>Запрещено использовать сайт для противоправных целей, а также нарушать права других пользователей.</p>
      <p>Администрация оставляет за собой право изменять условия использования без предварительного уведомления.</p>
    </div>
  </div>
);

export default TermsPage; 