import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

const HiveBlock = ({
  user,
  isCurrentGuest,
  conversionHiveInfo,
  powerClassList,
  setConversionModal,
  showConversionModal,
  totalHiveConversions,
}) => (
  <div className="UserWalletSummary__itemWrap">
    <div className="UserWalletSummary__item">
      <img
        className="UserWalletSummary__icon hive"
        src="/images/icons/cryptocurrencies/hive.png"
        alt="hive"
      />
      <div className="UserWalletSummary__label">HIVE</div>
      <div className="UserWalletSummary__value">
        {user.fetching ? (
          <Loading />
        ) : (
          <span>
            <FormattedNumber value={user.balance ? parseFloat(user.balance) : 0} />
            {' HIVE'}
          </span>
        )}
      </div>
    </div>
    <div className="UserWalletSummary__actions">
      <p className="UserWalletSummary__description">
        <FormattedMessage id="liquid_hive_tokens" defaultMessage="Liquid HIVE tokens" />
      </p>
      <WalletAction
        mainKey={isCurrentGuest ? 'transfer' : 'power_up'}
        options={
          isCurrentGuest
            ? ['withdraw']
            : ['transfer', 'convert', 'transfer_to_saving', 'collateralized_convert']
        }
        mainCurrency={'HIVE'}
        withdrawCurrencyOption={['LTC', 'BTC', 'ETH']}
        swapCurrencyOptions={isCurrentGuest ? [] : ['SWAP.HIVE']}
      />
    </div>
    {!isEmpty(conversionHiveInfo) && (
      <div className="UserWalletSummary__itemWrap--no-border last-block">
        <div className="UserWalletSummary__item">
          <div className="UserWalletSummary__label power-down">
            <FormattedMessage id="conversions" defaultMessage="Conversions" />
          </div>
          <div
            className={powerClassList}
            onClick={() => setConversionModal({ ...showConversionModal, hive: true, hbd: false })}
          >
            {totalHiveConversions}
            {' HIVE'}
          </div>
        </div>
        <div className="UserWalletSummary__actions">
          <p className="UserWalletSummary__description">Pending requests to HBD</p>
        </div>
      </div>
    )}
  </div>
);

HiveBlock.propTypes = {
  user: PropTypes.shape(),
  isCurrentGuest: PropTypes.bool,
  showConversionModal: PropTypes.bool,
  conversionHiveInfo: PropTypes.arrayOf(),
  powerClassList: PropTypes.string,
  setConversionModal: PropTypes.func,
  totalHiveConversions: PropTypes.number,
};

export default HiveBlock;
