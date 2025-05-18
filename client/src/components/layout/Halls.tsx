import React from "react";
import HallCard from "@/components/HallCard";
import SeatLegend from "@/components/SeatLegend";

const hallImages = {
  standard: "/assets/halls/standart-hall.jpg",
  comfort: "/assets/halls/comfort-hall.jpg",
  vip: "/assets/halls/vip-hall.jpg",
};

const hallsData = [
  {
    id: "standard",
    title: "Зал 1 (Стандартный)",
    description: "Стандартные кинозалы с возможностью демонстрации фильмов в 2D формате. Оснащены комфортными креслами с подстаканниками и удобными подлокотниками. Оптимальное расстояние между рядами обеспечивает комфортный просмотр.",
    imagePath: hallImages.standard,
    specifications: {
      seats: "120 мест",
      screen: "Экран 12x5 метров",
      sound: "Dolby Digital Surround 7.1",
      projection: "Цифровой проектор 2K"
    }
  },
  {
    id: "comfort",
    title: "Зал 2 (Комфорт)",
    description: "Кинозалы повышенной комфортности с возможностью демонстрации фильмов в 2D формате. Отличительная особенность - комфортные кожаные кресла, увеличенное расстояние между рядами.",
    imagePath: hallImages.comfort,
    specifications: {
      seats: "80 мест",
      screen: "Экран 14x6 метров",
      sound: "Dolby Digital Surround 7.1",
      projection: "Цифровой проектор 4K"
    }
  },
  {
    id: "vip",
    title: "Зал 3 (VIP)",
    description: "Премиальные кинозалы с возможностью демонстрации фильмов в 2D формате. Отличительная особенность - камерная атмосфера, суперкомфортные кресла-реклайнеры с возможностью регулировки и фиксации положения спинки, подножки и сидения.",
    imagePath: hallImages.vip,
    specifications: {
      seats: "32 места",
      screen: "Премиум экран 16x7 метров",
      sound: "Dolby Atmos",
      projection: "Лазерный проектор 4K"
    }
  },
];

const Halls: React.FC = () => {
  return (
    <div className="min-h-screen bg-black font-montserrat">
      <div className="container px-4 sm:px-6 py-8 md:py-12 lg:py-16 mx-auto">
<header className="mb-8 md:mb-12 text-center animate-fadeIn mt-8 sm:mt-12 md:mt-16">
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-semibold text-white mb-2 uppercase">Наши кинозалы</h1>
  <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
    Выберите идеальный кинозал для вашего просмотра. От стандартных до премиальных VIP-залов.
  </p>
</header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {hallsData.map((hall) => (
            <HallCard
              key={hall.id}
              title={hall.title}
              description={hall.description}
              imagePath={hall.imagePath}
              specifications={hall.specifications}
              className="h-full bg-gray-900"
            />
          ))}
        </div>
            
        <div className="mt-8 md:mt-10 p-4 sm:p-6 md:p-8 rounded-xl bg-gray-900 shadow-glass backdrop-blur-sm border border-white/10">
          <h2 className="text-xl sm:text-2xl font-montserrat font-semibold mb-4 sm:mb-6 text-white text-center uppercase">Типы мест в нашем зале</h2>
          <div className="w-full">
            <SeatLegend />
          </div>
        </div>

        <div className="mt-8 md:mt-10 space-y-4 md:space-y-6">
          <div className="p-4 sm:p-6 md:p-8 rounded-xl bg-gray-900 shadow-glass backdrop-blur-sm border border-white/10">
            <h2 className="text-xl sm:text-2xl font-montserrat font-semibold mb-4 sm:mb-6 text-white text-center uppercase">Дополнительная информация</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 sm:p-6 bg-gray-800/30 rounded-lg border border-white/10 hover:border-cinema-accent/50 transition-all duration-300 group">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cinema-accent/20 flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-cinema-accent/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-cinema-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white">Доступная среда</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 pl-13 sm:pl-16">Все залы оборудованы специальными местами для маломобильных гостей и их сопровождающих. Предусмотрены удобные пандусы и широкие проходы.</p>
              </div>
              
              <div className="p-4 sm:p-6 bg-gray-800/30 rounded-lg border border-white/10 hover:border-cinema-accent/50 transition-all duration-300 group">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cinema-accent/20 flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-cinema-accent/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-cinema-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white">Система вентиляции</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 pl-13 sm:pl-16">Современная система климат-контроля поддерживает комфортную температуру и обеспечивает постоянный приток свежего воздуха во всех залах.</p>
              </div>
              
              <div className="p-4 sm:p-6 bg-gray-800/30 rounded-lg border border-white/10 hover:border-cinema-accent/50 transition-all duration-300 group">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cinema-accent/20 flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-cinema-accent/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-cinema-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white">Безопасность</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 pl-13 sm:pl-16">Все залы оснащены современной системой пожарной безопасности и аварийного освещения. Персонал регулярно проходит обучение по технике безопасности.</p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-800/30 rounded-lg border border-white/10 hover:border-cinema-accent/50 transition-all duration-300 group">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cinema-accent/20 flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-cinema-accent/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-cinema-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-montserrat font-semibold text-white">Время работы</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 pl-13 sm:pl-16">Кинотеатр работает ежедневно с 9:00 до 23:00. Кассы открыты с 9:00 до 22:30. Первые сеансы начинаются в 10:00.</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 rounded-xl bg-gray-900 shadow-glass backdrop-blur-sm border border-white/10">
            <h2 className="text-xl sm:text-2xl font-montserrat font-semibold mb-4 sm:mb-6 text-white text-center uppercase">Правила посещения</h2>
            <div className="space-y-2 sm:space-y-3">
              {[
                "Вход в зал открывается за 15 минут до начала сеанса",
                "Пожалуйста, отключайте звук мобильных устройств перед началом фильма",
                "Запрещена видеосъемка в течение показа фильма",
                "Детям до 18 лет запрещен вход на фильмы с рейтингом 18+",
                "Билеты необходимо сохранять до конца сеанса",
                "Курение и употребление алкоголя запрещено",
                "Дети до 12 лет допускаются только в сопровождении взрослых"
              ].map((rule, index) => (
                <div key={index} className="flex items-start p-2 sm:p-3 bg-gray-800/20 rounded-lg hover:bg-gray-800/30 transition-all duration-200">
                  <div className="flex-shrink-0 mt-1 mr-3 sm:mr-4 text-cinema-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Halls;