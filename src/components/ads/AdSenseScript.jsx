import React, { useEffect } from 'react';

/**
 * AdSenseScript Component
 * Loads the Google AdSense script
 * This component should be included once in your main layout or App component
 */
const AdSenseScript = () => {
  useEffect(() => {
    // Load Google AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx'; // Replace with your Google AdSense client ID
    script.crossOrigin = 'anonymous';
    
    // Add script to document head
    document.head.appendChild(script);

    return () => {
      // Cleanup: Remove script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default AdSenseScript;
