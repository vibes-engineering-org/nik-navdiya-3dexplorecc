'use client';

interface RoadEnvironmentProps {
  bikePosition: number;
  selectedPath: 'recent' | 'mycollection';
  hasReachedEnd: boolean;
}

export function RoadEnvironment({ bikePosition, selectedPath, hasReachedEnd }: RoadEnvironmentProps) {
  // Generate road segments
  const roadSegments = Array.from({ length: 50 }, (_, i) => i);
  
  // Seasonal theme based on selected path
  const getSeasonalTheme = () => {
    if (selectedPath === 'recent') {
      return {
        roadColor: 'bg-gray-600',
        grassColor: 'bg-green-400',
        flowerColors: ['bg-pink-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400'],
        treeColor: 'bg-green-600',
        skyGradient: 'from-sky-300 to-green-200'
      };
    } else {
      return {
        roadColor: 'bg-gray-700',
        grassColor: 'bg-orange-300',
        flowerColors: ['bg-orange-500', 'bg-red-500', 'bg-yellow-600', 'bg-brown-400'],
        treeColor: 'bg-orange-600',
        skyGradient: 'from-orange-300 to-yellow-200'
      };
    }
  };

  const theme = getSeasonalTheme();

  return (
    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
      {/* Sky/Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.skyGradient}`}></div>
      
      {/* Road segments */}
      {roadSegments.map((segment) => (
        <div key={segment}>
          {/* Road surface */}
          <div 
            className={`absolute ${theme.roadColor} border-l-4 border-r-4 border-yellow-300`}
            style={{
              width: '200px',
              height: '100px',
              left: '50%',
              top: '450px',
              transform: `translate3d(-50%, 0, ${segment * 100}px) rotateX(90deg)`,
              transformOrigin: 'center top'
            }}
          >
            {/* Road markings */}
            <div className="absolute w-2 h-full bg-yellow-300 left-1/2 transform -translate-x-1/2 opacity-70"></div>
          </div>
          
          {/* Left side grass and decorations */}
          <div 
            className={`absolute ${theme.grassColor} w-40 h-100`}
            style={{
              left: 'calc(50% - 300px)',
              top: '400px',
              transform: `translate3d(0, 0, ${segment * 100}px) rotateX(90deg)`,
              transformOrigin: 'center top',
              height: '200px'
            }}
          >
            {/* Random flowers/plants */}
            {Math.random() > 0.7 && (
              <div 
                className={`absolute w-2 h-2 rounded-full ${
                  theme.flowerColors[Math.floor(Math.random() * theme.flowerColors.length)]
                }`}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
              ></div>
            )}
            
            {/* Trees */}
            {segment % 3 === 0 && (
              <div className="absolute right-4 top-4">
                <div className={`w-3 h-8 ${theme.treeColor} rounded-t-full`}></div>
                <div className="w-1 h-4 bg-brown-600 mx-auto"></div>
              </div>
            )}
          </div>
          
          {/* Right side grass and decorations */}
          <div 
            className={`absolute ${theme.grassColor} w-40 h-100`}
            style={{
              right: 'calc(50% - 300px)',
              top: '400px',
              transform: `translate3d(0, 0, ${segment * 100}px) rotateX(90deg)`,
              transformOrigin: 'center top',
              height: '200px'
            }}
          >
            {/* Random flowers/plants */}
            {Math.random() > 0.7 && (
              <div 
                className={`absolute w-2 h-2 rounded-full ${
                  theme.flowerColors[Math.floor(Math.random() * theme.flowerColors.length)]
                }`}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
              ></div>
            )}
            
            {/* Trees */}
            {segment % 4 === 0 && (
              <div className="absolute left-4 top-6">
                <div className={`w-4 h-10 ${theme.treeColor} rounded-t-full`}></div>
                <div className="w-1 h-5 bg-brown-600 mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* End barrier */}
      {hasReachedEnd && (
        <div 
          className="absolute bg-red-600 border-4 border-red-800 w-48 h-32 left-1/2"
          style={{
            top: '400px',
            transform: `translate3d(-50%, 0, ${roadSegments.length * 100}px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="flex items-center justify-center h-full text-white font-bold text-lg">
            ROAD CLOSED
          </div>
        </div>
      )}
    </div>
  );
}