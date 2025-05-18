import { cn } from "@/lib/utils";
import React from "react";

interface Specifications {
  seats: string;
  screen: string;
  sound: string;
  projection: string;
  features?: string;
}

interface HallCardProps {
  title: string;
  description: string;
  imagePath: string;
  specifications: Specifications;
  className?: string;
}

const HallCard: React.FC<HallCardProps> = ({
  title,
  description,
  imagePath,
  specifications,
  className,
}) => {
  return (
    <div className={cn("overflow-hidden rounded-xl shadow-glass animate-fadeIn", className)}>
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={imagePath}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-poster"></div>
        <h3 className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xl sm:text-2xl font-montserrat font-semibold text-white">
          {title}
        </h3>
      </div>
      <div className="p-4 sm:p-6 bg-cinema-secondary h-[240px] sm:h-[280px] overflow-y-auto">
        <p className="text-cinema-text mb-3 sm:mb-4 text-sm sm:text-base">{description}</p>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm text-cinema-text"><strong>Количество мест:</strong> {specifications.seats}</p>
          <p className="text-xs sm:text-sm text-cinema-text"><strong>Экран:</strong> {specifications.screen}</p>
          <p className="text-xs sm:text-sm text-cinema-text"><strong>Звук:</strong> {specifications.sound}</p>
          <p className="text-xs sm:text-sm text-cinema-text"><strong>Проекция:</strong> {specifications.projection}</p>
          {specifications.features && (
            <p className="text-xs sm:text-sm text-cinema-text"><strong>Особенности:</strong> {specifications.features}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallCard;