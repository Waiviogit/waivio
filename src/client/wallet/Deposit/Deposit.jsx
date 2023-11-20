import React, { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getDepositVisible } from '../../../store/walletStore/walletSelectors';
import { openTransfer, toggleDepositModal } from '../../../store/walletStore/walletActions';
import {
  getDepositWithdrawPairs,
  setTokenPair,
  resetSelectPair,
  setDepositeInfo,
} from '../../../store/depositeWithdrawStore/depositeWithdrawAction';
import {
  getDepositeSymbol,
  getDepositList,
  getSelectPair,
} from '../../../store/depositeWithdrawStore/depositWithdrawSelector';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import DepositInfo from './components/DepositInfo';

import './Deposit.less';

const Deposit = props => {
  const visible = useSelector(getDepositVisible);
  const list = useSelector(getDepositList);
  const authUserName = useSelector(getAuthenticatedUserName);
  const selectPair = useSelector(getSelectPair);
  const defaultSymbol = useSelector(getDepositeSymbol);
  const dispatch = useDispatch();
  const hiveTokens = ['HIVE', 'HBD'];
  const [selectSymbol, setSelectSymbol] = useState(null);

  useEffect(() => {
    if (isEmpty(list)) dispatch(getDepositWithdrawPairs());

    return () => {
      dispatch(resetSelectPair());
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(list) && defaultSymbol) {
      const defaulPair = list.find(token => token.from_coin_symbol === defaultSymbol);

      setSelectSymbol(defaultSymbol);
      dispatch(setTokenPair(defaulPair, authUserName));
    }
  }, [defaultSymbol, list]);

  const handleCloseModal = () => dispatch(toggleDepositModal());

  const handleDoneDeposit = () => {
    dispatch(toggleDepositModal());
    dispatch(setDepositeInfo(authUserName, selectPair));

    if (hiveTokens.includes(selectPair.from_coin_symbol)) {
      dispatch(openTransfer(selectPair.account, 0, selectPair.from_coin_symbol, selectPair.memo));
    }
  };

  const handleSelectPair = pair => {
    setSelectSymbol(pair.from_coin_symbol);
    dispatch(setTokenPair(pair, authUserName));
  };

  const okText =
    selectPair && hiveTokens.includes(selectPair.from_coin_symbol) ? (
      <FormattedMessage id="continue" defaultMessage="Continue" />
    ) : (
      <FormattedMessage id="done" defaultMessage="Done" />
    );

  return (
    <Modal
      visible={visible}
      okText={okText}
      title={props.intl.formatMessage({ id: 'Deposit', defaultMessage: 'Deposit' })}
      onCancel={handleCloseModal}
      onOk={handleDoneDeposit}
      className="Deposit"
      okButtonProps={{ disabled: !selectPair }}
      wrapClassName="Deposit__wrapper"
    >
      <div className="Deposit__step">
        <p>
          <FormattedMessage
            id="all_crypto_deposits_are_processed_by"
            defaultMessage="All crypto deposits are processed by"
          />{' '}
          <a href="https://hive-engine.com/" className="Deposit__engine-link">
            Hive-Engine.com
          </a>
          .{' '}
          <FormattedMessage
            id="deposit_info"
            defaultMessage="Once the deposit is made, you will receive an equal amount of the SWAP version of the
          deposited token, which can be exchanged for other tokens on the Hive-Engine blockchain."
          />
        </p>
        <p>
          {' '}
          <FormattedMessage
            id="fee_on_deposits"
            defaultMessage="There is a 0.75% fee on deposits (minimum fee 0.001 for HIVE)."
          />{' '}
        </p>
        <p>
          <FormattedMessage
            id="pay_standard_network_fees"
            defaultMessage="Please note that you will also have to pay standard network fees when sending cryptos."
          />
        </p>
      </div>
      <div className="Deposit__step">
        <h4 className="Deposit__title">
          {' '}
          <FormattedMessage id="step" defaultMessage="Step" /> 1:
        </h4>
        <h4>
          {' '}
          <FormattedMessage
            id="select_the_crypto_token_to_deposit"
            defaultMessage="Select the crypto token to deposit"
          />
          :
        </h4>
        <Select
          placeholder={props.intl.formatMessage({
            id: 'select_the_crypto_token',
            defaultMessage: 'Select the crypto token',
          })}
          {...(selectSymbol ? { value: selectSymbol } : {})}
        >
          {list.map(pair => (
            <Select.Option onClick={() => handleSelectPair(pair)} key={pair.from_coin_symbol}>
              {pair.display_name} ({pair.from_coin_symbol})
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <h4 className="Deposit__title">
          <FormattedMessage id="step" defaultMessage="Step" /> 2:
        </h4>
        <h4>
          <FormattedMessage
            id="follow_the_deposit_instructions"
            defaultMessage="Follow the deposit instructions"
          />
          :
        </h4>
        <DepositInfo />
      </div>
    </Modal>
  );
};

Deposit.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Deposit);
