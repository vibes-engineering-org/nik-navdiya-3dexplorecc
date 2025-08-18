'use client';

interface RoadEnvironmentProps {
  bikePosition: number;
  selectedPath: 'recent' | 'mycollection';
  hasReachedEnd: boolean;
}

export function RoadEnvironment({ bikePosition, selectedPath, hasReachedEnd }: RoadEnvironmentProps) {
  // Generate extended road segments - longer road for 20+ collectibles
  const roadSegments = Array.from({ length: 80 }, (_, i) => i);
  
  // Enhanced seasonal theme based on selected path
  const getSeasonalTheme = () => {
    if (selectedPath === 'recent') {
      return {
        roadColor: 'bg-gray-700',
        roadSideColor: 'bg-gray-800',
        grassColor: 'bg-green-500',
        darkGrassColor: 'bg-green-700',
        flowerColors: ['bg-pink-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400', 'bg-blue-400', 'bg-orange-400'],
        treeColor: 'bg-green-600',
        darkTreeColor: 'bg-green-800',
        skyGradient: 'from-sky-400 via-sky-300 to-green-300',
        mountainColor: 'bg-blue-600',
        cloudColor: 'bg-white'
      };
    } else {
      return {
        roadColor: 'bg-gray-800',
        roadSideColor: 'bg-gray-900',
        grassColor: 'bg-orange-400',
        darkGrassColor: 'bg-orange-600',
        flowerColors: ['bg-orange-500', 'bg-red-500', 'bg-yellow-600', 'bg-brown-400', 'bg-amber-500', 'bg-red-600'],
        treeColor: 'bg-orange-700',
        darkTreeColor: 'bg-orange-900',
        skyGradient: 'from-orange-400 via-orange-300 to-yellow-300',
        mountainColor: 'bg-orange-800',
        cloudColor: 'bg-orange-100'
      };
    }
  };

  const theme = getSeasonalTheme();

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      {/* Enhanced Sky/Background with depth layers */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.skyGradient}`}>
        {/* Distant mountains */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`mountain-${i}`}
            className={`absolute ${theme.mountainColor} opacity-20`}
            style={{
              width: `${120 + i * 20}px`,
              height: `${60 + i * 15}px`,
              left: `${i * 15 + 5}%`,
              bottom: '20%',
              transform: `translate3d(0, 0, ${-800 - i * 100}px)`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        ))}
        
        {/* Floating clouds */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`cloud-${i}`}
            className={`absolute ${theme.cloudColor} opacity-60 rounded-full`}
            style={{
              width: `${40 + (i * 7) % 30}px`,
              height: `${20 + (i * 5) % 15}px`,
              left: `${(i * 23) % 85 + 5}%`,
              top: `${10 + (i * 11) % 30}%`,
              transform: `translate3d(0, 0, ${-600 - (i * 50)}px)`,
            }}
          />
        ))}
      </div>
      
      {/* Enhanced Road segments with improved geometry */}
      {roadSegments.map((segment) => {
        const segmentSeed = segment * 7; // Consistent randomness per segment
        return (
          <div key={segment}>
            {/* Main road surface with better perspective */}
            <div 
              className={`absolute ${theme.roadColor} shadow-xl`}
              style={{
                width: '240px',
                height: '120px',
                left: '50%',
                top: '450px',
                transform: `translate3d(-50%, 0, ${segment * 100}px) rotateX(90deg)`,
                transformOrigin: 'center top',
                borderLeft: '6px solid #4a5568',
                borderRight: '6px solid #4a5568'
              }}
            >
              {/* Road center line */}
              <div className="absolute w-2 h-full bg-yellow-400 left-1/2 transform -translate-x-1/2 opacity-80"></div>
              {/* Road edge lines */}
              <div className="absolute w-1 h-full bg-white left-4 opacity-60"></div>
              <div className="absolute w-1 h-full bg-white right-4 opacity-60"></div>
            </div>
            
            {/* Road shoulders */}
            <div 
              className={`absolute ${theme.roadSideColor} opacity-70`}
              style={{
                width: '280px',
                height: '140px',
                left: '50%',
                top: '440px',
                transform: `translate3d(-50%, 0, ${segment * 100}px) rotateX(90deg)`,
                transformOrigin: 'center top',
                zIndex: -1
              }}
            />
            
            {/* Enhanced left side environment */}
            <div 
              className={`absolute ${segment % 2 === 0 ? theme.grassColor : theme.darkGrassColor}`}
              style={{
                left: 'calc(50% - 360px)',
                top: '380px',
                transform: `translate3d(0, 0, ${segment * 100}px) rotateX(90deg)`,
                transformOrigin: 'center top',
                width: '240px',
                height: '240px'
              }}
            >
              {/* Dense flower clusters */}
              {Array.from({ length: 4 }, (_, i) => (
                (segmentSeed + i * 3) % 10 > 3 && (
                  <div 
                    key={i}
                    className={`absolute w-3 h-3 rounded-full ${
                      theme.flowerColors[(segmentSeed + i) % theme.flowerColors.length]
                    } shadow-md`}
                    style={{
                      left: `${((segmentSeed + i * 17) % 70) + 15}%`,
                      top: `${((segmentSeed + i * 23) % 70) + 15}%`,
                    }}
                  />
                )
              ))}
              
              {/* Varied trees with shadows */}
              {segment % 3 === 0 && (
                <div className="absolute right-6 top-8">
                  <div className={`w-5 h-12 ${theme.treeColor} rounded-t-full shadow-lg`}></div>
                  <div className={`w-6 h-14 ${theme.darkTreeColor} rounded-t-full absolute -top-2 -left-0.5 -z-10`}></div>
                  <div className="w-2 h-6 bg-amber-800 mx-auto shadow-md"></div>
                </div>
              )}
              
              {/* Bushes and small plants */}
              {segment % 5 === 1 && (
                <div className="absolute left-8 top-12">
                  <div className={`w-4 h-6 ${theme.darkTreeColor} rounded-full opacity-80`}></div>
                </div>
              )}
            </div>
            
            {/* Enhanced right side environment */}
            <div 
              className={`absolute ${segment % 2 === 1 ? theme.grassColor : theme.darkGrassColor}`}
              style={{
                right: 'calc(50% - 360px)',
                top: '380px',
                transform: `translate3d(0, 0, ${segment * 100}px) rotateX(90deg)`,
                transformOrigin: 'center top',
                width: '240px',
                height: '240px'
              }}
            >
              {/* Dense flower clusters */}
              {Array.from({ length: 4 }, (_, i) => (
                (segmentSeed + i * 5) % 10 > 4 && (
                  <div 
                    key={i}
                    className={`absolute w-3 h-3 rounded-full ${
                      theme.flowerColors[(segmentSeed + i * 2) % theme.flowerColors.length]
                    } shadow-md`}
                    style={{
                      left: `${((segmentSeed + i * 19) % 70) + 15}%`,
                      top: `${((segmentSeed + i * 29) % 70) + 15}%`,
                    }}
                  />
                )
              ))}
              
              {/* Varied trees */}
              {segment % 4 === 0 && (
                <div className="absolute left-6 top-10">
                  <div className={`w-6 h-16 ${theme.treeColor} rounded-t-full shadow-lg`}></div>
                  <div className={`w-7 h-18 ${theme.darkTreeColor} rounded-t-full absolute -top-2 -left-0.5 -z-10`}></div>
                  <div className="w-2 h-8 bg-amber-800 mx-auto shadow-md"></div>
                </div>
              )}
              
              {/* Rocky elements */}
              {segment % 7 === 2 && (
                <div className="absolute right-10 top-6">
                  <div className="w-3 h-2 bg-gray-600 rounded-full"></div>
                  <div className="w-2 h-1 bg-gray-500 rounded-full ml-1 mt-1"></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Enhanced End barrier with 3D effect */}
      {hasReachedEnd && (
        <div 
          className="absolute left-1/2"
          style={{
            top: '380px',
            transform: `translate3d(-50%, 0, ${roadSegments.length * 100}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Main barrier */}
          <div className="bg-red-600 border-4 border-red-800 w-64 h-40 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500 to-red-700"></div>
            <div className="flex items-center justify-center h-full text-white font-bold text-xl relative z-10">
              <div className="text-center">
                <div className="text-2xl mb-2">⛔</div>
                <div>ROAD CLOSED</div>
                <div className="text-sm mt-1 opacity-75">End of Journey</div>
              </div>
            </div>
          </div>
          
          {/* Barrier supports */}
          <div className="absolute -left-4 top-0 w-8 h-40 bg-gray-700 border-2 border-gray-800"></div>
          <div className="absolute -right-4 top-0 w-8 h-40 bg-gray-700 border-2 border-gray-800"></div>
          
          {/* Warning cones */}
          <div className="absolute -left-16 top-32 w-6 h-8 bg-orange-500 transform rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute -right-16 top-32 w-6 h-8 bg-orange-500 transform -rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
        </div>
      )}
    </div>
  );
}