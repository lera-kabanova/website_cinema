import React from "react";
import { Sofa, Armchair, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeatTypeProps {
  color: string;
  label: string;
  description: string;
  icon: React.ReactElement; // Изменили тип на React.ReactElement
  isDouble?: boolean;
}

const SeatType: React.FC<SeatTypeProps> = ({
  color,
  label,
  description,
  icon,
  isDouble = false,
}) => {
  const IconComponent = icon.type; // Получаем компонент иконки
  
  return (
    <div className="flex flex-col justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-white/10 hover:bg-gray-800/60 transition-colors duration-200 w-full h-[110px] sm:h-[120px]">
      <div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center rounded-md bg-opacity-70",
              isDouble ? "w-10 h-5 sm:w-12 sm:h-6" : "w-7 h-7 sm:w-8 sm:h-8",
              color
            )}
          >
            <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <span className="font-semibold text-white text-sm sm:text-base whitespace-nowrap">{label}</span>
        </div>
        <p className="text-xs sm:text-[0.9rem] text-gray-300/90 leading-tight break-words mt-1 sm:mt-2">
          {description}
        </p>
      </div>
    </div>
  );
};

const SeatLegend: React.FC = () => {
  const seatTypes = [
    {
      color: "bg-purple-500/70",
      label: "Диван",
      description: "Двухместный мягкий диван с подушками и подстаканниками (цена за 2 места)",
      icon: <Sofa />,
      isDouble: true,
    },
    {
      color: "bg-blue-600/70",
      label: "Стандарт",
      description: "Одноместное кресло с откидной спинкой и подстаканником",
      icon: <Armchair />,
    },
    {
      color: "bg-pink-400/70",
      label: "Love Seats",
      description: "Двухместное кресло с подъемным подлокотником (цена за место)",
      icon: <BedDouble />,
      isDouble: true,
    },
    {
      color: "bg-red-500/70",
      label: "Реклайнер",
      description: "Кресло-реклайнер с беспроводной зарядкой",
      icon: <Armchair />,
    },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {seatTypes.map((type) => (
        <SeatType 
          key={type.label} 
          color={type.color}
          label={type.label}
          description={type.description}
          icon={type.icon}
          isDouble={type.isDouble}
        />
      ))}
    </div>
  );
};

export default SeatLegend;