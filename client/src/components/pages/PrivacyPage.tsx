// import React from "react";
// import { Shield, Lock, Eye, User, Database, Key, Globe, ShieldCheck } from "lucide-react";

// const PrivacyPage: React.FC = () => (
//   <div className="min-h-screen bg-black text-white overflow-hidden">
//     {/* Animated Background Particles */}
//     <div className="fixed inset-0 overflow-hidden pointer-events-none">
//       {[...Array(20)].map((_, i) => (
//         <div
//           key={i}
//           className="absolute w-[1px] h-[1px] bg-blue-500/20 rounded-full animate-pulse"
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
//     <div className="relative pt-20 md:pt-32 pb-12 md:pb-20 overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent"></div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           {/* Animated Shield */}
//           <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 mb-8 animate-float">
//             <Shield className="w-14 h-14 md:w-20 md:h-20 text-blue-400" />
//           </div>
          
//           <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
//             Конфиденциальность
//             <span className="block text-lg md:text-xl text-blue-400 font-normal tracking-widest mt-2">
//               Прозрачность и безопасность
//             </span>
//           </h1>
          
//           <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
//             Ваша приватность — наш приоритет. Мы строим доверие на прозрачности и защите данных.
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Core Privacy Principles */}
//     <div className="relative py-16 md:py-24">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//           {/* Principle 1 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent mb-6">
//                 <Lock className="w-7 h-7 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Шифрование данных</h3>
//               <p className="text-gray-400 text-sm">
//                 Все данные передаются и хранятся с использованием end-to-end шифрования AES-256
//               </p>
//             </div>
//           </div>

//           {/* Principle 2 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent mb-6">
//                 <Eye className="w-7 h-7 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Минимализм данных</h3>
//               <p className="text-gray-400 text-sm">
//                 Собираем только необходимую информацию для работы сервиса. Ничего лишнего.
//               </p>
//             </div>
//           </div>

//           {/* Principle 3 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent mb-6">
//                 <User className="w-7 h-7 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Контроль данных</h3>
//               <p className="text-gray-400 text-sm">
//                 Вы всегда можете просмотреть, отредактировать или удалить свои персональные данные
//               </p>
//             </div>
//           </div>

//           {/* Principle 4 */}
//           <div className="group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
//             <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full">
//               <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent mb-6">
//                 <Globe className="w-7 h-7 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-light mb-4">Соответствие законам</h3>
//               <p className="text-gray-400 text-sm">
//                 Строго соблюдаем GDPR, CCPA и другие законы о защите данных
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Main Privacy Content */}
//     <div className="relative py-16">
//       <div className="max-w-5xl mx-auto px-4">
//         <div className="grid md:grid-cols-2 gap-12">
//           {/* Left Column - Data Usage */}
//           <div className="space-y-8">
//             <div className="group">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
//                   <Database className="w-6 h-6 text-blue-400" />
//                 </div>
//                 <h2 className="text-2xl font-light">Использование данных</h2>
//               </div>
//               <div className="space-y-4">
//                 <p className="text-gray-300 leading-relaxed">
//                   Мы уважаем вашу конфиденциальность и <span className="text-blue-400 font-medium">не передаем</span> ваши персональные данные третьим лицам без вашего явного согласия.
//                 </p>
//                 <p className="text-gray-300 leading-relaxed">
//                   Все собираемые данные используются исключительно для:
//                 </p>
//                 <ul className="space-y-3 text-gray-300">
//                   <li className="flex items-start gap-3">
//                     <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
//                     <span>Предоставления услуг платформы CINEMA</span>
//                   </li>
//                   <li className="flex items-start gap-3">
//                     <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
//                     <span>Персонализации вашего опыта просмотра</span>
//                   </li>
//                   <li className="flex items-start gap-3">
//                     <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
//                     <span>Улучшения качества сервиса и разработки новых функций</span>
//                   </li>
//                   <li className="flex items-start gap-3">
//                     <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
//                     <span>Обеспечения безопасности вашей учетной записи</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Data Protection */}
//           <div className="space-y-8">
//             <div className="group">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
//                   <Key className="w-6 h-6 text-blue-400" />
//                 </div>
//                 <h2 className="text-2xl font-light">Защита информации</h2>
//               </div>
//               <div className="space-y-4">
//                 <p className="text-gray-300 leading-relaxed">
//                   Мы внедрили многоуровневую систему защиты, включая:
//                 </p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
//                     <div className="text-blue-400 text-sm mb-2">Шифрование</div>
//                     <div className="text-sm text-gray-400">AES-256 для всех данных</div>
//                   </div>
//                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
//                     <div className="text-blue-400 text-sm mb-2">Аудит</div>
//                     <div className="text-sm text-gray-400">Регулярные проверки безопасности</div>
//                   </div>
//                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
//                     <div className="text-blue-400 text-sm mb-2">Резервирование</div>
//                     <div className="text-sm text-gray-400">Геораспределенные серверы</div>
//                   </div>
//                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
//                     <div className="text-blue-400 text-sm mb-2">Мониторинг</div>
//                     <div className="text-sm text-gray-400">Круглосуточный контроль доступа</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Contact & Transparency Section */}
//     <div className="relative py-16 md:py-24">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
//           <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500"></div>
//           <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-blue-500"></div>
          
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 mb-6">
//               <ShieldCheck className="w-8 h-8 text-blue-400" />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-light mb-4">Вопросы и поддержка</h2>
//           </div>
          
