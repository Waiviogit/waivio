import React from 'react';
import propTypes from 'prop-types';

const SkeletonCustom = ({ isLoading, children, rows = 9, width, randomWidth = false, className }) => isLoading ? (
  <div className={`${className}`}>
    {[...Array(rows)].map((data ,index) => (
      <p
        className={'ant-card-loading-block'}
        key={index} // eslint-disable-line
        style={{width: randomWidth ? width * 0.4 + width * 0.6 * Math.random() : width, height: 18 }}
      />
      ))}
  </div>
) : children;

SkeletonCustom.propTypes = {
  isLoading: propTypes.bool.isRequired,
  children: propTypes.node,
  randomWidth: propTypes.bool,
  className: propTypes.string,
  width: propTypes.number,
  rows: propTypes.number,
};

SkeletonCustom.defaultProps = {
  children: null,
  className: 'loading-placeholder',
  randomWidth: false,
  width: undefined,
  rows: 5,
};

export default SkeletonCustom;
