import React from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';

import './Proposition.less';

const PropositionFooter = ({ type, openDetailsModal, countReservationDays, commentsCount }) => {
  const getFooter = () => {
    switch (type) {
      case 'reserved':
        return (
          <React.Fragment>
            <div className="Proposition-new__button-container">
              <b>Reserved</b>
              <i className="iconfont icon-message_fill" />
              {commentsCount}
              <Icon type="ellipsis" />
            </div>
            <Button type="primary" onClick={openDetailsModal}>
              Write review
            </Button>
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
};

export default PropositionFooter;