//           <div className="space-y-6 text-center">
//             <p className="text-gray-300 text-lg leading-relaxed">
//               Если у вас есть вопросы относительно нашей политики конфиденциальности, 
//               или вы хотите получить доступ к своим данным — наша команда готова помочь.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
//               <div className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-xl">
//                 <span className="text-blue-400">Контакты</span>
//                 <span className="text-gray-400 ml-2">→</span>
//               </div>
//               <div className="text-gray-400">или</div>
//               <div className="px-6 py-3 bg-gradient-to-r from-gray-900/80 to-black/80 border border-gray-700 rounded-xl">
//                 <span className="text-gray-300">privacy@cinema.com</span>
//               </div>
//             </div>
            
//             <p className="text-gray-500 text-sm pt-8">
//               Мы обновляем нашу политику конфиденциальности регулярно. 
//               Последнее обновление: {new Date().getFullYear()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Trust Badges */}
//     <div className="relative py-12">
//       <div className="max-w-3xl mx-auto px-4">
//         <div className="flex flex-wrap justify-center gap-8 opacity-60">
//           <div className="text-center">
//             <div className="text-2xl font-light text-blue-400 mb-2">ISO 27001</div>
//             <div className="text-xs text-gray-500 uppercase">Сертификат</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-light text-blue-400 mb-2">GDPR</div>
//             <div className="text-xs text-gray-500 uppercase">Соответствие</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-light text-blue-400 mb-2">SSL/TLS</div>
//             <div className="text-xs text-gray-500 uppercase">Защита</div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Add custom animations */}
//     <style jsx global>{`
//       @keyframes float {
//         0%, 100% { transform: translateY(0px); }
//         50% { transform: translateY(-15px); }
//       }
//       .animate-float {
//         animation: float 5s ease-in-out infinite;
//       }
//     `}</style>
//   </div>
// );

// export default PrivacyPage;
import React from "react";
import { Shield } from "lucide-react";

const PrivacyPage: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center px-4 max-w-2xl">
      {/* Иконка */}
      <div className="mb-8">
        <Shield className="w-24 h-24 text-blue-400 mx-auto" />
      </div>
      
      {/* Заголовок */}
      <h1 className="text-4xl font-bold mb-6">
        Конфиденциальность
      </h1>
      
      {/* Подзаголовок */}
      <p className="text-xl text-gray-300 mb-8">
        Прозрачность и безопасность данных
      </p>
      
      {/* Основной текст */}
      <div className="text-gray-400 space-y-6 text-left">
        <p>
          Ваша приватность — наш приоритет. Мы строим доверие на прозрачности и защите данных.
        </p>
        
        <div className="border-t border-gray-800 pt-6">
          <h2 className="text-2xl font-light mb-4 text-white">Использование данных</h2>
          <p className="mb-4">
            Мы уважаем вашу конфиденциальность и не передаем ваши персональные данные третьим лицам без вашего явного согласия.
          </p>
          <p>
            Все собираемые данные используются исключительно для предоставления услуг платформы CINEMA и улучшения вашего опыта.
          </p>
        </div>
        
      </div>
    </div>
  </div>
);

export default PrivacyPage;