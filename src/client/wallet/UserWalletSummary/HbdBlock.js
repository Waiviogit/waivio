import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import Loading from '../../components/Icon/Loading';

const HbdBlock = ({
  user,
  conversionHbdInfo,
  powerClassList,
  showConversionModal,
  setConversionModal,
}) => {
  const totalHbdConversions = !isEmpty(conversionHbdInfo)
    ? conversionHbdInfo?.reduce((acc, val) => {
        const amount = parseFloat(val.amount);

        return acc + amount;
      }, 0)
    : 0;

  return (
    <div className="UserWalletSummary__itemWrap">
      <div className="UserWalletSummary__item">
        <img
          className="UserWalletSummary__icon hive"
          src="/images/icons/cryptocurrencies/hbd-icon.svg"
          alt="hive"
        />
        <div className="UserWalletSummary__label">HBD (Hive Backed Dollar)</div>
        <div className="UserWalletSummary__value">
          {user.fetching ? (
            <Loading />
          ) : (
            <span>
              <FormattedNumber value={parseFloat(user.hbd_balance)} />
              {' HBD'}
            </span>
          )}
        </div>
      </div>
      <div className="UserWalletSummary__actions">
        <p className="UserWalletSummary__description">
          <FormattedMessage
            id="a_stable_coin_pegged_to_usd"
            defaultMessage="A stable coin pegged to USD"
          />
        </p>
        <WalletAction
          mainKey={'transfer'}
          options={['convert', 'transfer_to_saving', 'collateralized_convert']}
          swapCurrencyOptions={['SWAP.HBD']}
          mainCurrency={'HBD'}
        />
      </div>
      {!isEmpty(conversionHbdInfo) && (
        <div className="UserWalletSummary__itemWrap--no-border last-block">
          <div className="UserWalletSummary__item">
            <div className="UserWalletSummary__label power-down">
              <FormattedMessage id="conversions" defaultMessage="Conversions" />
            </div>
            <div
              className={powerClassList}
              onClick={() => setConversionModal({ ...showConversionModal, hbd: true, hive: false })}
            >
              {totalHbdConversions}
              {' HBD'}
            </div>
          </div>
          <div className="UserWalletSummary__actions">
            <p className="UserWalletSummary__description">Pending requests to HIVE</p>
          </div>
        </div>
      )}
    </div>
  );
};

HbdBlock.propTypes = {
  user: PropTypes.shape(),
  conversionHbdInfo: PropTypes.arrayOf(),
  showConversionModal: PropTypes.bool,
  setConversionModal: PropTypes.func,
  powerClassList: PropTypes.string,
};

export default HbdBlock;
