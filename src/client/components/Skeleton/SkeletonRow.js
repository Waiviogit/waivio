import React from 'react';
import PropTypes from 'prop-types';

const SkeletonRow = props => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {[...Array(props.rows)].map(() => (
      // eslint-disable-next-line react/jsx-key
      <p className="ant-card-loading-block" />
    ))}
  </div>
);

SkeletonRow.propTypes = {
  rows: PropTypes.number.isRequired,
};

export default SkeletonRow;
