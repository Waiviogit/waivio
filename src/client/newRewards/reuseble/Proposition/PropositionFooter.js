import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, noop } from 'lodash';
import { injectIntl } from 'react-intl';

import RewardsPopover from '../../RewardsPopover/RewardsPopover';
import Avatar from '../../../components/Avatar';

import './Proposition.less';

const PropositionFooter = ({
  type,
  openDetailsModal,
  countReservationDays,
  commentsCount,
  proposition,
  getProposition,
  intl,
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
      case 'fraud':
        return (
          <React.Fragment>
            <div className="Proposition-new__button-container">
              <b>
                {intl.formatMessage({
                  id: `type_${proposition?.reviewStatus}`,
                  defaultMessage: proposition?.reviewStatus,
                })}
              </b>
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
            {proposition?.userName && (
              <div className={'Proposition-new__userCard'}>
                <Avatar size={24} username={proposition?.userName} />
                <a href={`/@${proposition?.userName}`}>{proposition?.userName}</a>
              </div>
            )}
          </React.Fragment>
        );

      default:
        return (
          <div>
            <Button type="primary" onClick={openDetailsModal}>
              <b>Reserve</b> Your Reward
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
    userName: PropTypes.string,
    fraudCodes: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

PropositionFooter.defaultProps = {
  getProposition: noop,
};

export default injectIntl(PropositionFooter);
