import PropTypes from 'prop-types';
import React from 'react';

const EarnsCommissionsOnPurchases = ({ align, text }) => (
  <div
    style={{
      padding: '0 20px',
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
};

export default EarnsCommissionsOnPurchases;
