import React, { useState, useEffect } from 'react';
import loader from './assets/pre-loader.png';

interface PreloaderProps {
  children: React.ReactNode;
  duration?: number;
  imageUrl: string;  // Add this for image path
  iconSize?: {
    width: string;
    height: string;
  };
}

export const Preloader: React.FC<PreloaderProps> = ({
  children,
  duration = 500,
  imageUrl = loader,
  iconSize = {
    width: 'w-16',
    height: 'h-16'
  }
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className={`${iconSize.width} ${iconSize.height}`}>
          <img 
            src={imageUrl} 
            alt="Loading"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
      </div>
    );
  }

  return children;
};