import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, get, round } from 'lodash';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import TokensSelect from '../SwapTokens/components/TokensSelect';
import {
  getIsOpenWithdraw,
  getWithdrawList,
  getWithdrawSelectPair,
} from '../../../store/depositeWithdrawStore/depositWithdrawSelector';
import {
  getDepositWithdrawPairs,
  resetSelectPair,
  setWithdrawPair,
  toggleWithdrawModal,
} from '../../../store/depositeWithdrawStore/depositeWithdrawAction';
import USDDisplay from '../../components/Utils/USDDisplay';
import { getCryptosPriceHistory } from '../../../store/appStore/appSelectors';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';
import { hiveWalletCurrency } from '../../../common/constants/hiveEngine';
import QrModal from '../../widgets/QrModal';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { converHiveEngineCoins } from '../../../waivioApi/ApiClient';
import { createQuery } from '../../../common/helpers/apiHelpers';

import './WithdrawModal.less';

const withdrawFeePercent = 0.75;
const withdrawFee = withdrawFeePercent / 100;

const WithdrawModal = props => {
  const withdraList = useSelector(getWithdrawList);
  const pair = useSelector(getWithdrawSelectPair);
  const visible = useSelector(getIsOpenWithdraw);
  const userName = useSelector(getAuthenticatedUserName);

  const cryptosPriceHistory = useSelector(getCryptosPriceHistory);
  const hiveRateInUsd = get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', 1);
  const dispatch = useDispatch();
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [isShowScanner, setShowScanner] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [invalidAddress, setInvalidAddress] = useState(false);
  const isError = get(pair, 'balance') < fromAmount;

  const walletAddressClassList = classNames('WithdrawModal__input', {
    'WithdrawModal__input--invalid': invalidAddress,
  });

  const persentCalculate = value => value * withdrawFee;

  const handleChange = e => {
    const address = e.currentTarget.value;

    if (invalidAddress) setInvalidAddress(false);

    setWalletAddress(address);
  };

  useEffect(() => {
    if (isEmpty(withdraList)) dispatch(getDepositWithdrawPairs());
    else dispatch(setWithdrawPair(withdraList[0]));

    return () => {
      dispatch(resetSelectPair());
    };
  }, []);

  const handleCloseModal = () => {
    dispatch(toggleWithdrawModal(false));
  };

  const setWalletAddressForScanner = address => {
    if (invalidAddress) setInvalidAddress(false);
    setWalletAddress(address);
  };

  const handleFromAmoundChange = value => {
    setFromAmount(value);
    setToAmount(+value - persentCalculate(value));
  };

  const handleWithdraw = async () => {
    if (pair.to_coin_symbol === 'HIVE') {
      window.open(
        `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${userName}"]&required_posting_auths=[]&${createQuery(
          {
            id: 'ssc-mainnet-hive',
            json: JSON.stringify({
              contractName: 'hivepegged',
              contractAction: 'withdraw',
              contractPayload: {
                quantity: round(fromAmount, 3).toString(),
              },
            }),
          },
        )}`,
        '_blank',
      );
    } else {
      try {
        const data = await converHiveEngineCoins({
          destination: walletAddress || userName,
          from_coin: pair.from_coin_symbol,
          to_coin: pair.to_coin_symbol,
        });

        if (data.message) {
          setInvalidAddress(true);

          return message.error(data.message);
        }

        window.open(
          `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${userName}"]&required_posting_auths=[]&${createQuery(
            {
              id: 'ssc-mainnet-hive',
              json: JSON.stringify({
                contractName: 'tokens',
                contractAction: 'transfer',
                contractPayload: {
                  symbol: pair.from_coin_symbol,
                  to: data.account,
                  quantity: round(fromAmount, 3).toString(),
                  memo: data.memo,
                },
              }),
            },
          )}`,
          '_blank',
        );
      } catch (e) {
        return message.error('Something went wrong!');
      }
    }

    return handleCloseModal();
  };

  const setTokenPair = async selectedPair => dispatch(setWithdrawPair(selectedPair));

  const handleToAmoundChange = e => {
    const value = e.currentTarget.value;

    setToAmount(value);
    setFromAmount(+value + persentCalculate(value));
  };

  return (
    <Modal
      className="WithdrawModal"
      visible={visible}
      onCancel={handleCloseModal}
      title={'Withdraw'}
      footer={[
        <Button
          key={'Withdraw'}
          type="primary"
          onClick={handleWithdraw}
          disabled={!fromAmount || isError}
        >
          Withdraw
        </Button>,
      ]}
    >
      <section>
        <p>
          All crypto withdrawals are processed by{' '}
          <a href="https://hive-engine.com/">Hive-Engine.com</a>.
        </p>
        <p>There is a {withdrawFeePercent}% fee on withdrawals.</p>
        <p>
          Please note that standard network transfer fees will also be subtracted from the amount.
        </p>
      </section>
      <div className="WithdrawModal__block">
        <h3 className="WithdrawModal__title">Withdraw:</h3>
        <TokensSelect
          list={withdraList}
          setToken={setTokenPair}
          amount={fromAmount}
          handleChangeValue={handleFromAmoundChange}
          token={pair}
          handleClickBalance={handleFromAmoundChange}
          isError={isError}
        />
      </div>
      <div className="WithdrawModal__block">
        <h3 className="WithdrawModal__title">Receive:</h3>
        <div className="WithdrawModal__inputWrap">
          <Input type="number" value={toAmount} onChange={handleToAmoundChange} />
          <span className="WithdrawModal__currency">{get(pair, 'to_coin_symbol')}</span>
        </div>
      </div>
      <p>
        Est. transaction value:{' '}
        <USDDisplay value={fromAmount * get(pair, 'rate') * hiveRateInUsd} />
      </p>
      {!hiveWalletCurrency.includes(get(pair, 'to_coin_symbol')) && (
        <p>
          Minimal withdraw amount: {withdrawFee} {get(pair, 'from_coin_symbol')}
        </p>
      )}
      <div className="WithdrawModal__block">
        <h3 className="WithdrawModal__title">Destination address:</h3>
        {hiveWalletCurrency.includes(get(pair, 'to_coin_symbol')) ? (
          <SelectUserForAutocomplete account={userName} />
        ) : (
          <div className="WithdrawModal__address-wrapper">
            <Input
              className={walletAddressClassList}
              value={walletAddress}
              onChange={handleChange}
              placeholder={props.intl.formatMessage({
                id: 'enter_address',
                defaultMessage: 'Enter address',
              })}
            />
            <Button className="WithdrawModal__qr-button" onClick={() => setShowScanner(true)}>
              <img src={'/images/icons/qr.png'} className="qr-img" alt="qr" />
              <span>QR scanner</span>
            </Button>
          </div>
        )}
      </div>
      <p>Click the button below to be redirected to HiveSinger to complete your transaction.</p>
      {isShowScanner && (
        <QrModal
          visible={isShowScanner}
          setDataScan={setWalletAddressForScanner}
          handleClose={setShowScanner}
        />
      )}
    </Modal>
  );
};

WithdrawModal.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(WithdrawModal);
