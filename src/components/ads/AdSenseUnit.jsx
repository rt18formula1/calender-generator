import React, { useEffect } from 'react';

/**
 * AdSenseUnit Component
 * Renders a Google AdSense ad unit
 * 
 * @param {string} slotId - The Google AdSense slot ID
 * @param {string} format - Ad format (e.g., 'auto', 'horizontal', 'vertical', 'rectangle')
 * @param {string} className - Additional CSS classes
 */
const AdSenseUnit = ({ slotId, format = 'auto', className = '' }) => {
  useEffect(() => {
    // Push the ad to Google AdSense
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [slotId]);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx" // Replace with your Google AdSense client ID
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseUnit;
