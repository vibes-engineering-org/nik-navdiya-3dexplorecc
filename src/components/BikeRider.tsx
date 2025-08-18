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
        top: '440px',
        transform: `translate3d(-50%, 0, ${position}px)`,
        transformStyle: 'preserve-3d',
        zIndex: 100
      }}
    >
      {/* Enhanced Bike Rider with realistic proportions */}
      <div className="relative scale-125">
        {/* Bike Frame with enhanced realism */}
        <div className="relative w-20 h-16 mx-auto">
          {/* Enhanced Wheels with spokes */}
          <div 
            className={`absolute w-8 h-8 bg-gray-900 rounded-full border-3 border-gray-700 left-0 bottom-0 shadow-lg ${
              isMoving ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: isMoving ? '0.3s' : '0s' }}
          >
            {/* Tire tread */}
            <div className="absolute inset-1 border-2 border-gray-600 rounded-full"></div>
            {/* Spokes */}
            <div className="absolute inset-2 border border-gray-500 rounded-full"></div>
            <div className="absolute w-full h-0.5 bg-gray-500 top-1/2 left-0 transform -translate-y-1/2"></div>
            <div className="absolute h-full w-0.5 bg-gray-500 left-1/2 top-0 transform -translate-x-1/2"></div>
            {/* Hub */}
            <div className="absolute w-2 h-2 bg-gray-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div 
            className={`absolute w-8 h-8 bg-gray-900 rounded-full border-3 border-gray-700 right-0 bottom-0 shadow-lg ${
              isMoving ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: isMoving ? '0.3s' : '0s' }}
          >
            {/* Tire tread */}
            <div className="absolute inset-1 border-2 border-gray-600 rounded-full"></div>
            {/* Spokes */}
            <div className="absolute inset-2 border border-gray-500 rounded-full"></div>
            <div className="absolute w-full h-0.5 bg-gray-500 top-1/2 left-0 transform -translate-y-1/2"></div>
            <div className="absolute h-full w-0.5 bg-gray-500 left-1/2 top-0 transform -translate-x-1/2"></div>
            {/* Hub */}
            <div className="absolute w-2 h-2 bg-gray-800 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Enhanced Frame Structure */}
          <div className="absolute inset-0">
            {/* Main frame triangle */}
            <div className="absolute w-full h-1.5 bg-gradient-to-r from-blue-600 to-blue-700 top-3 left-0 transform rotate-12 shadow-md rounded-full"></div>
            <div className="absolute w-8 h-1.5 bg-gradient-to-r from-blue-600 to-blue-700 top-6 left-2 transform -rotate-45 shadow-md rounded-full"></div>
            <div className="absolute w-8 h-1.5 bg-gradient-to-r from-blue-600 to-blue-700 top-6 right-2 transform rotate-45 shadow-md rounded-full"></div>
            
            {/* Seat post */}
            <div className="absolute w-1 h-6 bg-gray-700 top-1 left-1/2 transform -translate-x-1/2 rounded-full"></div>
            {/* Seat */}
            <div className="absolute w-4 h-2 bg-black top-0 left-1/2 transform -translate-x-1/2 rounded-full shadow-md"></div>
            
            {/* Chain guard */}
            <div className="absolute w-6 h-3 bg-gray-600 top-7 left-1/2 transform -translate-x-1/2 rounded opacity-60"></div>
          </div>
          
          {/* Enhanced Handlebars */}
          <div className="absolute w-6 h-1.5 bg-gray-700 -top-2 left-1/2 transform -translate-x-1/2 rounded-full shadow-md"></div>
          <div className="absolute w-1 h-4 bg-gray-600 -top-1 left-1/2 transform -translate-x-1/2 rounded-full"></div>
        </div>
        
        {/* Enhanced Rider with pedaling animation */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          {/* Helmet */}
          <div className="w-6 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full mx-auto mb-1 border border-red-700 shadow-lg"></div>
          
          {/* Head */}
          <div className="w-4 h-4 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full mx-auto mb-1 border border-amber-400 shadow-md"></div>
          
          {/* Body */}
          <div className="w-4 h-8 bg-gradient-to-b from-green-500 to-green-600 mx-auto rounded-lg shadow-md border border-green-700"></div>
          
          {/* Arms with handgrip position */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-1.5 h-5 bg-gradient-to-b from-amber-200 to-amber-300 transform rotate-30 absolute -left-2 rounded-full shadow-md"></div>
            <div className="w-1.5 h-5 bg-gradient-to-b from-amber-200 to-amber-300 transform -rotate-30 absolute -right-2 rounded-full shadow-md"></div>
          </div>
          
          {/* Enhanced Pedaling Legs with realistic cycling animation */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            {/* Left leg with realistic pedaling motion */}
            <div 
              className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-700 transform absolute -left-1 rounded-full shadow-md transition-transform duration-500 ease-in-out"
              style={{
                transformOrigin: 'top center',
                transform: isMoving ? 'rotate(25deg)' : 'rotate(5deg)',
                animation: isMoving ? 'pedalLeft 1s ease-in-out infinite' : 'none'
              }}
            >
              {/* Thigh segment */}
              <div 
                className="w-1 h-3 bg-gradient-to-b from-blue-500 to-blue-600 absolute top-0 left-0.5 rounded-full"
                style={{
                  transform: isMoving ? 'rotate(10deg)' : 'rotate(0deg)'
                }}
              ></div>
            </div>

            {/* Right leg with opposite pedaling motion */}
            <div 
              className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-700 transform absolute -right-1 rounded-full shadow-md transition-transform duration-500 ease-in-out"
              style={{
                transformOrigin: 'top center',
                transform: isMoving ? 'rotate(-25deg)' : 'rotate(-5deg)',
                animation: isMoving ? 'pedalRight 1s ease-in-out infinite 0.5s' : 'none'
              }}
            >
              {/* Thigh segment */}
              <div 
                className="w-1 h-3 bg-gradient-to-b from-blue-500 to-blue-600 absolute top-0 right-0.5 rounded-full"
                style={{
                  transform: isMoving ? 'rotate(-10deg)' : 'rotate(0deg)'
                }}
              ></div>
            </div>
          </div>

          {/* Add pedaling animation styles */}
          <style jsx>{`
            @keyframes pedalLeft {
              0% { transform: rotate(5deg); }
              25% { transform: rotate(35deg); }
              50% { transform: rotate(25deg); }
              75% { transform: rotate(-5deg); }
              100% { transform: rotate(5deg); }
            }
            @keyframes pedalRight {
              0% { transform: rotate(-5deg); }
              25% { transform: rotate(-35deg); }
              50% { transform: rotate(-25deg); }
              75% { transform: rotate(5deg); }
              100% { transform: rotate(-5deg); }
            }
          `}</style>
          
          {/* Feet/Pedals */}
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-1 bg-gray-800 absolute -left-2 rounded shadow-md"></div>
            <div className="w-2 h-1 bg-gray-800 absolute -right-2 rounded shadow-md"></div>
          </div>
        </div>
        
        {/* Enhanced Shadow with perspective */}
        <div 
          className="absolute w-24 h-6 bg-black opacity-30 rounded-full -bottom-1 left-1/2 transform -translate-x-1/2 blur-md"
          style={{ 
            transform: 'translateX(-50%) scaleY(0.4)',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)'
          }}
        ></div>
        
        {/* Speed lines when moving */}
        {isMoving && (
          <div className="absolute -left-8 top-6 pointer-events-none">
            <div className="w-4 h-0.5 bg-blue-400 opacity-60 transform -skew-x-45 animate-pulse"></div>
            <div className="w-6 h-0.5 bg-blue-400 opacity-40 transform -skew-x-45 mt-2 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-0.5 bg-blue-400 opacity-50 transform -skew-x-45 mt-2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}