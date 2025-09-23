import { isNil } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Loading from '../../components/Icon/Loading';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

const DelegateHiveBlock = ({
  powerClassList,
  openDetailsModal,
  user,
  loadingGlobalProperties,
  getFormattedTotalDelegatedSP,
  totalVestingShares,
  isAuth,
  totalVestingFundSteem,
}) => {
  const formattedTotalDelegatedSP = getFormattedTotalDelegatedSP(
    user,
    totalVestingShares,
    totalVestingFundSteem,
    false,
  );

  return (
    <div className="UserWalletSummary__itemWrap--no-border last-block">
      <div className="UserWalletSummary__item">
        <div className="UserWalletSummary__label power-down">
          <FormattedMessage id="hive_delegations" defaultMessage="HIVE Delegations" />
        </div>
        <div className={powerClassList} onClick={openDetailsModal}>
          {user.fetching || loadingGlobalProperties ? (
            <Loading />
          ) : (
            <span>
              {isNil(user.received_vesting_shares) || isNil(user.delegated_vesting_shares) ? (
                '-'
              ) : (
                <>
                  {formattedTotalDelegatedSP}
                  {' HP'}
                </>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="UserWalletSummary__actions">
        <p className="UserWalletSummary__description">Delegations to/from other users</p>
        {isAuth && <WalletAction mainKey={'manage'} options={['delegate']} mainCurrency={'HP'} />}
      </div>
    </div>
  );
};

DelegateHiveBlock.propTypes = {
  totalVestingShares: PropTypes.string,
  totalVestingFundSteem: PropTypes.string,
  user: PropTypes.shape(),
  isAuth: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  openDetailsModal: PropTypes.func,
  getFormattedTotalDelegatedSP: PropTypes.func,
  powerClassList: PropTypes.string,
};

export default DelegateHiveBlock;
