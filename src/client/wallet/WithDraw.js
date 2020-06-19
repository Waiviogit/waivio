import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Modal } from 'antd';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getAuthenticatedUser, getStatusWithdraw, isGuestUser } from '../reducers';
import { closeWithdraw } from './walletActions';
import QrModal from '../widgets/QrModal';
import { estimateAmount } from '../../waivioApi/ApiClient';
import { onlyNumberRegExp } from '../../common/constants/validation';
import EmailConfirmation from '../widgets/EmailConfirmation';

import './Withdraw.less';

const Withdraw = ({ intl, visible, user, isGuest, closeWithdrawModal }) => {
  const [isShowScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('');
  const [hiveAmount, setHiveAmount] = useState();
  const [currencyAmount, setCurrencyAmount] = useState();
  const [isShowConfirm, setShowConfirm] = useState();

  useEffect(() => {
    if (currentCurrency && hiveAmount && !currencyAmount) {
      estimateAmount(hiveAmount, 'hive', currentCurrency).then(r =>
        setCurrencyAmount(r.outputAmount),
      );
    }

    if (currentCurrency && currencyAmount) {
      estimateAmount(currencyAmount, currentCurrency, 'hive').then(r =>
        setHiveAmount(r.outputAmount),
      );
    }
  }, [currentCurrency]);

  const handleHiveCount = e => {
    const validateValue = e.currentTarget.value.replace(onlyNumberRegExp, '');
    setHiveAmount(validateValue);

    if (currentCurrency)
      estimateAmount(validateValue, 'hive', currentCurrency).then(r => {
        setCurrencyAmount(r.outputAmount);
      });
  };
  const handleCurrencyCount = e => {
    const validateValue = e.currentTarget.value.replace(onlyNumberRegExp, '');

    setCurrencyAmount(validateValue);

    if (currentCurrency)
      estimateAmount(validateValue, currentCurrency, 'hive').then(r => {
        setHiveAmount(r.outputAmount);
      });
  };
  const currentBalance = isGuest ? `${user.balance} HIVE` : user.balance;
  const switchButtonClassList = currency =>
    classNames('Withdraw__switcher-button', 'Withdraw__switcher-button--border-radius', {
      'Withdraw__switcher-button--active-radius': currency === currentCurrency,
    });
  const handleChange = e => setScanResult(e.currentTarget.value);
  const handleRequest = () => {
    localStorage.setItem(
      'withdrawData',
      JSON.stringify({
        hiveAmount,
        scanResult,
        currentCurrency,
      }),
    );
    setShowConfirm(true);
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        title={intl.formatMessage({
          id: 'withdraw_modal_title',
          defaultMessage: 'Blocktrades.us exchange',
        })}
        okText={intl.formatMessage({ id: 'withdraw_continue', defaultMessage: 'Request withdraw' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={handleRequest}
        onCancel={closeWithdrawModal}
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
              onChange={handleHiveCount}
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
            {intl.formatMessage({
              id: 'balance_amount',
              defaultMessage: 'Your balance: ',
            })}
            <span role="presentation" className="balance">
              {currentBalance}.
            </span>
          </div>
          <Form.Item
            className="Withdraw__title"
            label={<FormattedMessage id="receive" defaultMessage="Receive" />}
          />
          <div className="Withdraw__input-wrapper">
            <input
              type="text"
              onChange={handleCurrencyCount}
              value={currencyAmount}
              placeholder={0}
              className="Withdraw__input-text"
            />
            <div className="Withdraw__switcher-wrapper">
              <span
                className={switchButtonClassList('btc')}
                role="presentation"
                onClick={() => setCurrentCurrency('btc')}
              >
                Bitcoin
              </span>
              <span
                className={switchButtonClassList('ltc')}
                role="presentation"
                onClick={() => setCurrentCurrency('ltc')}
              >
                Litecoin
              </span>
              <span
                className={switchButtonClassList('eth')}
                role="presentation"
                onClick={() => setCurrentCurrency('eth')}
              >
                Ethereum
              </span>
            </div>
          </div>
          <div className="Withdraw__subtitle">
            {intl.formatMessage({
              id: 'balance_amount',
              defaultMessage: 'Est. amount: 1.00 USD (limit: 100 per day)',
            })}
          </div>
          <Form.Item
            className="Withdraw__title"
            label={<FormattedMessage id="receive" defaultMessage="Receive" />}
          />
          <div className="Withdraw__address-wrapper">
            <input
              className="Withdraw__input"
              value={scanResult}
              onChange={handleChange}
              placeholder="Enter address"
            />
            <button className="Withdraw__qr-button" onClick={() => setShowScanner(true)}>
              <img src={'/images/icons/qr.png'} className="qr-img" alt="qr" />
              QR scanner
            </button>
          </div>
        </Form>
      </Modal>
      {isShowScanner && (
        <QrModal visible={isShowScanner} setDataScan={setScanResult} handleClose={setShowScanner} />
      )}
      <EmailConfirmation visible={isShowConfirm} handleClose={setShowConfirm} email="" />
    </React.Fragment>
  );
};

Withdraw.propTypes = {
  intl: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  closeWithdrawModal: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: getAuthenticatedUser(state),
    isGuest: isGuestUser(state),
    visible: getStatusWithdraw(state),
  }),
  {
    closeWithdrawModal: closeWithdraw,
  },
)(Form.create()(injectIntl(Withdraw)));
