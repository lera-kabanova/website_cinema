// import React from "react";
// import { Play, Film, Star, Users, Sparkles, Globe, Shield, Zap, Clock, Headphones, TrendingUp, Award, Heart, Eye } from "lucide-react";

// const AboutPage: React.FC = () => (
//   <div className="min-h-screen bg-black text-white overflow-hidden">
//     {/* Animated Background Particles */}
//     <div className="fixed inset-0 overflow-hidden pointer-events-none">
//       {[...Array(15)].map((_, i) => (
//         <div
//           key={i}
//           className="absolute w-[1px] h-[1px] bg-cinema-accent/20 rounded-full animate-pulse"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             animationDelay: `${Math.random() * 2}s`,
//             animationDuration: `${3 + Math.random() * 2}s`,
//           }}
//         />
//       ))}
//     </div>

//     {/* Hero Section */}
//     <div className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-b from-cinema-accent/5 via-transparent to-transparent"></div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           {/* Animated Logo/Badge */}
//           <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-cinema-accent/20 to-cinema-accent/5 border border-cinema-accent/30 mb-8 animate-float">
//             <Film className="w-10 h-10 md:w-12 md:h-12 text-cinema-accent" />
//           </div>
          
//           <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6">
//             CINEMA
//             <span className="block text-lg md:text-xl text-cinema-accent font-normal tracking-widest mt-2">
//               REDEFINING STREAMING
//             </span>
//           </h1>
          
//           <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
//             Платформа, где технологии встречаются с искусством, создавая идеальный кинематографический опыт
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Features Grid */}
//     <div className="relative py-16 md:py-24">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-cinema-accent/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cinema-accent/20 to-transparent mb-6">
//                 <Zap className="w-7 h-7 text-cinema-accent" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Мгновенный доступ</h3>
//               <p className="text-gray-400 mb-6">
//                 Начинайте просмотр в один клик. Без загрузок, без ожидания — только кино.
//               </p>
//               <div className="flex items-center text-sm text-gray-500">
//                 <Clock className="w-4 h-4 mr-2" />
//                 <span>Доступ 24/7</span>
//               </div>
//             </div>
//           </div>

//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-cinema-accent/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cinema-accent/20 to-transparent mb-6">
//                 <Shield className="w-7 h-7 text-cinema-accent" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Безопасность</h3>
//               <p className="text-gray-400 mb-6">
//                 Ваши данные и просмотры защищены. Мы используем шифрование уровня enterprise.
//               </p>
//               <div className="flex items-center text-sm text-gray-500">
//                 <Globe className="w-4 h-4 mr-2" />
//                 <span>Безопасный просмотр</span>
//               </div>
//             </div>
//           </div>

//           <div className="group relative md:col-span-2 lg:col-span-1">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-cinema-accent/30 to-pink-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-cinema-accent/20 to-transparent mb-6">
//                 <Headphones className="w-7 h-7 text-cinema-accent" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Иммерсивный звук</h3>
//               <p className="text-gray-400 mb-6">
//                 Dolby Atmos и 3D-аудио. Почувствуйте каждый звук так, как задумали создатели.
//               </p>
//               <div className="flex items-center text-sm text-gray-500">
//                 <Star className="w-4 h-4 mr-2 text-yellow-400" />
//                 <span>Премиум качество</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Stats Section - Вместо "Наш путь" */}
//     <div className="relative py-20 md:py-32">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-5xl font-light mb-6">
//             В цифрах
//             <span className="block text-lg md:text-xl text-gray-400 mt-3 font-light">
//               Наша история успеха
//             </span>
//           </h2>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//           {/* Статистика 1 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-br from-cinema-accent/20 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cinema-accent/10 to-blue-500/5 mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Users className="w-8 h-8 text-cinema-accent" />
//               </div>
//               <div className="text-4xl md:text-5xl font-light mb-3 text-white">
//                 2.5M+
//               </div>
//               <div className="text-gray-400 text-sm uppercase tracking-wider font-light">
//                 Активных пользователей
//               </div>
//               <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
//                 <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
//                 <span>+45% за год</span>
//               </div>
//             </div>
//           </div>

//           {/* Статистика 2 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-br from-cinema-accent/20 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cinema-accent/10 to-purple-500/5 mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Film className="w-8 h-8 text-cinema-accent" />
//               </div>
//               <div className="text-4xl md:text-5xl font-light mb-3 text-white">
//                 50K+
//               </div>
//               <div className="text-gray-400 text-sm uppercase tracking-wider font-light">
//                 Фильмов и сериалов
//               </div>
//               <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
//                 <Award className="w-4 h-4 mr-2 text-yellow-400" />
//                 <span>450+ премий</span>
//               </div>
//             </div>
//           </div>

//           {/* Статистика 3 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-br from-cinema-accent/20 to-pink-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cinema-accent/10 to-pink-500/5 mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Eye className="w-8 h-8 text-cinema-accent" />
//               </div>
//               <div className="text-4xl md:text-5xl font-light mb-3 text-white">
//                 150M+
//               </div>
//               <div className="text-gray-400 text-sm uppercase tracking-wider font-light">
//                 Часов просмотрено
//               </div>
//               <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
//                 <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
//                 <span>99% uptime</span>
//               </div>
//             </div>
//           </div>

