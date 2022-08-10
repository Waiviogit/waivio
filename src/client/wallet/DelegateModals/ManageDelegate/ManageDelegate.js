import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useRouteMatch } from 'react-router';
import { get, isEmpty, round } from 'lodash';
import PropsType from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import {
  getDelegationModalType,
  getDelegationModalVisible,
  getDelegationToken,
  getTokensBalanceListForTransfer,
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../../store/walletStore/walletSelectors';
import { toggleDelegateModal } from '../../../../store/walletStore/walletActions';
import { getDelegateList, getHiveDelegate } from '../../../../waivioApi/ApiClient';
import TokenManage from './components/TokenManage/TokenManage';
import formatter from '../../../../common/helpers/steemitFormatter';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';
import DelegateModal from '../DelegateModal/DelegateModal';
import EditDelegationModal from '../EditDelegationModal/EditDelegationModal';
import EmptyManage from './components/EmptyManage';
import delegationModalTypes from '../../../../common/constants/delegationModalTypes';

import './ManageDelegate.less';

const ManageDelegate = ({ intl }) => {
  const dispatch = useDispatch();
  const totalVestingShares = useSelector(getTotalVestingShares);
  const totalVestingFundSteem = useSelector(getTotalVestingFundSteem);
  const modalType = useSelector(getDelegationModalType);
  const delegationToken = useSelector(getDelegationToken);
  const authUser = useSelector(getAuthenticatedUser);
  const tokensList = useSelector(getTokensBalanceListForTransfer);
  const visible = useSelector(getDelegationModalVisible);
  const match = useRouteMatch();
  const [delegationList, setDelegationList] = useState({});
  const [showDelegate, setShowDelegate] = useState(false);
  const [requiredUser, setRequiredUser] = useState(null);
  const [requiredToken, setRequiredToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const completeDelegationList = async () => {
    setLoading(true);
    const delegated = await getDelegateList({ from: match.params.name });
    const hiveDelegeted = await getHiveDelegate(match.params.name);
    const hiveEngineDelegateList = delegated.reduce(
      (acc, curr) => {
        if (curr.symbol === 'WAIV') {
          acc.mainTokens[curr.symbol] = [...(acc.mainTokens[curr.symbol] || []), curr];
        } else {
          acc.secondaryTokens[curr.symbol] = [...(acc.secondaryTokens[curr.symbol] || []), curr];
        }

        return acc;
      },
      {
        mainTokens: {
          ...(isEmpty(hiveDelegeted.delegated)
            ? {}
            : {
                HIVE: hiveDelegeted.delegated.map(item => ({
                  to: item.delegatee,
                  quantity:
                    formatter.vestToSteem(
                      item.vesting_shares,
                      totalVestingShares,
                      totalVestingFundSteem,
                    ) / 1000000,
                })),
              }),
        },
        secondaryTokens: {},
      },
    );

    setDelegationList(hiveEngineDelegateList);
    setLoading(false);
  };

  useEffect(() => {
    completeDelegationList();

    if (modalType === delegationModalTypes.DELEGATION) {
      setShowDelegate(true);
      setRequiredToken(delegationToken);
    }
  }, []);

  const handleCloseMenageModal = () => dispatch(toggleDelegateModal());

  const handleOpenDelegateModal = token => {
    setShowDelegate(true);
    setRequiredToken(token);
  };

  const handleOpenUndelegateModal = (user, token) => {
    setRequiredUser(user);
    setRequiredToken(token);
  };

  const stakinTokensList = () =>
    tokensList.reduce((acc, curr) => {
      if (curr.stakingEnabled) {
        const availableVotingPower = curr.stake - curr.delegationsIn;

        return {
          ...acc,
          [curr.symbol === 'WAIV' ? 'WP' : curr.symbol]:
            round(availableVotingPower >= 0 ? availableVotingPower : 0, 5) || 0,
        };
      }

      return acc;
    }, {});

  const calculateAvailableHiveVotingPower = () => {
    const vestingShares = parseFloat(authUser.vesting_shares);
    const toWithdraw = parseFloat(authUser.to_withdraw);
    const withdrawn = parseFloat(authUser.withdrawn);
    const delegatedVestingShares = parseFloat(authUser.delegated_vesting_shares);
    const avail = vestingShares - (toWithdraw - withdrawn) / 1e6 - delegatedVestingShares;

    return formatter.vestToSteem(avail, totalVestingShares, totalVestingFundSteem);
  };

  const stakedList = {
    ...(parseFloat(authUser.vesting_shares)
      ? {
          HP: round(calculateAvailableHiveVotingPower(), 3),
        }
      : {}),
    ...stakinTokensList(),
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible && delegationModalTypes.MANAGE === modalType}
        onCancel={handleCloseMenageModal}
        className={'ManageDelegate'}
        title={intl.formatMessage({ id: 'manage_delegations' })}
        footer={[
          <Button onClick={handleCloseMenageModal} key={'close'}>
            {intl.formatMessage({ id: 'close' })}
          </Button>,
        ]}
        wrapClassName="PowerSwitcher__wrapper"
      >
        {isEmpty(delegationList.mainTokens) &&
        isEmpty(delegationList.secondaryTokens) &&
        (isEmpty(stakedList) || Object.values(stakedList).every(stake => !stake)) ? (
          <EmptyManage loading={loading} />
        ) : (
          <React.Fragment>
            <TokenManage
              symbol={'WAIV'}
              delegationList={get(delegationList, ['mainTokens', 'WAIV'])}
              stakeAmount={stakedList.WP}
              onOpenDelegate={handleOpenDelegateModal}
              onOpenUndelegate={handleOpenUndelegateModal}
              intl={intl}
              loading={loading}
            />
            <TokenManage
              symbol={'HP'}
              delegationList={get(delegationList, ['mainTokens', 'HIVE'])}
              stakeAmount={stakedList.HP}
              intl={intl}
              onOpenDelegate={handleOpenDelegateModal}
              onOpenUndelegate={handleOpenUndelegateModal}
              loading={loading}
            />
            {!isEmpty(stakedList) &&
              Object.entries(stakedList).map(stake => {
                if (stake[0] === 'WP' || stake[0] === 'HP') return null;

                return (
                  <TokenManage
                    key={stake[0]}
                    symbol={stake[0]}
                    delegationList={get(delegationList, ['secondaryTokens', stake[0]], [])}
                    stakeAmount={stake[1]}
                    onOpenDelegate={handleOpenDelegateModal}
                    onOpenUndelegate={handleOpenUndelegateModal}
                    intl={intl}
                    loading={loading}
                  />
                );
              })}
          </React.Fragment>
        )}
      </Modal>
      {showDelegate && (
        <DelegateModal
          stakeList={stakedList}
          visible={showDelegate}
          onCancel={() => {
            setShowDelegate(false);
            if (delegationModalTypes.DELEGATION === modalType) {
              dispatch(toggleDelegateModal());
            }
          }}
          token={requiredToken}
        />
      )}
      {requiredUser && (
        <EditDelegationModal
          stakeList={stakedList}
          visible={!!requiredUser}
          onCancel={() => handleOpenUndelegateModal(null, null)}
          requiredUser={requiredUser}
          token={requiredToken}
        />
      )}
    </React.Fragment>
  );
};

ManageDelegate.propTypes = {
  intl: PropsType.shape({
    formatMessage: PropsType.func,
  }).isRequired,
};

export default injectIntl(ManageDelegate);
