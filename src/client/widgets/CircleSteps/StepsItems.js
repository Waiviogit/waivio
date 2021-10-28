import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './CircleSteps.less';

const StepsItems = props => {
  const itemClassList = num =>
    classNames('CircleSteps__item', {
      'CircleSteps__item--active': num === props.activeStep,
    });

  return (
    <div className="CircleSteps">
      {props.config.map(item => (
        <div className={itemClassList(item.num)} key={item.num}>
          <span className="CircleSteps__itemCircle">{item.num}</span>
          <span className="CircleSteps__itemTitle">{item.title}</span>
        </div>
      ))}
    </div>
  );
};

StepsItems.propTypes = {
  config: PropTypes.shape().isRequired,
  activeStep: PropTypes.bool.isRequired,
};

export default StepsItems;
