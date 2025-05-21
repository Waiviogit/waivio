import React, { useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { isEmpty } from 'lodash';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import Loading from '../../components/Icon/Loading';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import { billion } from './HivePowerBlock';

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
  delegatedOut,
  rcInfo,
}) => {
  const [showModal, setShowModal] = useState(false);
  const totalRc = rcBalance + delegatedOut;
  const cancelModal = () => setShowModal(false);

  return (
    <>
      <div
        className={`UserWalletSummary__itemWrap--no-border ${showRcDelegate ? '' : 'last-block'}`}
      >
        <div className="UserWalletSummary__item">
          <div className="UserWalletSummary__label power-down">
            <FormattedMessage id="resource_credits" defaultMessage="Resource credits " />
          </div>
          <div className={powerClassList} onClick={() => setShowModal(true)}>
            {user.fetching || loadingGlobalProperties ? (
              <Loading />
            ) : (
              <span>
                <FormattedNumber value={totalRc.toFixed(2)} />
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
                  {delegationsBalance > 0 ? '+' : ''}
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
      <Modal
        title={'Resource credits'}
        visible={showModal}
        onCancel={cancelModal}
        footer={[
          <Button key="ok" type="primary" onClick={cancelModal}>
            <FormattedMessage id="ok" defaultMessage="Ok" />
          </Button>,
        ]}
      >
        <div className={'mb2'}>
          <b>Total RC owned:</b> <FormattedNumber value={totalRc * billion} /> RC
        </div>
        <div className={'mb2'}>
          <b>Maximum RC capacity:</b> <FormattedNumber value={rcInfo?.max_rc} /> RC
        </div>
        <div>
          <b>Currently available RC:</b>{' '}
          <FormattedNumber value={rcInfo?.rc_manabar?.current_mana} /> RC
        </div>
      </Modal>
    </>
  );
};

RcBlock.propTypes = {
  delegationsBalance: PropTypes.number,
  rcBalance: PropTypes.number,
  delegatedOut: PropTypes.number,
  user: PropTypes.shape(),
  rcInfo: PropTypes.shape(),
  delegatedRc: PropTypes.arrayOf(),
  inDelegatedRc: PropTypes.arrayOf(),
  isAuth: PropTypes.bool,
  showRcDelegate: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  setVisibleRcDetails: PropTypes.func,
  powerClassList: PropTypes.string,
};

export default RcBlock;
