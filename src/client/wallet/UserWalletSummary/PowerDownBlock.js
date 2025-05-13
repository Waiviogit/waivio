import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import Loading from '../../components/Icon/Loading';
import { isMobile } from '../../../common/helpers/apiHelpers';

import { getFormattedPendingWithdrawalSP } from './HivePowerBlock';

const PowerDownBlock = ({
  powerClassList,
  setPowerDownProgress,
  user,
  loadingGlobalProperties,
  totalVestingShares,
  totalVestingFundSteem,
  isAuth,
  nextPowerDownDate,
  authUserPage,
  setShowCancelPowerDown,
}) => (
  <div className="UserWalletSummary__itemWrap--no-border">
    <div className="UserWalletSummary__item">
      <div className="UserWalletSummary__label power-down">
        <FormattedMessage id="power_down" defaultMessage="Power Down" />
      </div>
      <div className={powerClassList} onClick={() => setPowerDownProgress(true)}>
        {user.fetching || loadingGlobalProperties ? (
          <Loading />
        ) : (
          <span>
            {getFormattedPendingWithdrawalSP(
              user,
              totalVestingShares,
              totalVestingFundSteem,
              false,
            )}
            {' HP'}
          </span>
        )}
      </div>
    </div>
    <div className="UserWalletSummary__actions">
      <p className="UserWalletSummary__description">
        <FormattedMessage id="next_power_down" defaultMessage="Next power down" />:{' '}
        {isMobile() ? <div>{nextPowerDownDate}</div> : nextPowerDownDate}
      </p>
      {isAuth && authUserPage && (
        <Button
          onClick={() => setShowCancelPowerDown(true)}
          className={'UserWalletSummary__button'}
        >
          Cancel{' '}
        </Button>
      )}
    </div>
  </div>
);

PowerDownBlock.propTypes = {
  totalVestingShares: PropTypes.string,
  totalVestingFundSteem: PropTypes.string,
  user: PropTypes.shape(),
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  setPowerDownProgress: PropTypes.func,
  setShowCancelPowerDown: PropTypes.func,
  powerClassList: PropTypes.string,
  nextPowerDownDate: PropTypes.string,
};

export default PowerDownBlock;
