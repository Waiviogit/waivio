import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { websiteStatisticsAction } from '../../waivioApi/ApiClient';

const InstacartWidget = ({ instacartAff, className, isProduct = false }) => {
  useEffect(() => {
    const onBlur = () => {
      websiteStatisticsAction();
      window && window.gtag('event', 'buy_now', { debug_mode: true });
    };

    window && window.addEventListener('blur', onBlur);

    return () => window && window.removeEventListener('blur', onBlur);
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
