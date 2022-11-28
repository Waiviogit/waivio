import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { get, round, debounce, isNil } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import WAValidator from 'multicoin-address-validator';

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
import { hiveWalletCurrency, showMinWithdraw } from '../../../common/constants/hiveEngine';
import QrModal from '../../widgets/QrModal';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { converHiveEngineCoins, getWithdraws } from '../../../waivioApi/ApiClient';
import { createQuery } from '../../../common/helpers/apiHelpers';
import getWithdrawInfo from '../../../common/helpers/withdrawTokenHelpers';
import { withdrawGuest } from '../../../waivioApi/walletApi';
import { getHiveBeneficiaryAccount } from '../../../store/settingsStore/settingsSelectors';
import LinkHiveAccountModal from '../../settings/LinkHiveAccountModal';

import './WithdrawModal.less';

const withdrawFeePercent = 0.75;
const withdrawFee = withdrawFeePercent / 100;

const WithdrawModal = props => {
  const withdraList = useSelector(getWithdrawList);
  const pair = useSelector(getWithdrawSelectPair);
  const visible = useSelector(getIsOpenWithdraw);
  const isGuest = useSelector(isGuestUser);
  const userName = useSelector(getAuthenticatedUserName);
  const cryptosPriceHistory = useSelector(getCryptosPriceHistory);
  const hiveBeneficiaryAccount = useSelector(getHiveBeneficiaryAccount);

  const hiveRateInUsd = get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', 1);
  const dispatch = useDispatch();
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [isShowScanner, setShowScanner] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [invalidAddress, setInvalidAddress] = useState();
  const [showLinkToHive, setShowLinkToHive] = useState(false);
  const [delay, setDelay] = useState(0);
  const isError = +pair?.balance < fromAmount;

  const handleValidateWalletAddress = useCallback(
    debounce(async value => {
      if (!value) return setInvalidAddress();

      if (pair.from_coin_symbol === 'WAIV' || pair.from_coin_symbol === 'SWAP.ETH') {
        const isValid = WAValidator.validate(value, pair.to_coin_symbol.toLowerCase());

        return setInvalidAddress(!isValid);
      }

      const data = await converHiveEngineCoins({
        destination: value,
        from_coin: pair.from_coin_symbol,
        to_coin: pair.to_coin_symbol,
      });

      if (data.error) return setInvalidAddress(true);

      return setInvalidAddress(false);
    }, 500),
    [converHiveEngineCoins, pair],
  );

  const walletAddressClassList = classNames('WithdrawModal__input', {
    'WithdrawModal__input--invalid': invalidAddress,
  });
  const validateWalletAddressClassList = classNames('WithdrawModal__addressValidate', {
    'WithdrawModal__addressValidate--invalid': invalidAddress,
  });

  const persentCalculate = value => round(value * withdrawFee, 8);

  const handleChange = e => {
    const address = e.currentTarget.value;

    handleValidateWalletAddress(address);
    setWalletAddress(address);
  };

  useEffect(() => {
    dispatch(getDepositWithdrawPairs());

    return () => {
      dispatch(resetSelectPair());
    };
  }, [userName]);

  const openLinkedModal = () => {
    if (pair && isGuest && !hiveBeneficiaryAccount && pair?.to_coin_symbol === 'HIVE')
      setShowLinkToHive(true);
  };

  useEffect(() => {
    getWithdraws().then(res => setDelay(res?.length));
    openLinkedModal();
  }, [pair]);

  const handleCloseModal = () => {
    dispatch(toggleWithdrawModal(false));
  };

  const handleCloseLinkModal = () => {
    setShowLinkToHive(false);
  };

  const setWalletAddressForScanner = address => {
    handleValidateWalletAddress(address);
    setWalletAddress(address);
  };

  const handleFromAmoundChange = async value => {
    setFromAmount(value);
    if (pair.symbol === 'WAIV') {
      const amount = await getWithdrawInfo({
        account: userName,
        data: { quantity: value, inputSymbol: pair.symbol, outputSymbol: pair.to_coin_symbol },
        onlyAmount: true,
      });

      setToAmount(amount > 0 ? amount : 0);
    } else {
      setToAmount(+value - persentCalculate(value));
    }
  };

  const handleWithdraw = async () => {
    if (pair.symbol === 'WAIV') {
      const data = {
        quantity: String(fromAmount),
        inputSymbol: pair.symbol,
        outputSymbol: pair.to_coin_symbol,
        address: pair.to_coin_symbol === 'HIVE' ? hiveBeneficiaryAccount : walletAddress,
      };

      if (isGuest) {
        withdrawGuest({ account: userName, data });
      } else {
        const { customJsonPayload } = await getWithdrawInfo({ account: userName, data });

        if (!customJsonPayload) return null;
        window.open(
          `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${userName}"]&required_posting_auths=[]&${createQuery(
            {
              id: 'ssc-mainnet-hive',
              json: JSON.stringify(customJsonPayload),
            },
          )}`,
          '_blank',
        );
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (pair.to_coin_symbol === 'HIVE') {
        window.open(
          `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${userName}"]&required_posting_auths=[]&${createQuery(
            {
              id: 'ssc-mainnet-hive',
              json: JSON.stringify({
                contractName: 'hivepegged',
                contractAction: 'withdraw',
                contractPayload: {
                  quantity: fromAmount.toString(),
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

          window.open(
            `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${userName}"]&required_posting_auths=[]&${createQuery(
              {
                id: 'ssc-mainnet-hive',
                json: JSON.stringify({
                  contractName: 'tokens',
                  contractAction: 'transfer',
                  contractPayload: {
                    symbol: pair.from_coin_symbol,
                    to: pair.from_coin_symbol === 'SWAP.ETH' ? 'swap-eth' : data.account,
                    quantity: fromAmount.toString(),
                    memo: pair.from_coin_symbol === 'SWAP.ETH' ? walletAddress : data.memo,
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
    }

    return handleCloseModal();
  };

  const handleToAmoundChange = e => {
    const value = e.currentTarget.value;

    if (pair.symbol !== 'WAIV') {
      setToAmount(value);
      setFromAmount(+value + persentCalculate(value));
    }
  };

  // eslint-disable-next-line consistent-return
  const setTokenPair = async selectedPair => {
    dispatch(setWithdrawPair(selectedPair));
    setWalletAddress('');
    if (pair.symbol === 'WAIV') {
      openLinkedModal();
      const amount = await getWithdrawInfo({
        account: userName,
        data: {
          quantity: fromAmount,
          inputSymbol: selectedPair.symbol,
          outputSymbol: selectedPair.to_coin_symbol,
        },
        onlyAmount: true,
      });

      setToAmount(amount > 0 ? amount : 0);
    }
  };

  const handleSetScanAmount = value => {
    setToAmount(value);
    setFromAmount(+value + persentCalculate(value));
  };

  return (
    <React.Fragment>
      <Modal
        wrapClassName="WithdrawModal__wrapper"
        className="WithdrawModal"
        visible={visible}
        onCancel={handleCloseModal}
        title={props.intl.formatMessage({ id: 'Withdraw', defaultMessage: 'Withdraw' })}
        footer={[
          <Button
            key="Withdraw"
            type="primary"
            onClick={handleWithdraw}
            disabled={
              !fromAmount ||
              !toAmount ||
              isError ||
              invalidAddress ||
              (pair?.to_coin_symbol !== 'HIVE' && !walletAddress) ||
              (pair?.to_coin_symbol === 'HIVE' && !(hiveBeneficiaryAccount || userName))
            }
          >
            <FormattedMessage id="Withdraw" defaultMessage="Withdraw" />
          </Button>,
        ]}
      >
        {Boolean(delay) && (
          <div className="WithdrawModal__warning">
            The are {delay} pending withdrawals waiting to be processed. So, your withdrawals might
            be delayed.
          </div>
        )}
        <section>
          <p>
            <FormattedMessage
              id="withdraw_info_part1"
              defaultMessage="All crypto withdrawals are processed by"
            />{' '}
            <a href="https://hive-engine.com/">Hive-Engine.com</a>.
          </p>
          <p>
            <FormattedMessage id="there_is_a" defaultmessage="There is a" /> {withdrawFeePercent}%{' '}
            <FormattedMessage id="fee_on_withdrawals" defaultMessage="fee on withdrawals" />.
          </p>
          <p>
            <FormattedMessage
              id="withdraw_info_part2"
              defaultMessage=" Please note that standard network transfer fees will also be subtracted from the amount."
            />
          </p>
        </section>
        <div className="WithdrawModal__block">
          <h3 className="WithdrawModal__title">
            <FormattedMessage id="Withdraw" defaultMessage="Withdraw" />:
          </h3>
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
          <h3 className="WithdrawModal__title">
            {' '}
            <FormattedMessage id="receive" defaultMessage="Receive" />:
          </h3>
          <div className="WithdrawModal__inputWrap">
            <Input
              type="number"
              value={toAmount}
              disabled={pair?.symbol === 'WAIV'}
              onChange={handleToAmoundChange}
            />
            <span className="WithdrawModal__currency">{get(pair, 'to_coin_symbol')}</span>
          </div>
        </div>
        <p>
          <FormattedMessage id="est_amount" defaultMessage="Est. amount" />:{' '}
          <USDDisplay value={fromAmount * get(pair, 'rate') * hiveRateInUsd} />
        </p>
        {showMinWithdraw.includes(get(pair, 'to_coin_symbol')) && (
          <p>
            <FormattedMessage
              id="minimal_withdraw_amount"
              defaultMessage="Minimal withdraw amount"
            />
            :{' '}
            {pair?.to_coin_symbol === 'BTC' ? (
              <span>0,01 {get(pair, 'to_coin_symbol')}</span>
            ) : (
              <span>
                {withdrawFee} {get(pair, 'from_coin_symbol')}
              </span>
            )}
          </p>
        )}
        <div className="WithdrawModal__block">
          <h3 className="WithdrawModal__title">
            <FormattedMessage id="destination_address" defaultMessage="Destination address" />:
          </h3>
          {/* eslint-disable-next-line no-nested-ternary */}
          {hiveWalletCurrency.includes(get(pair, 'to_coin_symbol')) ? (
            isGuest && !hiveBeneficiaryAccount ? (
              <div>
                Guests are only allowed to make transfers to their own Hive accounts. This account
                should be first linked to the guest account.{' '}
                <span style={{ color: 'orange' }} onClick={() => setShowLinkToHive(true)}>
                  Link account
                </span>
              </div>
            ) : (
              <SelectUserForAutocomplete account={isGuest ? hiveBeneficiaryAccount : userName} />
            )
          ) : (
            <React.Fragment>
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
                  <span>
                    {' '}
                    <FormattedMessage id="qr_scanner" defaultMessage="QR scanner" />
                  </span>
                </Button>
              </div>
              {walletAddress && !isNil(invalidAddress) && (
                <span className={validateWalletAddressClassList}>
                  {invalidAddress ? 'Invalid address' : 'Address is valid'}
                </span>
              )}
            </React.Fragment>
          )}
        </div>
        <p>
          <FormattedMessage
            id="withdraw_info_part3"
            defaultMessage="Click the button below to be redirected to HiveSinger to complete your transaction."
          />
        </p>
        {isShowScanner && (
          <QrModal
            visible={isShowScanner}
            setDataScan={setWalletAddressForScanner}
            handleClose={setShowScanner}
            setScanAmount={handleSetScanAmount}
            setToken={name => {
              const codeToken = withdraList.find(k => k.display_name.toLowerCase().includes(name));

              dispatch(setWithdrawPair(codeToken));
            }}
          />
        )}
      </Modal>
      <LinkHiveAccountModal
        handleClose={handleCloseLinkModal}
        showModal={showLinkToHive}
        hiveBeneficiaryAccount={hiveBeneficiaryAccount}
      />
    </React.Fragment>
  );
};

WithdrawModal.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(WithdrawModal);
