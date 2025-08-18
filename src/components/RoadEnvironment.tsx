'use client';

interface RoadEnvironmentProps {
  bikePosition: number;
  selectedPath: 'recent' | 'mycollection';
  hasReachedEnd: boolean;
}

export function RoadEnvironment({ bikePosition, selectedPath, hasReachedEnd }: RoadEnvironmentProps) {
  // Generate extended road segments - longer road for 30+ collectibles with proper highway design
  const roadSegments = Array.from({ length: 120 }, (_, i) => i);
  
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
            {/* Realistic Highway Surface with multiple lanes */}
            <div 
              className={`absolute ${theme.roadColor} shadow-2xl border-t-2 border-gray-900`}
              style={{
                width: '320px',
                height: '140px',
                left: '50%',
                top: '440px',
                transform: `translate3d(-50%, 0, ${segment * 100}px) rotateX(90deg)`,
                transformOrigin: 'center top',
                background: `linear-gradient(to bottom, #2d3748 0%, #1a202c 100%)`,
                borderLeft: '8px solid #1a202c',
                borderRight: '8px solid #1a202c'
              }}
            >
              {/* Highway lane dividers (dashed lines) */}
              <div 
                className="absolute w-1.5 h-full left-1/3 opacity-70"
                style={{
                  background: `repeating-linear-gradient(
                    to bottom,
                    transparent 0px,
                    transparent 15px,
                    #fbbf24 15px,
                    #fbbf24 25px
                  )`
                }}
              ></div>
              <div 
                className="absolute w-1.5 h-full right-1/3 opacity-70"
                style={{
                  background: `repeating-linear-gradient(
                    to bottom,
                    transparent 0px,
                    transparent 15px,
                    #fbbf24 15px,
                    #fbbf24 25px
                  )`
                }}
              ></div>
              
              {/* Center median strip */}
              <div className="absolute w-3 h-full bg-yellow-400 left-1/2 transform -translate-x-1/2 opacity-90 shadow-inner"></div>
              
              {/* Highway edge lines (solid white) */}
              <div className="absolute w-2 h-full bg-white left-2 opacity-80 shadow-sm"></div>
              <div className="absolute w-2 h-full bg-white right-2 opacity-80 shadow-sm"></div>
              
              {/* Road texture and wear marks */}
              {segment % 4 === 0 && (
                <div className="absolute inset-0 bg-gray-800 opacity-20 mix-blend-multiply"></div>
              )}
              
              {/* Occasional road markings */}
              {segment % 15 === 0 && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-60 font-bold">
                  HIGHWAY 1
                </div>
              )}
            </div>
            
            {/* Highway Shoulders with guardrails */}
            <div 
              className={`absolute ${theme.roadSideColor} opacity-80`}
              style={{
                width: '400px',
                height: '160px',
                left: '50%',
                top: '430px',
                transform: `translate3d(-50%, 0, ${segment * 100}px) rotateX(90deg)`,
                transformOrigin: 'center top',
                zIndex: -1,
                background: 'linear-gradient(to right, #374151, #4b5563, #374151)'
              }}
            >
              {/* Guardrail reflectors */}
              {segment % 3 === 0 && (
                <>
                  <div className="absolute left-4 top-1/2 w-2 h-1 bg-red-500 opacity-80 rounded transform -translate-y-1/2"></div>
                  <div className="absolute right-4 top-1/2 w-2 h-1 bg-red-500 opacity-80 rounded transform -translate-y-1/2"></div>
                </>
              )}
            </div>
            
            {/* Highway Infrastructure */}
            {segment % 20 === 0 && (
              <>
                {/* Highway Mile Markers */}
                <div 
                  className="absolute bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg"
                  style={{
                    left: 'calc(50% + 180px)',
                    top: '380px',
                    transform: `translate3d(0, 0, ${segment * 100}px)`,
                    zIndex: 50
                  }}
                >
                  MILE {Math.floor(segment / 20) + 1}
                </div>
                
                {/* Street Lights */}
                <div 
                  className="absolute"
                  style={{
                    left: 'calc(50% + 200px)',
                    top: '300px',
                    transform: `translate3d(0, 0, ${segment * 100}px)`,
                    zIndex: 40
                  }}
                >
                  <div className="w-3 h-20 bg-gray-600 shadow-lg"></div>
                  <div className="w-8 h-3 bg-yellow-400 -mt-2 ml-0.5 rounded opacity-60 shadow-md"></div>
                  <div className="w-6 h-6 bg-gray-800 -mt-1 ml-1 rounded-full shadow-inner"></div>
                </div>
              </>
            )}
            
            {/* Highway Signs */}
            {segment % 25 === 5 && (
              <div 
                className="absolute"
                style={{
                  left: 'calc(50% - 220px)',
                  top: '320px',
                  transform: `translate3d(0, 0, ${segment * 100}px)`,
                  zIndex: 45
                }}
              >
                <div className="w-2 h-16 bg-gray-600 shadow-lg mx-auto"></div>
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded shadow-lg -mt-2">
                  <div>NFT VALLEY</div>
                  <div className="text-xs opacity-80">NEXT EXIT</div>
                </div>
              </div>
            )}
            
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
              
              {/* Enhanced 3D Trees with variety */}
              {segment % 3 === 0 && (
                <div className="absolute right-6 top-8">
                  {/* Tree canopy with layered effect */}
                  <div className={`w-8 h-16 ${theme.treeColor} rounded-t-full shadow-2xl relative`}>
                    <div className={`absolute w-6 h-12 ${theme.darkTreeColor} rounded-t-full top-3 left-1 opacity-80`}></div>
                    <div className="absolute w-2 h-2 bg-red-400 top-2 left-3 rounded-full opacity-70"></div>
                    <div className="absolute w-1 h-1 bg-yellow-400 top-4 left-5 rounded-full opacity-60"></div>
                  </div>
                  {/* Tree trunk with bark texture */}
                  <div className="w-3 h-8 bg-gradient-to-b from-amber-800 to-amber-900 mx-auto shadow-lg border border-amber-700">
                    <div className="w-1 h-full bg-amber-700 ml-1 opacity-60"></div>
                  </div>
                  {/* Tree shadow */}
                  <div className="absolute w-12 h-4 bg-black opacity-20 -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full blur-sm"></div>
                </div>
              )}
              
              {/* 3D Rocks and Boulders */}
              {segment % 7 === 3 && (
                <div className="absolute left-8 top-16">
                  <div className="relative">
                    <div className="w-6 h-4 bg-gray-600 rounded-full shadow-lg"></div>
                    <div className="w-4 h-3 bg-gray-500 absolute top-0 left-1 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-700 absolute top-1 left-2 rounded-full"></div>
                    <div className="absolute w-8 h-2 bg-black opacity-30 -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full blur-sm"></div>
                  </div>
                </div>
              )}
              
              {/* Highway Barriers and Fencing */}
              {segment % 5 === 1 && (
                <div className="absolute right-2 top-4 w-full h-8">
                  <div className="w-full h-1 bg-gray-500 shadow-md"></div>
                  <div className="w-2 h-8 bg-gray-600 absolute left-4 -top-3 shadow-lg"></div>
                  <div className="w-2 h-8 bg-gray-600 absolute left-8 -top-3 shadow-lg"></div>
                  <div className="w-2 h-8 bg-gray-600 absolute left-12 -top-3 shadow-lg"></div>
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
              
              {/* Enhanced 3D Trees - Right Side */}
              {segment % 4 === 0 && (
                <div className="absolute left-6 top-10">
                  {/* Larger tree canopy with depth */}
                  <div className={`w-10 h-20 ${theme.treeColor} rounded-t-full shadow-2xl relative`}>
                    <div className={`absolute w-8 h-16 ${theme.darkTreeColor} rounded-t-full top-4 left-1 opacity-70`}></div>
                    <div className={`absolute w-6 h-12 ${theme.treeColor} rounded-t-full top-2 right-1 opacity-90`}></div>
                    {/* Fruit/leaves details */}
                    <div className="absolute w-2 h-2 bg-red-500 top-3 left-4 rounded-full opacity-80"></div>
                    <div className="absolute w-1 h-1 bg-orange-400 top-6 left-6 rounded-full opacity-70"></div>
                    <div className="absolute w-1 h-1 bg-yellow-400 top-5 left-2 rounded-full opacity-60"></div>
                  </div>
                  {/* Enhanced trunk */}
                  <div className="w-4 h-10 bg-gradient-to-b from-amber-800 to-amber-900 mx-auto shadow-xl border border-amber-700 relative">
                    <div className="w-1 h-full bg-amber-700 ml-1 opacity-60"></div>
                    <div className="w-1 h-full bg-amber-600 mr-1 ml-auto opacity-40"></div>
                  </div>
                  {/* Tree shadow */}
                  <div className="absolute w-16 h-6 bg-black opacity-25 -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full blur-md"></div>
                </div>
              )}
              
              {/* Enhanced Rocky Landscape */}
              {segment % 7 === 2 && (
                <div className="absolute right-10 top-6">
                  <div className="relative">
                    {/* Large boulder */}
                    <div className="w-8 h-6 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg shadow-xl transform rotate-12"></div>
                    <div className="w-6 h-4 bg-gradient-to-br from-gray-600 to-gray-800 absolute top-1 left-1 rounded-lg"></div>
                    <div className="w-4 h-3 bg-gray-400 absolute top-2 left-2 rounded opacity-80"></div>
                    {/* Moss and lichen */}
                    <div className="w-2 h-1 bg-green-600 absolute top-0 right-1 rounded opacity-60"></div>
                    <div className="w-1 h-1 bg-green-500 absolute top-3 left-3 rounded opacity-70"></div>
                    {/* Boulder shadow */}
                    <div className="absolute w-12 h-3 bg-black opacity-30 -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full blur-md"></div>
                  </div>
                </div>
              )}
              
              {/* Highway Communication Towers */}
              {segment % 30 === 15 && (
                <div className="absolute right-4 top-2">
                  <div className="w-2 h-24 bg-red-600 shadow-lg"></div>
                  <div className="w-6 h-1 bg-gray-600 absolute top-4 left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-4 h-1 bg-gray-600 absolute top-8 left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-2 h-2 bg-red-500 absolute -top-2 left-0 rounded-full opacity-80 animate-pulse"></div>
                </div>
              )}
              
              {/* Wind Turbines in Distance */}
              {segment % 40 === 20 && (
                <div className="absolute right-2 top-1" style={{ transform: 'scale(0.6)' }}>
                  <div className="w-1 h-16 bg-white shadow-md"></div>
                  <div className={`w-8 h-0.5 bg-white absolute top-0 left-1/2 transform -translate-x-1/2 origin-left ${
                    selectedPath === 'recent' ? 'animate-spin' : ''
                  }`} style={{ animationDuration: '2s' }}></div>
                  <div className={`w-8 h-0.5 bg-white absolute top-0 left-1/2 transform -translate-x-1/2 rotate-120 origin-left ${
                    selectedPath === 'recent' ? 'animate-spin' : ''
                  }`} style={{ animationDuration: '2s' }}></div>
                  <div className={`w-8 h-0.5 bg-white absolute top-0 left-1/2 transform -translate-x-1/2 rotate-240 origin-left ${
                    selectedPath === 'recent' ? 'animate-spin' : ''
                  }`} style={{ animationDuration: '2s' }}></div>
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