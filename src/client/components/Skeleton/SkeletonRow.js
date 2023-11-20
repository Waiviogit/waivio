import React from 'react';
import PropTypes from 'prop-types';

const SkeletonRow = ({ rows }) => {
  const skeletonRows = Array.from({ length: rows }, (_, index) => (
    <span key={index} className="ant-card-loading-block" />
  ));

  return <div style={{ display: 'flex', flexDirection: 'column' }}>{skeletonRows}</div>;
};

SkeletonRow.propTypes = {
  rows: PropTypes.number.isRequired,
};

export default SkeletonRow;
