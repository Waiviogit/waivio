import PropTypes from 'prop-types';
import React from 'react';

const EarnsCommissionsOnPurchases = ({ align }) => (
  <div style={{ color: 'rgb(164 173 184)', textAlign: align || 'center', marginBottom: '15px' }}>
    Earns commissions on purchases
  </div>
);

EarnsCommissionsOnPurchases.propTypes = {
  align: PropTypes.string,
};

export default EarnsCommissionsOnPurchases;
