import { isNil } from 'lodash';
import React from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import Loading from '../../components/Icon/Loading';
import formatter from '../../../common/helpers/steemitFormatter';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import { isMobile } from '../../../common/helpers/apiHelpers';

import {
  calculatePendingWithdrawalSP,
  calculateTotalDelegatedSP,
} from '../../vendor/steemitHelpers';
import BTooltip from '../../components/BTooltip';
import PowerDownBlock from './PowerDownBlock';
import DelegateHiveBlock from './DelegateHiveBlock';
import RcBlock from './RcBlock';

export const billion = 1000000000;
const getFormattedTotalDelegatedSP = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  showBrackets = true,
) => {
  const totalDelegatedSP = calculateTotalDelegatedSP(
    user,
    totalVestingShares,
    totalVestingFundSteem,
  );

  const getBracketText = () => {
    if (showBrackets) {
      return totalDelegatedSP > 0 ? ' (+' : ' (';
    }

    return totalDelegatedSP > 0 ? ' +' : ' ';
  };

  if (totalDelegatedSP !== 0) {
    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_balance_account_tooltip"
              defaultMessage="Balance of HIVE Power delegations to/from other users"
            />
          </span>
        }
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
          {getBracketText()}
          <FormattedNumber value={totalDelegatedSP} />
          {showBrackets && ')'}
        </span>
      </BTooltip>
    );
  }

  return null;
};

export const getFormattedPendingWithdrawalSP = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  showMinus = true,
) => {
  const pendingWithdrawalSP = calculatePendingWithdrawalSP(
    user,
    totalVestingShares,
    totalVestingFundSteem,
  );

  if (pendingWithdrawalSP !== 0) {
    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_pending_withdrawal_tooltip"
              defaultMessage="The next power down is scheduled to happen on "
            />
            <FormattedDate value={`${user.next_vesting_withdrawal}Z`} />{' '}
            <FormattedTime value={`${user.next_vesting_withdrawal}Z`} />
          </span>
        }
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
          {showMinus && ' - '}
          <FormattedNumber value={pendingWithdrawalSP} />
        </span>
      </BTooltip>
    );
  }

  return null;
};

const HivePowerBlock = ({
  powerClassList,
  setPowerDownProgress,
  delegatedRc,
  setVisibleRcDetails,
  user,
  loadingGlobalProperties,
  totalVestingShares,
  totalVestingFundSteem,
  isAuth,
  inDelegatedRc,
  authUserPage,
  setShowCancelPowerDown,
  openDetailsModal,
  hasDelegations,
  rcInfo,
}) => {
  const showDelegation = user.delegated_vesting_shares !== '0.000000 VESTS' || hasDelegations;
  const rcBalance = rcInfo?.max_rc ? rcInfo?.max_rc / billion : 0;
  const delegatedOut = rcInfo?.delegated_rc ? rcInfo?.delegated_rc / billion : 0;
  const delegationsBalance =
    rcInfo?.delegated_rc || rcInfo?.received_delegated_rc
      ? (rcInfo?.received_delegated_rc - rcInfo?.delegated_rc) / billion
      : 0;
  const showRcDelegate = rcInfo?.received_delegated_rc !== 0 || rcInfo?.delegated_rc !== 0;
  const nextPowerDownDate = (
    <>
      {' '}
      <FormattedDate value={`${user.next_vesting_withdrawal}Z`} />{' '}
      <FormattedTime value={`${user.next_vesting_withdrawal}Z`} />
    </>
  );
  const power = formatter.vestToSteem(
    user.vesting_shares,
    totalVestingShares,
    totalVestingFundSteem,
  );

  return (
    <div className="UserWalletSummary__itemWrap">
      <div className="UserWalletSummary__item">
        <i className="iconfont icon-flashlight_fill UserWalletSummary__icon" />
        <div className="UserWalletSummary__label">
          <FormattedMessage id="steem_power" defaultMessage="HIVE Power" />
        </div>
        <div className={'UserWalletSummary__value'}>
          {user.fetching || loadingGlobalProperties ? (
            <Loading />
          ) : (
            <span>
              {isNil(user.vesting_shares) ? (
                '-'
              ) : (
                <>
                  <FormattedNumber value={parseFloat(power)} />
                  {' HP'}
                </>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="UserWalletSummary__actions">
        <p className="UserWalletSummary__description">
          <FormattedMessage id="staked_hive_tokens" defaultMessage="Staked HIVE tokens" />
        </p>
        <WalletAction
          mainCurrency={'HP'}
          mainKey={'delegate'}
          options={['power_down', 'delegate_rc']}
        />
      </div>
      {user.to_withdraw !== 0 && (
        <PowerDownBlock
          setShowCancelPowerDown={setShowCancelPowerDown}
          user={user}
          nextPowerDownDate={nextPowerDownDate}
          powerClassList={powerClassList}
          authUserPage={authUserPage}
          isAuth={isAuth}
          setPowerDownProgress={setPowerDownProgress}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          loadingGlobalProperties={loadingGlobalProperties}
        />
      )}
      {showDelegation && (
        <DelegateHiveBlock
          user={user}
          powerClassList={powerClassList}
          openDetailsModal={openDetailsModal}
          getFormattedTotalDelegatedSP={getFormattedTotalDelegatedSP}
          isAuth={isAuth}
          totalVestingFundSteem={totalVestingFundSteem}
          loadingGlobalProperties={loadingGlobalProperties}
          totalVestingShares={totalVestingShares}
        />
      )}
      {
        <RcBlock
          rcInfo={rcInfo}
          rcBalance={rcBalance}
          delegatedOut={delegatedOut}
          delegationsBalance={delegationsBalance}
          user={user}
          powerClassList={powerClassList}
          isAuth={isAuth}
          inDelegatedRc={inDelegatedRc}
          loadingGlobalProperties={loadingGlobalProperties}
          delegatedRc={delegatedRc}
          setVisibleRcDetails={setVisibleRcDetails}
          showRcDelegate={showRcDelegate}
        />
      }
    </div>
  );
};

HivePowerBlock.propTypes = {
  totalVestingShares: PropTypes.string,
  totalVestingFundSteem: PropTypes.string,
  user: PropTypes.shape(),
  rcInfo: PropTypes.shape(),
  delegatedRc: PropTypes.arrayOf(),
  inDelegatedRc: PropTypes.arrayOf(),
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  hasDelegations: PropTypes.bool,
  setPowerDownProgress: PropTypes.func,
  openDetailsModal: PropTypes.func,
  setVisibleRcDetails: PropTypes.func,
  setShowCancelPowerDown: PropTypes.func,
  powerClassList: PropTypes.string,
};

export default HivePowerBlock;
