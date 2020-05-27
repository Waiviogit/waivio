import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { isGuestUser } from '../reducers';
import { epochToUTC } from '../helpers/formatter';

const WalletGuestAuthorRewards = ({ amount, timestamp }) => {
  const isGuest = useSelector(isGuestUser);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            <FormattedMessage id="author_rewards" defaultMessage="Author rewards" />
          </div>
          <div className={classNames(`UserWalletTransactions__received ${isGuest ? 'guest' : ''}`)}>
            {amount}
          </div>
        </div>
        <span className="UserWalletTransactions__timestamp">
          <BTooltip
            title={
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={epochToUTC(timestamp)} />
            </span>
          </BTooltip>
        </span>
      </div>
    </div>
  );
};

WalletGuestAuthorRewards.propTypes = {
  amount: PropTypes.element,
  timestamp: PropTypes.string,
};

WalletGuestAuthorRewards.defaultProps = {
  from: '',
  memo: '',
  amount: <span />,
  timestamp: '',
};

export default WalletGuestAuthorRewards;
