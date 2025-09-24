import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { round, get, isNil, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withRouter } from 'react-router';
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
import PowerDownProgressModal from '../PowerDownProgressModal/PowerDownProgressModal';
import CancelPowerDownModal from '../CancelPowerDownModal/CancelPowerDownModal';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import { getTokenBalance } from '../../../store/walletStore/walletActions';

const getFormattedTotalDelegated = (delegate, pendingUndelegations) => {
  if (!isNil(delegate) && !isNaN(delegate)) {
    return (
      <BTooltip
        title={'Balance of WAIV Power delegations to/from other users'}
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
          {delegate - pendingUndelegations > 0 ? ' +' : ' '}
          <FormattedNumber value={delegate - pendingUndelegations} />
        </span>
      </BTooltip>
    );
  }

  return null;
};
const getFormattedPendingWithdrawal = (pendingWithdrawal = {}) => {
  if (pendingWithdrawal !== 0 && !isNil(pendingWithdrawal) && !isNaN(pendingWithdrawal)) {
    return (
      <BTooltip
        title={'Balance of WAIV Power delegations to/from other users'}
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
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
  const [currPowerDown, setCurrPowerDown] = useState({});
  const [visible, setVisible] = useState(false);
  const [showCancelPowerDown, setShowCancelPowerDown] = useState(false);
  const [showPowerDownProgress, setPowerDownProgress] = useState(false);
  const balance = Number(get(props.currencyInfo, 'balance', null));
  const stake = Number(get(props.currencyInfo, 'stake', null));
  const unstake = Number(get(props.currencyInfo, 'pendingUnstake', null));
  const delegationsIn = Number(get(props.currencyInfo, 'delegationsIn', null));
  const delegationsOut = Number(get(props.currencyInfo, 'delegationsOut', null));
  const pendingUndelegations = Number(get(props.currencyInfo, 'pendingUndelegations', null));
  const delegation = delegationsIn - delegationsOut;
  const isZeroDelegation = delegation === 0;
  const isDelegationValid = !isNil(delegation) && !isNaN(delegation) && !isZeroDelegation;
  const isNonZeroPendingUndelegations = pendingUndelegations !== 0;
  const showPowerDown = unstake !== 0 && !isNil(unstake) && !isNaN(unstake);
  const estAccValue =
    props?.rates?.WAIV *
    props?.rates?.HIVE *
    (Number(balance) + Number(stake) + Number(unstake) + Number(delegationsOut));
  const hasDelegations =
    !isEmpty(delegateList) || !isEmpty(recivedList) || !isEmpty(undeligatedList);
  const powerClassList = classNames('WalletSummaryInfo__value', {
    // 'WalletSummaryInfo__value--unstake': unstake,
    'WalletSummaryInfo__value--cursorPointer': hasDelegations || showPowerDown,
  });

  const authUserPage = props.match.params.name === props.authUserName;
  const timestamp = epochToUTC(unstakesTokenInfo[0]?.nextTransactionTimestamp / 1000);
  const nextPowerDownDate = (
    <>
      <FormattedDate value={timestamp} /> <FormattedTime value={timestamp} />
    </>
  );

  const setDelegationLists = async () => {
    const delegated = await getDelegateList({ from: props.name, symbol: 'WAIV' });
    const recived = await getDelegateList({ to: props.name, symbol: 'WAIV' });
    const undeligated = await getPendingUndelegationsToken(props.name);
    const unstakeTokens = (await getPendingUnstakesToken(props.name, 'WAIV')) || [];

    setDeligateList(delegated);
    setRecivedList(recived);
    setUndeligatedList(undeligated);
    setUnstakesTokenInfo(unstakeTokens);
    setCurrPowerDown(unstakeTokens[0]);
  };

  useEffect(() => {
    props.getTokenBalance('WAIV', props.match.params.name);
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
            {isNil(props.currencyInfo) || isNaN(stake) ? (
              '-'
            ) : (
              <>
                {formattedNumber(balance)} {isNil(balance) || isNaN(balance) ? '' : 'WAIV'}
              </>
            )}
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
        <>
          <div className="WalletSummaryInfo__itemWrap">
            <div className="WalletSummaryInfo__item">
              <i className="iconfont icon-flashlight_fill WalletSummaryInfo__icon" />
              <div className="WalletSummaryInfo__label">WAIV Power</div>
              <div className={'WalletSummaryInfo__value'}>
                {isNil(props.currencyInfo) || isNaN(stake) ? (
                  '-'
                ) : (
                  <>
                    {formattedNumber(stake + delegationsOut)}
                    {/* {getFormattedPendingWithdrawal(unstake, unstakesTokenInfo)} */}
                    {/* {getFormattedTotalDelegated(delegation)}{' '} */}{' '}
                    {isNil(delegation) || isNaN(delegation) ? '' : 'WP'}
                  </>
                )}
              </div>
            </div>
            <div className="WalletSummaryInfo__actions">
              <p className="WalletSummaryInfo__description">
                <FormattedMessage id="staked_waiv_tokens" defaultMessage="Staked WAIV tokens" />
              </p>
              <WalletAction mainCurrency={'WP'} mainKey={'delegate'} options={['power_down']} />
            </div>

            {showPowerDown && (
              <div className="WalletSummaryInfo__itemWrap--no-border delegation-block">
                <div className="WalletSummaryInfo__item">
                  <div className="WalletSummaryInfo__label power-down">Power down</div>
                  <div
                    className={powerClassList}
                    onClick={() => {
                      setCurrPowerDown(unstakesTokenInfo[0]);
                      setPowerDownProgress(true);
                    }}
                  >
                    {isNil(props.currencyInfo) ? (
                      '-'
                    ) : (
                      <>
                        {getFormattedPendingWithdrawal(unstake)}{' '}
                        {isNil(delegation) || isNaN(delegation) ? '' : 'WP'}
                      </>
                    )}
                  </div>
                </div>
                <div className="WalletSummaryInfo__actions">
                  <p className="WalletSummaryInfo__description">
                    {' '}
                    Next power down:{' '}
                    {isMobile() ? <div>{nextPowerDownDate}</div> : nextPowerDownDate}
                  </p>
                  {props.isAuth && authUserPage && (
                    <Button
                      onClick={() => setShowCancelPowerDown(true)}
                      className={'UserWalletSummary__button'}
                    >
                      Cancel{' '}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {(isDelegationValid ||
              (!isZeroDelegation && isNonZeroPendingUndelegations) ||
              isNonZeroPendingUndelegations) && (
              <div className="WalletSummaryInfo__itemWrap--no-border delegation-block">
                <div className="WalletSummaryInfo__item">
                  <div className="WalletSummaryInfo__label power-down">WAIV delegations</div>
                  <div
                    className={powerClassList}
                    onClick={() => {
                      if (hasDelegations) {
                        setVisible(true);
                      }
                    }}
                  >
                    {isNil(props.currencyInfo) ? (
                      '-'
                    ) : (
                      <>
                        {getFormattedTotalDelegated(delegation, pendingUndelegations)}{' '}
                        {isNil(delegation) || isNaN(delegation) ? '' : 'WP'}
                      </>
                    )}
                  </div>
                </div>
                <div className="WalletSummaryInfo__actions">
                  <p className="WalletSummaryInfo__description"> Delegations to/from other users</p>
                  <WalletAction mainCurrency={'WP'} mainKey={'manage'} options={['delegate']} />
                </div>
              </div>
            )}
          </div>
        </>
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
      {showPowerDownProgress && (
        <PowerDownProgressModal
          isWaivWallet
          maxWeeks={4}
          isAuth={props.isAuth}
          authUserPage={authUserPage}
          setCurrPowerDown={setCurrPowerDown}
          setShowCancelPowerDown={setShowCancelPowerDown}
          unstakesTokenInfo={unstakesTokenInfo}
          showModal={showPowerDownProgress}
          setShowModal={setPowerDownProgress}
        />
      )}
      {showCancelPowerDown && (
        <CancelPowerDownModal
          account={props.authUserName}
          txID={currPowerDown.txID}
          isWaivWallet
          showCancelPowerDown={showCancelPowerDown}
          setShowCancelPowerDown={setShowCancelPowerDown}
          setPowerDownProgress={setPowerDownProgress}
        />
      )}
    </WalletSummaryInfo>
  );
};

WAIVWalletSummaryInfo.propTypes = {
  currencyInfo: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  match: PropTypes.shape().isRequired,
  rates: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  authUserName: PropTypes.string.isRequired,
  getTokenBalance: PropTypes.func.isRequired,
  isGuest: PropTypes.bool,
  isAuth: PropTypes.bool,
};

WAIVWalletSummaryInfo.defaultProps = {
  isGuest: false,
};

export default connect(
  state => ({
    currencyInfo: getUserCurrencyBalance(state, 'WAIV'),
    rates: getRatesList(state),
    isAuth: getIsAuthenticated(state),
    authUserName: getAuthenticatedUserName(state),
  }),
  { getTokenBalance },
)(withRouter(WAIVWalletSummaryInfo));
