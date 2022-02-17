import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { useRouteMatch } from 'react-router';
import { get, isEmpty, round } from 'lodash';
import PropsType from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import {
  getDelegationModalVisible,
  getTokensBalanceListForTransfer,
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../../store/walletStore/walletSelectors';
import { toggleDelegateModal } from '../../../../store/walletStore/walletActions';
import { getDelegateList, getHiveDelegate } from '../../../../waivioApi/ApiClient';
import TokenManage from './components/TokenManage';
import formatter from '../../../../common/helpers/steemitFormatter';
import { getAuthenticatedUser } from '../../../../store/authStore/authSelectors';
import DelegateModal from '../DelegateModal/DelegateModal';

import './ManageDelegate.less';

const ManageDelegate = ({ intl }) => {
  const dispatch = useDispatch();
  const totalVestingShares = useSelector(getTotalVestingShares);
  const totalVestingFundSteem = useSelector(getTotalVestingFundSteem);
  const authUser = useSelector(getAuthenticatedUser);
  const tokensList = useSelector(getTokensBalanceListForTransfer);
  const visible = useSelector(getDelegationModalVisible);
  const match = useRouteMatch();
  const [delegationList, setDelegationList] = useState({});
  const [showDelegate, setShowDelegate] = useState(false);
  const [requiredUser, setRequiredUser] = useState(null);
  const [requiredToken, setRequiredToken] = useState(null);

  const completeDelegationList = async () => {
    const delegated = await getDelegateList({ from: match.params.name });
    const hiveDlegeted = await getHiveDelegate(match.params.name);
    const hiveEngineDelegateList = delegated.reduce(
      (acc, curr) => {
        if (curr.symbol === 'WAIV') {
          acc.mainTokens[curr.symbol] = [...(acc.mainTokens[curr.symbol] || {}), curr];
        } else {
          acc.secondaryTokens[curr.symbol] = [...(acc.secondaryTokens[curr.symbol] || {}), curr];
        }

        return acc;
      },
      {
        mainTokens: {
          HIVE: hiveDlegeted.delegated.map(item => ({
            to: item.delegatee,
            quantity:
              formatter.vestToSteem(
                item.vesting_shares,
                totalVestingShares,
                totalVestingFundSteem,
              ) / 1000000,
          })),
        },
        secondaryTokens: {},
      },
    );

    setDelegationList(hiveEngineDelegateList);
  };

  useEffect(() => {
    completeDelegationList();
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
        return {
          ...acc,
          [curr.symbol]: round(curr.stake, 5) || 0,
        };
      }

      return acc;
    }, {});

  const stakedList = {
    HP: round(
      formatter.vestToSteem(
        parseFloat(authUser.vesting_shares) - parseFloat(authUser.delegated_vesting_shares),
        totalVestingShares,
        totalVestingFundSteem,
      ),
      3,
    ),
    ...stakinTokensList(),
  };

  return (
    <React.Fragment>
      <Modal
        visible={visible}
        onCancel={handleCloseMenageModal}
        className={'ManageDelegate'}
        title={intl.formatMessage({ id: 'manage_delegations' })}
        footer={[
          <Button onClick={handleCloseMenageModal} key={'close'}>
            {intl.formatMessage({ id: 'close' })}
          </Button>,
        ]}
      >
        <TokenManage
          symbol={'WAIV'}
          delegationList={get(delegationList, ['mainTokens', 'WAIV'])}
          stakeAmount={stakedList.WAIV}
          onOpenDelegate={handleOpenDelegateModal}
          onOpenUndelegate={handleOpenUndelegateModal}
          intl={intl}
        />
        <TokenManage
          symbol={'HIVE'}
          delegationList={get(delegationList, ['mainTokens', 'HIVE'])}
          stakeAmount={stakedList.HP}
          intl={intl}
          onOpenDelegate={handleOpenDelegateModal}
          onOpenUndelegate={handleOpenUndelegateModal}
        />
        {!isEmpty(stakedList) &&
          Object.entries(stakedList).map(stake => {
            if (stake[0] === 'WAIV' || stake[0] === 'HP') return null;

            return (
              <TokenManage
                key={stake[0]}
                symbol={stake[0]}
                delegationList={get(delegationList, ['secondaryTokens', stake[0]], [])}
                stakeAmount={stake[1]}
                onOpenDelegate={handleOpenDelegateModal}
                onOpenUndelegate={handleOpenUndelegateModal}
                intl={intl}
              />
            );
          })}
      </Modal>
      {showDelegate && (
        <DelegateModal
          stakeList={stakedList}
          title={'Delegate'}
          visible={showDelegate}
          onCancel={() => setShowDelegate(false)}
          token={requiredToken}
        />
      )}
      {requiredUser && (
        <DelegateModal
          stakeList={stakedList}
          title={'Edit Delegation'}
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
