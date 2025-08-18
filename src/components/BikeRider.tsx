'use client';

interface BikeRiderProps {
  position: number;
  isMoving: boolean;
}

export function BikeRider({ position, isMoving }: BikeRiderProps) {
  return (
    <div 
      className="absolute transition-all duration-500 ease-out"
      style={{
        left: '50%',
        top: '500px',
        transform: `translate3d(-50%, 0, ${position}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Bike Rider SVG/CSS representation */}
      <div className="relative">
        {/* Bike */}
        <div className="relative w-16 h-12 mx-auto">
          {/* Wheels */}
          <div 
            className={`absolute w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600 left-0 bottom-0 ${
              isMoving ? 'animate-spin' : ''
            }`}
          >
            <div className="absolute inset-1 border border-gray-400 rounded-full"></div>
          </div>
          <div 
            className={`absolute w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600 right-0 bottom-0 ${
              isMoving ? 'animate-spin' : ''
            }`}
          >
            <div className="absolute inset-1 border border-gray-400 rounded-full"></div>
          </div>
          
          {/* Frame */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-1 bg-blue-600 top-2 left-0 transform rotate-6"></div>
            <div className="absolute w-6 h-1 bg-blue-600 top-4 left-3 transform -rotate-45"></div>
            <div className="absolute w-6 h-1 bg-blue-600 top-4 right-3 transform rotate-45"></div>
          </div>
          
          {/* Handlebars */}
          <div className="absolute w-4 h-1 bg-gray-600 -top-1 left-1/2 transform -translate-x-1/2"></div>
        </div>
        
        {/* Rider */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          {/* Head */}
          <div className="w-4 h-4 bg-peach-300 rounded-full mx-auto mb-1 border border-peach-400"></div>
          {/* Body */}
          <div className="w-3 h-6 bg-blue-500 mx-auto rounded-sm"></div>
          {/* Arms */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-4 bg-peach-300 transform rotate-45 absolute -left-1"></div>
            <div className="w-1 h-4 bg-peach-300 transform -rotate-45 absolute -right-1"></div>
          </div>
        </div>
        
        {/* Shadow */}
        <div 
          className="absolute w-20 h-8 bg-black opacity-20 rounded-full -bottom-2 left-1/2 transform -translate-x-1/2 blur-sm"
          style={{ transform: 'translateX(-50%) scaleY(0.3)' }}
        ></div>
      </div>
    </div>
  );
}