import React, { useState, useEffect } from 'react';
import './GlobalLoader.css';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const show = () => setIsLoading(true);
    const hide = () => setIsLoading(false);

    window.addEventListener('showLoader', show);
    window.addEventListener('hideLoader', hide);

    return () => {
      window.removeEventListener('showLoader', show);
      window.removeEventListener('hideLoader', hide);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="global-loader-overlay">
      <div className="global-loader-container">
        <div className="global-loader-spinner"></div>
        <div className="global-loader-text">Loading...</div>
      </div>
    </div>
  );
};

export default GlobalLoader;
