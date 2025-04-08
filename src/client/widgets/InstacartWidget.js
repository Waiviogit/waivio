import React from 'react';
import PropTypes from 'prop-types';

const InstacartWidget = ({ instacartAff, className, isProduct = false }) => (
  <div
    className={className}
    id={'shop-with-instacart-v1'}
    data-affiliate_id={instacartAff?.affiliateCode}
    data-source_origin="affiliate_hub"
    data-affiliate_platform="recipe_widget"
    style={
      isProduct
        ? {
            marginBottom: '15px',
          }
        : {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '10px',
          }
    }
  />
);

InstacartWidget.propTypes = {
  instacartAff: PropTypes.shape(),
  className: PropTypes.string,
  isProduct: PropTypes.bool,
};

export default InstacartWidget;
