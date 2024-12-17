import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { round, get, isNil, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import classNames from 'classnames';

import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import { getUserCurrencyBalance } from '../../../store/walletStore/walletSelectors';
import Loading from '../../components/Icon/Loading';
import DelegateListModal from '../DelegateModals/DelegateListModal/DelegateListModal';
import {
  getDelegateList,
  getPendingUndelegationsToken,
  getPendingUnstakesToken,
} from '../../../waivioApi/ApiClient';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import { getRatesList } from '../../../store/ratesStore/ratesSelector';
import BTooltip from '../../components/BTooltip';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { epochToUTC } from '../../../common/helpers/formatter';

const getFormattedTotalDelegated = delegate => {
  if (delegate !== 0 && !isNil(delegate) && !isNaN(delegate)) {
    return (
      <BTooltip
        title={
          delegate < 0 ? (
            <span>
              <FormattedMessage
                id="waiv_power_delegated_from_account_tooltip"
                defaultMessage="Waiv Power delegated from this account"
              />
            </span>
          ) : (
            <span>
              <FormattedMessage
                id="waiv_power_delegated_to_account_tooltip"
                defaultMessage="Waiv Power delegated to this account"
              />
            </span>
          )
        }
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
          {delegate > 0 ? ' (+' : ' ('}
          <FormattedNumber value={delegate} />
          {')'}
        </span>
      </BTooltip>
    );
  }

  return null;
};
const getFormattedPendingWithdrawal = (pendingWithdrawal, unstakesTokenInfo = {}) => {
  if (pendingWithdrawal !== 0 && !isNil(pendingWithdrawal) && !isNaN(pendingWithdrawal)) {
    const timestamp = epochToUTC(unstakesTokenInfo.nextTransactionTimestamp / 1000);

    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_pending_withdrawal_tooltip"
              defaultMessage="The next power down is scheduled to happen on "
            />
            <FormattedDate value={timestamp} /> <FormattedTime value={timestamp} />
          </span>
        }
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
          {' - '}
          <FormattedNumber value={pendingWithdrawal} />
        </span>
      </BTooltip>
    );
  }

  return null;
};

const WAIVWalletSummaryInfo = props => {
  const [delegateList, setDeligateList] = useState([]);
  const [recivedList, setRecivedList] = useState([]);
  const [unstakesTokenInfo, setUnstakesTokenInfo] = useState([]);
  const [undeligatedList, setUndeligatedList] = useState([]);
  const [visible, setVisible] = useState(false);
  const balance = Number(get(props.currencyInfo, 'balance', null));
  const stake = Number(get(props.currencyInfo, 'stake', null));
  const unstake = Number(get(props.currencyInfo, 'pendingUnstake', null));
  const delegationsIn = Number(get(props.currencyInfo, 'delegationsIn', null));
  const delegationsOut = Number(get(props.currencyInfo, 'delegationsOut', null));
  const delegation = delegationsIn - delegationsOut;
  const estAccValue =
    props?.rates?.WAIV *
    props?.rates?.HIVE *
    (Number(balance) + Number(stake) + Number(unstake) + Number(delegationsOut));
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
    const unstakeTokens = (await getPendingUnstakesToken(props.name, 'WAIV')) || [];

    setDeligateList(delegated);
    setRecivedList(recived);
    setUndeligatedList(undeligated);
    setUnstakesTokenInfo(unstakeTokens[0]);
  };

  useEffect(() => {
    if (!props.isGuest) setDelegationLists();
  }, []);

  const formattedNumber = num => {
    if (isNil(num) || isNaN(num)) return <Loading />;

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
          <div className="WalletSummaryInfo__value">
            {formattedNumber(balance)} {isNil(balance) || isNaN(balance) ? '' : 'WAIV'}
          </div>
        </div>
        <div className="WalletSummaryInfo__actions">
          <p className="WalletSummaryInfo__description">
            <FormattedMessage id="liquid_waiv_tokens" defaultMessage="Liquid WAIV tokens" />
          </p>
          <WalletAction
            mainKey={props.isGuest ? 'transfer' : 'power_up'}
            withdrawCurrencyOption={['LTC', 'BTC', 'ETH', 'HIVE', 'HBD']}
            options={props.isGuest ? [] : ['transfer']}
            mainCurrency={'WAIV'}
          />
        </div>
      </div>
      {!props.isGuest && (
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
              {formattedNumber(stake + delegationsOut)}
              {getFormattedPendingWithdrawal(unstake, unstakesTokenInfo)}
              {getFormattedTotalDelegated(delegation)}{' '}
              {isNil(delegation) || isNaN(delegation) ? '' : 'WP'}
            </div>
          </div>
          <div className="WalletSummaryInfo__actions">
            <p className="WalletSummaryInfo__description">
              {' '}
              <FormattedMessage id="staked_waiv_tokens" defaultMessage="Staked WAIV tokens" />
            </p>
            <WalletAction mainCurrency={'WP'} mainKey={'power_down'} options={['delegate']} />
          </div>
        </div>
      )}
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
  rates: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isGuest: PropTypes.bool,
};

WAIVWalletSummaryInfo.defaultProps = {
  isGuest: false,
};

export default connect(state => ({
  currencyInfo: getUserCurrencyBalance(state, 'WAIV'),
  rates: getRatesList(state),
}))(WAIVWalletSummaryInfo);
