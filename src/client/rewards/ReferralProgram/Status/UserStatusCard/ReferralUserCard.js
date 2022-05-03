import React from 'react';
import PropTypes from 'prop-types';
import ArrowSmallIcon from '@icons/arrowSmall.svg';

import Avatar from '../../../../components/Avatar';

import './ReferralUserCard.less';

const ReferralUserCard = ({ username, alias, daysLeft, history }) => (
  <div
    role="presentation"
    className="ReferralUserCard"
    onClick={() => history.push(`/rewards/referral-status/${username}/table`)}
  >
    <div className="ReferralUserCard__content">
      <Avatar username={username} size={40} />
      <div className="ReferralUserCard__content__left">
        <div className="ReferralUserCard__alias">{alias}</div>
        <div className="ReferralUserCard__wrap">
          <div className="ReferralUserCard__name">{`@${username}`}</div>
        </div>
      </div>
    </div>
    <div className="ReferralUserCard__right">
      <div className="ReferralUserCard__days">{`${daysLeft} days`}</div>
      <div className="ReferralUserCard__arrow">
        <img src={ArrowSmallIcon} alt="User status card" />
      </div>
    </div>
  </div>
);

export default ReferralUserCard;

ReferralUserCard.propTypes = {
  username: PropTypes.string,
  alias: PropTypes.string,
  daysLeft: PropTypes.string,
  history: PropTypes.shape(),
};

ReferralUserCard.defaultProps = {
  username: '',
  alias: '',
  daysLeft: null,
  history: {},
};