//           {/* Статистика 4 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-br from-cinema-accent/20 to-green-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cinema-accent/10 to-green-500/5 mb-6 group-hover:scale-110 transition-transform duration-300">
//                 <Heart className="w-8 h-8 text-cinema-accent" />
//               </div>
//               <div className="text-4xl md:text-5xl font-light mb-3 text-white">
//                 98%
//               </div>
//               <div className="text-gray-400 text-sm uppercase tracking-wider font-light">
//                 Довольных клиентов
//               </div>
//               <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
//                 <Star className="w-4 h-4 mr-2 text-yellow-400" />
//                 <span>4.9/5 рейтинг</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Дополнительная статистика под основными карточками */}
//         <div className="mt-16 grid md:grid-cols-3 gap-8">
//           <div className="text-center">
//             <div className="text-2xl font-light text-gray-300 mb-2">180+</div>
//             <div className="text-gray-500 text-sm">Стран доступно</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-light text-gray-300 mb-2">24/7</div>
//             <div className="text-gray-500 text-sm">Поддержка клиентов</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-light text-gray-300 mb-2">50+</div>
//             <div className="text-gray-500 text-sm">Языков интерфейса</div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Tech Showcase */}
//     <div className="relative py-20">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-light mb-4">
//             Технологии будущего
//             <span className="block text-lg text-gray-400 mt-2">уже сегодня</span>
//           </h2>
//         </div>
        
//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             { icon: Sparkles, title: "AI-рекомендации", desc: "Умная система подбора контента на основе ваших предпочтений" },
//             { icon: Users, title: "Совместный просмотр", desc: "Смотрите фильмы вместе с друзьями, находясь в разных городах" },
//             { icon: Play, title: "Офлайн-режим", desc: "Скачивайте фильмы для просмотра без подключения к интернету" },
//           ].map((tech, index) => (
//             <div key={index} className="group">
//               <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black/50 p-8 h-full transition-all duration-500 hover:border-cinema-accent/50">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cinema-accent/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
//                 <div className="relative">
//                   <tech.icon className="w-12 h-12 text-cinema-accent mb-6" />
//                   <h3 className="text-2xl font-light mb-4">{tech.title}</h3>
//                   <p className="text-gray-400">{tech.desc}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//     {/* Final CTA */}
//     <div className="relative py-20 md:py-32">
//       <div className="max-w-4xl mx-auto px-4 text-center">
//         <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-gray-900/80 to-black/80 border border-gray-800 mb-8 backdrop-blur-sm">
//           <Sparkles className="w-5 h-5 text-cinema-accent" />
//           <span className="text-gray-300">Присоединяйтесь сегодня</span>
//         </div>
        
//         <h2 className="text-4xl md:text-6xl font-light mb-8 leading-tight">
//           Готовы к новому
//           <span className="block text-cinema-accent">кинематографическому опыту?</span>
//         </h2>
        
//         <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
//           Откройте мир кино без границ. Начните с бесплатного пробного периода
//           и почувствуйте разницу.
//         </p>
        
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <button className="px-8 py-4 bg-gradient-to-r from-cinema-accent to-blue-600 text-black font-medium rounded-full hover:shadow-2xl hover:shadow-cinema-accent/30 transition-all duration-300 transform hover:scale-105">
//             Начать бесплатно
//           </button>
//           <button className="px-8 py-4 bg-transparent border border-gray-700 text-white rounded-full hover:border-gray-500 transition-all duration-300 hover:bg-white/5">
//             Узнать больше
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* Floating Decorative Elements */}
//     <div className="fixed bottom-8 right-8 z-50">
//       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cinema-accent to-blue-600 flex items-center justify-center animate-pulse shadow-2xl shadow-cinema-accent/30">
//         <Play className="w-5 h-5 text-black" />
//       </div>
//     </div>

//     {/* Add custom animations to tailwind.config.js */}
//     <style jsx global>{`
//       @keyframes float {
//         0%, 100% { transform: translateY(0px); }
//         50% { transform: translateY(-20px); }
//       }
//       .animate-float {
//         animation: float 6s ease-in-out infinite;
//       }
//     `}</style>
//   </div>
// );

// export default AboutPage; 
import React from "react";
import { Film } from "lucide-react";

const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center px-4">
      {/* Иконка */}
      <div className="mb-8">
        <Film className="w-24 h-24 text-cinema-accent mx-auto" />
      </div>
      
      {/* Заголовок */}
      <h1 className="text-4xl font-bold mb-6">
        CINEMA
      </h1>
      
      {/* Подзаголовок */}
      <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
        Переосмысление стриминга кино
      </p>
      
      {/* Описание */}
      <div className="text-gray-400 max-w-lg mx-auto space-y-4">
        <p>
          Платформа, где технологии встречаются с искусством, создавая идеальный кинематографический опыт.
        </p>
        <p className="text-sm">
          Просто, современно, удобно.
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;