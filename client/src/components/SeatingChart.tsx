import React from "react";
import { cn } from "@/lib/utils";
import { Sofa, Armchair, BedDouble, Car, User } from "lucide-react";

interface SeatingChartProps {
  hallType: "standard" | "comfort" | "vip";
  showHoverInfo?: boolean;
}

interface HallLayout {
  rows: Array<{
    type: string;
    seats: number;
    icon: React.ElementType;
    bgColor: string;
    isSpecial?: boolean;
  }>;
}

const hallLayouts: Record<string, HallLayout> = {
    standard: {
      rows: [
        { type: "sofa", seats: 5, icon: Sofa, bgColor: "bg-cinema-seat-sofa" },
        ...Array(7).fill({ type: "standard", seats: 16, icon: Armchair, bgColor: "bg-cinema-seat-standard" }),
        { type: "love", seats: 8, icon: BedDouble, bgColor: "bg-cinema-seat-love" }
      ]
    },
    comfort: {
      rows: [
        { type: "sofa", seats: 5, icon: Sofa, bgColor: "bg-cinema-seat-sofa" },
        ...Array(5).fill({ type: "standard", seats: 12, icon: Armchair, bgColor: "bg-cinema-seat-standard" }),
        { type: "love", seats: 6, icon: BedDouble, bgColor: "bg-cinema-seat-love" },
        { type: "recliner", seats: 8, icon: Car, bgColor: "bg-cinema-seat-recliner" }
      ]
    },
    vip: {
      rows: [
        ...Array(4).fill({ 
          type: "recliner", 
          seats: 6, 
          icon: Car, 
          bgColor: "bg-cinema-seat-vip",
          isSpecial: true 
        }),
        ...Array(2).fill({ 
          type: "luxury", 
          seats: 4, 
          icon: Sofa, 
          bgColor: "bg-cinema-seat-vip-special" 
        })
      ]
    }
  };

const SeatingChart: React.FC<SeatingChartProps> = ({ hallType, showHoverInfo = true }) => {
  const hallConfig = hallLayouts[hallType];
  const [hoveredSeat, setHoveredSeat] = React.useState<{
    seat: string;
    row: number;
    seatNumber: number;
    type: string;
    position: { x: number, y: number };
  } | null>(null);
  
  const handleSeatHover = (row: number, seatNumber: number, type: string, e: React.MouseEvent) => {
    if (!showHoverInfo) return;
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    setHoveredSeat({
      seat: `${row}-${seatNumber}`,
      row,
      seatNumber,
      type,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    });
  };
  
  const handleSeatLeave = () => {
    setHoveredSeat(null);
  };
  
  const renderSeats = () => {
    return hallConfig.rows.map((row, rowIndex) => {
      const rowWidth = 600;
      const isDoubleWidth = row.type === "sofa" || row.type === "love";
      const seatBaseWidth = isDoubleWidth ? 32 : 16;
      const totalSeatWidth = row.seats * seatBaseWidth;
      const remainingSpace = rowWidth - totalSeatWidth;
      const gapBetweenSeats = remainingSpace / (row.seats + 1);
      
      const seats = Array(row.seats).fill(null).map((_, seatIndex) => {
        const SeatIcon = row.icon;
        const isDoubleSeat = row.type === "sofa" || row.type === "love";
        
        return (
          <div 
            key={`seat-${rowIndex}-${seatIndex}`} 
            className={cn(
              "flex items-center justify-center rounded-sm transition-transform hover:scale-110 cursor-pointer",
              isDoubleSeat ? "w-12 h-6" : "w-6 h-6",
              row.bgColor
            )}
            onMouseEnter={(e) => handleSeatHover(rowIndex + 1, seatIndex + 1, row.type, e)}
            onMouseLeave={handleSeatLeave}
            title={`Ряд ${rowIndex + 1}, Место ${seatIndex + 1}`}
            style={{ margin: `0 ${gapBetweenSeats / 2}px` }}
          >
            <SeatIcon className={cn(
              "text-white",
              isDoubleSeat ? "w-6 h-3" : "w-3 h-3"
            )} />
          </div>
        );
      });
      
      return (
        <div 
          key={`row-${rowIndex}`} 
          className="flex items-center my-1"
        >
          <div className="w-8 text-xs flex items-center justify-end mr-4">
            {rowIndex + 1}
          </div>
          <div className="flex justify-center flex-1" style={{ width: `${rowWidth}px` }}>
            {seats}
          </div>
          <div className="w-8 text-xs flex items-center justify-start ml-4">
            {rowIndex + 1}
          </div>
        </div>
      );
    });
  };
  
  return (
    <div className="mt-6 relative">
      <div className="w-full bg-cinema-secondary rounded-xl p-4 overflow-auto">
        <div className="flex justify-center mb-8 text-center">
          <div className="w-3/4 h-2 bg-cinema-accent mb-2"></div>
        </div>
        <p className="text-center text-xs mb-4">ЭКРАН</p>
        
        <div className="space-y-3">
          {renderSeats()}
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-center text-xs text-gray-400">
            Для выбора мест нажмите на схему зала
          </p>
        </div>
      </div>
      
      {hoveredSeat && showHoverInfo && (
        <div 
          className="absolute bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-xs z-50 shadow-lg transform -translate-x-1/2 pointer-events-none"
          style={{
            left: `${hoveredSeat.position.x}px`,
            top: `${hoveredSeat.position.y}px`,
            width: "120px"
          }}
        >
          <div className="font-bold">{hoveredSeat.type === "love" ? "Love Seat" : 
                                     hoveredSeat.type === "sofa" ? "Диван" :
                                     hoveredSeat.type === "recliner" ? "Реклайнер" : "Стандарт"}</div>
          <div className="text-gray-300">
            Ряд {hoveredSeat.row}, Место {hoveredSeat.seatNumber}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatingChart;