import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { capitalize, isEmpty, noop } from 'lodash';

import RewardsPopover from '../../RewardsPopover/RewardsPopover';

import './Proposition.less';

const PropositionFooter = ({
  type,
  openDetailsModal,
  countReservationDays,
  commentsCount,
  proposition,
  getProposition,
}) => {
  const getFooter = () => {
    switch (type) {
      case 'reserved':
        return (
          <React.Fragment>
            <div className="Proposition-new__button-container">
              <b>Reserved</b>
              <i className="iconfont icon-message_fill" />
              {commentsCount}
              <RewardsPopover proposition={proposition} getProposition={getProposition} />
            </div>
            <Button type="primary" onClick={openDetailsModal}>
              Write review
            </Button>
          </React.Fragment>
        );
      case 'history':
      case 'reservations':
      case 'messages':
      case 'fraud detection':
        return (
          <React.Fragment>
            <div className="Proposition-new__button-container">
              <b>{capitalize(proposition?.reviewStatus)}</b>
              <i className="iconfont icon-message_fill" />
              {commentsCount}
              <RewardsPopover
                proposition={proposition}
                getProposition={getProposition}
                type={type}
              />
            </div>
            {!isEmpty(proposition?.fraudCodes) && (
              <div>Codes: {proposition?.fraudCodes.join(', ')}</div>
            )}
          </React.Fragment>
        );

      default:
        return (
          <div>
            <Button type="primary" onClick={openDetailsModal}>
              <b>Reserve</b> Yor Reward
            </Button>{' '}
            for {countReservationDays} days
          </div>
        );
    }
  };

  return <div className="Proposition-new__footer">{getFooter()}</div>;
};

PropositionFooter.propTypes = {
  type: PropTypes.string.isRequired,
  openDetailsModal: PropTypes.func.isRequired,
  countReservationDays: PropTypes.number.isRequired,
  commentsCount: PropTypes.number.isRequired,
  getProposition: PropTypes.func,
  proposition: PropTypes.shape({
    reviewStatus: PropTypes.string,
    fraudCodes: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

PropositionFooter.defaultProps = {
  getProposition: noop,
};

export default PropositionFooter;
