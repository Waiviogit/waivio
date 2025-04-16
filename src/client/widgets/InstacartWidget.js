import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { websiteStatisticsAction } from '../../waivioApi/ApiClient';

const InstacartWidget = ({ instacartAff, className, isProduct = false }) => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      websiteStatisticsAction();
      if (typeof window !== 'undefined' && window?.gtag) {
        window.gtag('event', 'buy_now', { debug_mode: true });
      }
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className={className}
      id="shop-with-instacart-v1"
      data-affiliate_id={instacartAff?.affiliateCode}
      data-source_origin="affiliate_hub"
      data-affiliate_platform="recipe_widget"
      style={
        isProduct
          ? { marginBottom: '15px' }
          : { display: 'flex', justifyContent: 'center', marginBottom: '10px' }
      }
    />
  );
};

InstacartWidget.propTypes = {
  instacartAff: PropTypes.shape({
    affiliateCode: PropTypes.string,
  }),
  className: PropTypes.string,
  isProduct: PropTypes.bool,
};

export default InstacartWidget;
