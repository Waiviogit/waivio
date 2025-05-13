import React from 'react';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../components/Icon/Loading';

const InterestBlock = ({
  disabledClaim,
  user,
  powerClassList,
  loadingGlobalProperties,
  interest,
  isAuth,
  authUserPage,
  claimHdbInterest,
  showClaim,
  daysToClaimInterest,
}) => (
  <div className="UserWalletSummary__itemWrap--no-border last-block">
    <div className="UserWalletSummary__item">
      <div className="UserWalletSummary__label power-down">
        <FormattedMessage id="interest" defaultMessage="Interest" />
      </div>
      <div className={powerClassList}>
        {user.fetching || loadingGlobalProperties ? (
          <Loading />
        ) : (
          <span>
            <FormattedNumber value={interest} /> {' HBD'}
          </span>
        )}
      </div>
    </div>
    <div className="UserWalletSummary__actions">
      <p className="UserWalletSummary__description">HBD staking earnings ready to be claimed</p>
      {isAuth && authUserPage && (
        <Tooltip
          title={showClaim ? '' : `The claim will be available in ${daysToClaimInterest} days.`}
        >
          <Button
            onClick={claimHdbInterest}
            className={`UserWalletSummary__button ${disabledClaim ? 'disabled' : ''}`}
          >
            Claim{' '}
          </Button>
        </Tooltip>
      )}
    </div>
  </div>
);

InterestBlock.propTypes = {
  user: PropTypes.shape(),
  disabledClaim: PropTypes.bool,
  showClaim: PropTypes.bool,
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  claimHdbInterest: PropTypes.func,
  interest: PropTypes.number,
  daysToClaimInterest: PropTypes.number,
  powerClassList: PropTypes.string,
};

export default InterestBlock;
