import PropTypes from 'prop-types';
import React from 'react';

const EarnsCommissionsOnPurchases = ({ align, text, padding }) => (
  <div
    style={{
      padding: padding || '0',
      color: 'rgb(164 173 184)',
      textAlign: align || 'center',
      marginBottom: '15px',
    }}
  >
    {text || 'Earns commissions on purchases'}
  </div>
);

EarnsCommissionsOnPurchases.propTypes = {
  align: PropTypes.string,
  text: PropTypes.string,
  padding: PropTypes.string,
};

export default EarnsCommissionsOnPurchases;
