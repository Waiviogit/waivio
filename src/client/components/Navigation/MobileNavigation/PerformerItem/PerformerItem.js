import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  formatPerformance,
  getPerformerLinks,
} from '../../../../app/Sidebar/TopPerformers/TopPerformers';
import './PerformerItem.less';

const PerformerItem = ({ performer, period, toggleMobileNavigation }) => (
  <div className="PerformerItem" key={performer.name}>
    <div className="PerformerItem__links" onClick={toggleMobileNavigation} role="presentation">
      {getPerformerLinks(performer)}
    </div>
    <div
      className={classNames('PerformerItem__info', {
        success: performer[period] > 0,
        danger: performer[period] < 0,
        nil: performer[period] === 0,
      })}
    >
      {formatPerformance(performer[period])}
    </div>
  </div>
);

PerformerItem.propTypes = {
  toggleMobileNavigation: PropTypes.func.isRequired,
  performer: PropTypes.shape().isRequired,
  period: PropTypes.string.isRequired,
};

export default PerformerItem;
