import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import { hexToRgb } from '../../../common/helpers';
import useWebsiteColor from '../../../hooks/useWebsiteColor';

import './CircleSteps.less';

const StepsItems = props => {
  const colors = useWebsiteColor();

  const itemClassList = num =>
    classNames('CircleSteps__item', {
      'CircleSteps__item--active': num === props.activeStep,
      'CircleSteps__item--invisible': !props.isThirdPageVisible,
    });
  const circleStepsClass = classNames('CircleSteps', {
    'CircleSteps__two-circles': !props.isThirdPageVisible,
  });

  return (
    <div
      className={circleStepsClass}
      style={{
        '--website-color': `${colors?.background}`,
        '--website-hover-color': `${hexToRgb(colors?.background, 1)}`,
      }}
    >
      {props.config.map(item => (
        <div className={itemClassList(item.num)} key={item.num}>
          <span className="CircleSteps__itemCircle">{item.num}</span>
          <span className="CircleSteps__itemTitle">{props.intl.formatMessage({ id: item.id, defaultMessage: item.title })}</span>
        </div>
      ))}
    </div>
  );
};

StepsItems.propTypes = {
  config: PropTypes.shape().isRequired,
  activeStep: PropTypes.bool.isRequired,
  isThirdPageVisible: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(StepsItems);
