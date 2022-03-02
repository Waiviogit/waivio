import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { round, get, isNil, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import classNames from 'classnames';

import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import {
  getTokenRatesInUSD,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import Loading from '../../components/Icon/Loading';
import { resetTokenBalance } from '../../../store/walletStore/walletActions';
import DelegateListModal from '../DelegateModals/DelegateListModal/DelegateListModal';
import { getDelegateList, getPendingUndelegationsToken } from '../../../waivioApi/ApiClient';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

const WAIVWalletSummaryInfo = props => {
  const [delegateList, setDeligateList] = useState([]);
  const [recivedList, setRecivedList] = useState([]);
  const [undeligatedList, setUndeligatedList] = useState([]);
  const [visible, setVisible] = useState(false);
  const balance = +get(props.currencyInfo, 'balance', 0);
  const stake = +get(props.currencyInfo, 'stake', 0);
  const unstake = +get(props.currencyInfo, 'pendingUnstake', 0);
  const delegationsIn = +get(props.currencyInfo, 'delegationsIn', 0);
  const delegationsOut = +get(props.currencyInfo, 'delegationsOut', 0);
  const estAccValue = props.rates * (Number(balance) + Number(stake));
  const delegation = delegationsIn - delegationsOut;
  const hasDelegations =
    !isEmpty(delegateList) || !isEmpty(recivedList) || !isEmpty(undeligatedList);
  const powerClassList = classNames('WalletSummaryInfo__value', {
    'WalletSummaryInfo__value--unstake': unstake,
    'WalletSummaryInfo__value--cursorPointer': hasDelegations,
  });

  const setDelegationLists = async () => {
    const delegated = await getDelegateList({ from: props.name, symbol: 'WAIV' });
    const recived = await getDelegateList({ to: props.name, symbol: 'WAIV' });
    const undeligated = await getPendingUndelegationsToken(props.name);

    setDeligateList(delegated);
    setRecivedList(recived);
    setUndeligatedList(undeligated);
  };

  useEffect(() => {
    setDelegationLists();

    return () => props.resetTokenBalance();
  }, []);

  const formattedNumber = num => {
    if (isNil(num)) return <Loading />;

    return <FormattedNumber value={round(num, 3)} />;
  };

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
      <div className="WalletSummaryInfo__itemWrap">
        <div className="WalletSummaryInfo__item">
          <img
            className="WalletSummaryInfo__icon waiv"
            src="https://waivio.nyc3.digitaloceanspaces.com/1633000477_5d88f63a-80e0-4882-92c8-ad7d0ce36dcf"
            alt="hive"
          />
          <div className="WalletSummaryInfo__label">WAIV</div>
          <div className="WalletSummaryInfo__value">{formattedNumber(balance)} WAIV</div>
        </div>
        <div className="WalletSummaryInfo__actions">
          <p className="WalletSummaryInfo__description">Liquid WAIV tokens</p>
          <WalletAction mainKey={'power_up'} options={['transfer']} mainCurrency={'WAIV'} />
        </div>
      </div>
      <div className="WalletSummaryInfo__itemWrap">
        <div className="WalletSummaryInfo__item">
          <i className="iconfont icon-flashlight_fill WalletSummaryInfo__icon" />
          <div className="WalletSummaryInfo__label">WAIV Power</div>
          <div
            className={powerClassList}
            onClick={() => {
              if (hasDelegations) {
                setVisible(true);
              }
            }}
          >
            {formattedNumber(stake)}
            {!!unstake && <span> - {formattedNumber(unstake)}</span>}{' '}
            {!!delegation && (
              <span>
                ({delegation > 0 && '+'}
                {formattedNumber(delegation)})
              </span>
            )}{' '}
            WP
          </div>
        </div>
        <div className="WalletSummaryInfo__actions">
          <p className="WalletSummaryInfo__description">Staked WAIV tokens</p>
          <WalletAction mainCurrency={'WP'} mainKey={'power_down'} options={['delegate']} />
        </div>
      </div>
      {hasDelegations && (
        <DelegateListModal
          visible={visible}
          toggleModal={setVisible}
          deligateList={delegateList}
          recivedList={recivedList}
          undeligatedList={undeligatedList}
          symbol={'WP'}
        />
      )}
    </WalletSummaryInfo>
  );
};

WAIVWalletSummaryInfo.propTypes = {
  currencyInfo: PropTypes.shape({}).isRequired,
  resetTokenBalance: PropTypes.func.isRequired,
  rates: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    currencyInfo: getUserCurrencyBalance(state, 'WAIV'),
    rates: getTokenRatesInUSD(state, 'WAIV'),
  }),
  {
    resetTokenBalance,
  },
)(WAIVWalletSummaryInfo);
