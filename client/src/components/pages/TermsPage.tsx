import React from "react";
import { FileText } from "lucide-react";

const TermsPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center px-4 max-w-2xl">
      {/* Иконка */}
      <div className="mb-8">
        <FileText className="w-24 h-24 text-cinema-accent mx-auto" />
      </div>
      
      {/* Заголовок */}
      <h1 className="text-4xl font-bold mb-6">
        Политика использования
      </h1>
      
      {/* Основной текст */}
      <div className="text-gray-400 space-y-6 text-left">
        <p>
          Используя сайт <span className="text-cinema-accent font-semibold">CINEMA</span>, 
          вы соглашаетесь соблюдать правила пользования сервисом.
        </p>
        
        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-2xl font-light mb-4 text-white">Общие правила</h2>
          <p>
            Запрещено использовать сайт для противоправных целей, а также нарушать права других пользователей.
          </p>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-2xl font-light mb-4 text-white">Изменения условий</h2>
          <p>
            Администрация оставляет за собой право изменять условия использования без предварительного уведомления.
          </p>
        </div>
        

      </div>
    </div>
  </div>
);

export default TermsPage;