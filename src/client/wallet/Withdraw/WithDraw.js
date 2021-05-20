import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal, message } from 'antd';
import classNames from 'classnames';
import { ceil, get, upperFirst, debounce } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import store from 'store';

import { closeWithdraw } from '../../store/walletStore/walletActions';
import QrModal from '../../widgets/QrModal';
import {
  confirmWithDraw,
  estimateAmount,
  validaveCryptoWallet,
} from '../../../waivioApi/ApiClient';
import EmailConfirmation from '../../widgets/EmailConfirmation';
import {
  CRYPTO_FOR_VALIDATE_WALLET,
  CRYPTO_LIST_FOR_WALLET,
} from '../../../common/constants/waivio';
import { HIVE } from '../../../common/constants/cryptos';
import { getUserPrivateEmail } from '../../store/usersStore/usersActions';
import { getCryptosPriceHistory } from '../../store/appStore/appSelectors';
import { getAuthenticatedUser } from '../../store/authStore/authSelectors';
import { getStatusWithdraw } from '../../store/walletStore/walletSelectors';

import './Withdraw.less';

const Withdraw = ({
  intl,
  visible,
  user,
  closeWithdrawModal,
  cryptosPriceHistory,
  getPrivateEmail,
}) => {
  const [isShowScanner, setShowScanner] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('eth');
  const [isShowConfirm, setShowConfirm] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hiveCount, setHiveCount] = useState(false);
  const [validationAddressState, setIsValidate] = useState({ loading: false, valid: false });
  const [hiveAmount, setHiveAmount] = useState('');
  const [currencyAmount, setCurrencyAmount] = useState('');
  const hiveInput = useRef();
  const currencyInput = useRef();
  // const hiveAmount = get(hiveInput, ['current', 'value'], 0);
  // const currencyAmount = get(currencyInput, ['current', 'value'], 0);
  const draftTransfer = store.get('withdrawData');
  const hivePrice = get(cryptosPriceHistory, `${HIVE.coinGeckoId}.usdPriceHistory.usd`, 0);
  const currentBalance = `${user.balance} HIVE`;
  const hiveAmountClassList = classNames('Withdraw__input-text Withdraw__input-text--send-input', {
    'Withdraw__input-text--error': hiveAmount > user.balance,
  });
  const isUserCanMakeTransfer =
    Number(currentBalance && currentBalance.replace(' HIVE', '')) >= Number(hiveCount);
  // const setHiveAmount = value => {
  //   hiveInput.current.value = value;
  // };
  // const setCurrencyAmount = value => {
  //   currencyInput.current.value = value;
  // };
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
      setCurrentCurrency(draftTransfer.currentCurrency);
      setWalletAddress(draftTransfer.walletAddress);
      walletAddressValidation(
        draftTransfer.walletAddress,
        CRYPTO_FOR_VALIDATE_WALLET[draftTransfer.currentCurrency],
      );
    }
  }, []);

  useEffect(() => {
    if (hiveAmount) {
      estimateAmount(hiveAmount, 'hive', currentCurrency).then(r =>
        setCurrencyAmount(r.outputAmount),
      );
    }

    if (walletAddress) {
      walletAddressValidation(walletAddress, CRYPTO_FOR_VALIDATE_WALLET[currentCurrency]);
    }
  }, [currentCurrency]);

  const handleCurrencyCountChange = (validateValue, outputSetter, input, output) => {
    if (input === 'hive') setHiveCount(validateValue);

    if (!isNaN(validateValue) && Number(validateValue)) {
      estimateAmount(validateValue, input, output)
        .then(r => {
          outputSetter(r.outputAmount);
          if (output === 'hive') setHiveCount(r.outputAmount);
        })
        .catch(e => message.error(e.message));
    } else if (output !== 'hive') outputSetter(0);
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

  const setWalletAddressForScanner = address => {
    setWalletAddress(address);
    walletAddressValidation(address, CRYPTO_FOR_VALIDATE_WALLET[currentCurrency]);
  };

  const handleRequest = () => {
    setIsLoading(true);
    store.set('withdrawData', {
      walletAddress,
      currentCurrency,
      hiveAmount: hiveCount,
    });
    getPrivateEmail(user.name).then(() => {
      setShowConfirm(true);
      setIsLoading(false);
    });
  };

  const handleClickCurrentAmount = () => {
    const currentBal = parseFloat(currentBalance);

    setHiveAmount(currentBal);
    setHiveCount(currentBal);

    if (currentBal) {
      estimateAmount(currentBal, 'hive', currentCurrency).then(r =>
        setCurrencyAmount(r.outputAmount),
      );
    } else {
      setCurrencyAmount(0);
    }
  };

  const debounceAmountCurrency = debounce(
    value => handleCurrencyCountChange(value, setHiveAmount, currentCurrency, 'hive'),
    800,
  );

  const debounceAmountHive = debounce(
    value => handleCurrencyCountChange(value, setCurrencyAmount, 'hive', currentCurrency),
    800,
  );

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

  const handleSubmitTransaction = () =>
    confirmWithDraw(user.name, {
      outputCoinType: currentCurrency,
      inputCoinType: 'hive',
      address: walletAddress,
      amount: hiveAmount,
    })
      .then(r => {
        if (r.result) {
          closeWithdrawModal();
          message.success(
            intl.formatMessage({
              id: 'transaction_success',
              defaultMessage: 'Your transaction success',
            }),
          );
        }

        if (r.message) message.error(r.message);

        return r;
      })
      .catch(e => {
        message.error(e.message);

        return e;
      });

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
              ref={hiveInput}
              onChange={e => {
                setHiveAmount(e.currentTarget.value);
                debounceAmountHive(e.currentTarget.value);
              }}
              type="number"
              className={hiveAmountClassList}
              step="any"
              value={hiveAmount}
            />
            <span className="Withdraw__switcher-button Withdraw__switcher-button--active">
              HIVE
            </span>
          </div>
          {user.balance < hiveAmount && (
            <p className="invalid">
              {intl.formatMessage({
                id: 'amount_error_funds',
                defaultMessage: 'Insufficient funds.',
              })}
            </p>
          )}
          <div className="Withdraw__subtitle">
            <FormattedMessage
              id="balance_amount"
              defaultMessage="Your balance: {amount}"
              values={{
                amount: (
                  <span className="balance" role="presentation" onClick={handleClickCurrentAmount}>
                    {currentBalance || 0}
                  </span>
                ),
              }}
            />
          </div>
          <Form.Item
            className="Withdraw__title"
            label={<FormattedMessage id="receive" defaultMessage="Receive" />}
          />
          <div className="Withdraw__input-wrapper">
            <input
              type="number"
              ref={currencyInput}
              onChange={e => {
                setCurrencyAmount(e.currentTarget.value);
                debounceAmountCurrency(e.currentTarget.value);
              }}
              placeholder={0}
              className="Withdraw__input-text"
              step="any"
              value={currencyAmount}
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
              { amount: ceil(hiveCount * hivePrice, 3) || '0,00' },
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
          setDataScan={setWalletAddressForScanner}
          handleClose={setShowScanner}
        />
      )}
      <EmailConfirmation
        visible={isShowConfirm}
        handleClose={setShowConfirm}
        handleSubmit={handleSubmitTransaction}
      />
    </React.Fragment>
  );
};

Withdraw.propTypes = {
  intl: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
  cryptosPriceHistory: PropTypes.shape().isRequired,
  getPrivateEmail: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    user: getAuthenticatedUser(state),
    visible: getStatusWithdraw(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    closeWithdrawModal: closeWithdraw,
    getPrivateEmail: getUserPrivateEmail,
  },
)(injectIntl(Withdraw));
