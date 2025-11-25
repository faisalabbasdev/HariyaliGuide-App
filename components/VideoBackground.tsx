import React from 'react';

interface VideoBackgroundProps {
  enabled: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ enabled }) => {
  if (!enabled) {
    return (
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500" />
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Actual Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        poster="https://images.unsplash.com/photo-1625246333195-031246c29c21?q=80&w=1974&auto=format&fit=crop"
        style={{ objectFit: 'cover' }}
      >
        {/* Wheat Field Video - High quality, peaceful */}
        <source src="https://cdn.pixabay.com/video/2022/10/12/134674-760172635_tiny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Heavy Overlay for Readability - White in Light Mode, Dark in Dark Mode */}
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-[1px]"></div>
      
      {/* Subtle Gradient to make bottom nav readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 dark:to-gray-900/90"></div>
    </div>
  );
};