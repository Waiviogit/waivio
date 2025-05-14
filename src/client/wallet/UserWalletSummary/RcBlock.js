import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import Loading from '../../components/Icon/Loading';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

const RcBlock = ({
  powerClassList,
  delegatedRc,
  setVisibleRcDetails,
  user,
  loadingGlobalProperties,
  isAuth,
  inDelegatedRc,
  showRcDelegate,
  rcBalance,
  delegationsBalance,
}) => (
  <>
    <div className={`UserWalletSummary__itemWrap--no-border ${showRcDelegate ? '' : 'last-block'}`}>
      <div className="UserWalletSummary__item">
        <div className="UserWalletSummary__label power-down">
          <FormattedMessage id="resource_credits" defaultMessage="Resource credits " />
        </div>
        <div className={powerClassList}>
          {user.fetching || loadingGlobalProperties ? (
            <Loading />
          ) : (
            <span>
              <FormattedNumber value={rcBalance.toFixed(2)} />
              {'b RC'}
            </span>
          )}
        </div>
      </div>
      <div className="UserWalletSummary__actions">
        <p className="UserWalletSummary__description">Maximum resource credits</p>
        {isAuth && (
          <WalletAction
            mainKey={'delegate_rc'}
            delegatedRc={delegatedRc}
            rcBalance={rcBalance}
            // options={['delegate_rc']}
            mainCurrency={'HP'}
          />
        )}
      </div>
    </div>
    {showRcDelegate && (
      <div className="UserWalletSummary__itemWrap--no-border last-block">
        <div className="UserWalletSummary__item">
          <div className="UserWalletSummary__label power-down">
            <FormattedMessage id="rc_delegations" defaultMessage="RC Delegations" />
          </div>
          <div className={powerClassList} onClick={() => setVisibleRcDetails(true)}>
            {user.fetching || loadingGlobalProperties ? (
              <Loading />
            ) : (
              <span>
                <FormattedNumber value={delegationsBalance.toFixed(2)} />
                {'b RC'}
              </span>
            )}
          </div>
        </div>
        <div className="UserWalletSummary__actions">
          <p className="UserWalletSummary__description">Resource credits delegations</p>
          {isAuth && (!isEmpty(delegatedRc) || !isEmpty(inDelegatedRc)) && (
            <WalletAction
              mainKey={'manage_rc'}
              delegatedRc={delegatedRc}
              rcBalance={rcBalance}
              options={['delegate_rc']}
              mainCurrency={'HP'}
            />
          )}
        </div>
      </div>
    )}
  </>
);

RcBlock.propTypes = {
  delegationsBalance: PropTypes.number,
  rcBalance: PropTypes.number,
  user: PropTypes.shape(),
  delegatedRc: PropTypes.arrayOf(),
  inDelegatedRc: PropTypes.arrayOf(),
  isAuth: PropTypes.bool,
  showRcDelegate: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  setVisibleRcDetails: PropTypes.func,
  powerClassList: PropTypes.string,
};

export default RcBlock;
