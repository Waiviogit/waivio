import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal } from 'antd';
import classNames from 'classnames';
import { get, upperFirst } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import store from 'store';

import {
  getAuthenticatedUser,
  getCryptosPriceHistory,
  getStatusWithdraw,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  isGuestUser,
} from '../reducers';
import { closeWithdraw } from './walletActions';
import QrModal from '../widgets/QrModal';
import { estimateAmount, validaveCryptoWallet } from '../../waivioApi/ApiClient';
import { matchAllButNumberRegExp } from '../../common/constants/validation';
import EmailConfirmation from '../widgets/EmailConfirmation';
import { CRYPTO_FOR_VALIDATE_WALLET, CRYPTO_LIST_FOR_WALLET } from '../../common/constants/waivio';
import { calculateEstAccountValue } from '../vendor/steemitHelpers';
import { HBD, HIVE } from '../../common/constants/cryptos';
import { getUserPrivateEmail } from '../user/usersActions';

import './Withdraw.less';

const Withdraw = ({
  intl,
  visible,
  user,
  isGuest,
  closeWithdrawModal,
  totalVestingShares,
  totalVestingFundSteem,
  cryptosPriceHistory,
  getPrivateEmail,
}) => {
  const [isShowScanner, setShowScanner] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('');
  const [hiveAmount, setHiveAmount] = useState();
  const [currencyAmount, setCurrencyAmount] = useState();
  const [isShowConfirm, setShowConfirm] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [validationAddressState, setIsValidate] = useState({ loading: false, valid: false });
  const draftTransfer = store.get('withdrawData');
  const steemRate = get(cryptosPriceHistory, `${HIVE.coinGeckoId}.usdPriceHistory.usd`, null);
  const sbdRate = get(cryptosPriceHistory, `${HBD.coinGeckoId}.usdPriceHistory.usd`, null);
  const userEstAcc = isGuest
    ? user.balance * steemRate
    : calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, steemRate, sbdRate);
  const currentBalance = isGuest ? `${user.balance} HIVE` : user.balance;
  const isUserCanMakeTransfer =
    Number(currentBalance && currentBalance.replace(' HIVE', '')) >= Number(hiveAmount);

  const walletAddressValidation = (address, crypto) => {
    setIsValidate({ valid: false, loading: true });

    if (currentCurrency) {
      setTimeout(
        () =>
          validaveCryptoWallet(address, crypto).then(res => {
            if (res.isValid) {
              setIsValidate({ valid: true, loading: false });
            } else {
              setIsValidate({ valid: false, loading: false });
            }
          }),
        1000,
      );
    }
  };

  useEffect(() => {
    if (draftTransfer) {
      setHiveAmount(draftTransfer.hiveAmount);
      setCurrentCurrency(draftTransfer.currentCurrency);
      setWalletAddress(draftTransfer.walletAddress);
      walletAddressValidation(
        draftTransfer.walletAddress,
        CRYPTO_FOR_VALIDATE_WALLET[draftTransfer.currentCurrency],
      );
    }
  }, []);

  useEffect(() => {
    if (currentCurrency) {
      if (hiveAmount && !currencyAmount) {
        estimateAmount(hiveAmount, 'hive', currentCurrency).then(r =>
          setCurrencyAmount(r.outputAmount),
        );
      }

      if (currencyAmount) {
        estimateAmount(currencyAmount, currentCurrency, 'hive').then(r =>
          setHiveAmount(r.outputAmount),
        );
      }

      if (walletAddress) {
        walletAddressValidation(walletAddress, CRYPTO_FOR_VALIDATE_WALLET[currentCurrency]);
      }
    }
  }, [currentCurrency]);

  const handleCurrencyCountChange = (e, inputSetter, outputSetter, input, output) => {
    const validateValue = e.currentTarget.value.replace(matchAllButNumberRegExp, '');

    inputSetter(validateValue);

    if (!isNaN(e.currentTarget.value))
      estimateAmount(validateValue, input, output).then(r => outputSetter(r.outputAmount));
  };

  const switchButtonClassList = currency =>
    classNames('Withdraw__switcher-button', 'Withdraw__switcher-button--border-radius', {
      'Withdraw__switcher-button--active-radius': currency === currentCurrency,
    });
  const validatorClassList = classNames({
    invalid: !validationAddressState.valid,
    valid: validationAddressState.valid,
  });
  const handleChange = e => {
    const address = e.currentTarget.value;

    setWalletAddress(address);
    walletAddressValidation(address, CRYPTO_FOR_VALIDATE_WALLET[currentCurrency]);
  };
  const handleRequest = () => {
    setIsLoading(true);
    store.set('withdrawData', {
      hiveAmount,
      walletAddress,
      currentCurrency,
    });
    getPrivateEmail(user.name).then(() => {
      setShowConfirm(true);
      setIsLoading(false);
    });
  };
  const validatorMessage = validationAddressState.valid
    ? intl.formatMessage({ id: 'address_valid', defaultMessage: 'Address is valid' })
    : intl.formatMessage({ id: 'address_not_valid', defaultMessage: 'Address is invalid' });
  const disabled = !(
    walletAddress &&
    currentCurrency &&
    hiveAmount &&
    currencyAmount &&
    validationAddressState.valid &&
    isUserCanMakeTransfer
  );

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        className="Withdraw__modal"
        title={intl.formatMessage({
          id: 'withdraw_modal_title',
          defaultMessage: 'Blocktrades.us exchange',
        })}
        okText={intl.formatMessage({ id: 'withdraw_continue', defaultMessage: 'Request withdraw' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={handleRequest}
        onCancel={closeWithdrawModal}
        okButtonProps={{
          disabled,
          loading: isLoading,
        }}
      >
        <Form className="Withdraw" hideRequiredMark>
          <Form.Item
            className="Withdraw__title"
            label={<FormattedMessage id="send" defaultMessage="Send" />}
          />
          <div className="Withdraw__input-wrapper">
            <input
              placeholder={0}
              value={hiveAmount}
              onChange={e =>
                handleCurrencyCountChange(
                  e,
                  setHiveAmount,
                  setCurrencyAmount,
                  'hive',
                  currentCurrency,
                )
              }
              type="text"
              className="Withdraw__input-text"
            />
            <div className="Withdraw__switcher-wrapper">
              <span className="Withdraw__switcher-button Withdraw__switcher-button--active">
                HIVE
              </span>
            </div>
          </div>
          <div className="Withdraw__subtitle">
            <FormattedMessage
              id="balance_amount"
              defaultMessage="Your balance: {amount}"
              values={{
                amount: <span className="balance">{currentBalance}</span>,
              }}
            />
          </div>
          <Form.Item
            className="Withdraw__title"
            label={<FormattedMessage id="receive" defaultMessage="Receive" />}
          />
          <div className="Withdraw__input-wrapper">
            <input
              type="text"
              onChange={e =>
                handleCurrencyCountChange(
                  e,
                  setCurrencyAmount,
                  setHiveAmount,
                  currentCurrency,
                  'hive',
                )
              }
              value={currencyAmount}
              placeholder={0}
              className="Withdraw__input-text"
            />
            <div className="Withdraw__switcher-wrapper">
              {CRYPTO_LIST_FOR_WALLET.map(crypto => (
                <span
                  key={crypto}
                  className={switchButtonClassList(crypto)}
                  role="presentation"
                  onClick={() => setCurrentCurrency(crypto)}
                >
                  {upperFirst(CRYPTO_FOR_VALIDATE_WALLET[crypto])}
                </span>
              ))}
            </div>
          </div>
          <div className="Withdraw__subtitle">
            {intl.formatMessage(
              {
                id: 'est_account_value_withdraw',
                defaultMessage: 'Est. amount: {amount} USD (limit: 100 per day)',
              },
              { amount: isNaN(userEstAcc) ? 0 : userEstAcc },
            )}
          </div>
          <Form.Item
            className="Withdraw__title"
            label={<FormattedMessage id="receive" defaultMessage="Receive" />}
          />
          <div className="Withdraw__address-wrapper">
            <input
              className="Withdraw__input"
              value={walletAddress}
              onChange={handleChange}
              placeholder={intl.formatMessage({
                id: 'enter_address',
                defaultMessage: 'Enter address',
              })}
            />
            <button className="Withdraw__qr-button" onClick={() => setShowScanner(true)}>
              <img src={'/images/icons/qr.png'} className="qr-img" alt="qr" />
              <span>QR scanner</span>
            </button>
          </div>
          {walletAddress && !validationAddressState.loading && (
            <p className={validatorClassList}>{validatorMessage}</p>
          )}
          {walletAddress && currentCurrency && validationAddressState.loading && (
            <p>
              {intl.formatMessage({
                id: 'check_address',
                defaultMessage: 'Please wait, we validation your address',
              })}
            </p>
          )}
        </Form>
      </Modal>
      {isShowScanner && (
        <QrModal
          visible={isShowScanner}
          setDataScan={setWalletAddress}
          handleClose={setShowScanner}
        />
      )}
      <EmailConfirmation visible={isShowConfirm} handleClose={setShowConfirm} />
    </React.Fragment>
  );
};

Withdraw.propTypes = {
  intl: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  cryptosPriceHistory: PropTypes.shape().isRequired,
  getPrivateEmail: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: getAuthenticatedUser(state),
    isGuest: isGuestUser(state),
    visible: getStatusWithdraw(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    closeWithdrawModal: closeWithdraw,
    getPrivateEmail: getUserPrivateEmail,
  },
)(injectIntl(Withdraw));
