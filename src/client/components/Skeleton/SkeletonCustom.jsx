import React from 'react';
import propTypes from 'prop-types';
import { Skeleton } from 'antd';

const SkeletonCustom = ({ isLoading, rows = 9, width, randomWidth = false, className }) => (
  <div className={className}>
    <Skeleton
      active
      loading={isLoading}
      title={false}
      paragraph={{
        rows,
        width: randomWidth
          ? [...Array(rows)].map(() => width * 0.4 + width * 0.6 * Math.random())
          : width,
      }}
    />
  </div>
);

SkeletonCustom.propTypes = {
  isLoading: propTypes.bool.isRequired,
  randomWidth: propTypes.bool,
  className: propTypes.string,
  width: propTypes.number,
  rows: propTypes.number,
};

SkeletonCustom.defaultProps = {
  className: 'loading-placeholder',
  randomWidth: false,
  width: undefined,
  rows: 5,
};

export default SkeletonCustom;
