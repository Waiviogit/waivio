import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedNumber } from 'react-intl';
import {
  getManageRcInfo,
  getManageRcModalVisible,
} from '../../../../store/walletStore/walletSelectors';
import DelegateUserCard from '../DelegateUserCard/DelegateUserCard';
import {
  toggleDelegateRcModal,
  toggleManageRcModal,
} from '../../../../store/walletStore/walletActions';
import './ManageRcDelegations.less';
import { getRcByAccount } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

const ManageRcDelegations = () => {
  const visible = useSelector(getManageRcModalVisible);
  const info = useSelector(getManageRcInfo);
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const billion = 1000000000;
  const [rcInfo, setRcInfo] = React.useState({ max_rc: 0 });

  const billionRc = rcInfo ? rcInfo?.max_rc / billion : 0;

  useEffect(() => {
    getRcByAccount(authUserName).then(r => setRcInfo(r?.rc_accounts[0]));
  }, []);

  const cancelModal = () => {
    dispatch(toggleManageRcModal());
  };

  return (
    <Modal
      visible={visible}
      onCancel={cancelModal}
      title={'Manage RC delegations'}
      wrapClassName={'ManageRcDelegations'}
      footer={[
        <Button
          key={'close-btn'}
          onClick={cancelModal}
          className="EditDelegationModal__cancel-button"
        >
          Close
        </Button>,
      ]}
    >
      <div>
        <p>
          <b>Resource Credits (RC)</b>
        </p>

        <p>
          Available for delegations: <FormattedNumber value={billionRc.toFixed(2)} />b RC
        </p>
        <div className="TokenManage__list">
          {info?.delegatedRc?.map(item => (
            <DelegateUserCard
              key={item.to}
              name={item.to}
              quantity={item.delegated_rc / billion}
              quantityClassList={'TokenManage__cardQuantity'}
              symbol={'b RC'}
              onEdit={() => {
                dispatch(toggleManageRcModal());
                dispatch(toggleDelegateRcModal(true, item));
              }}
              withEdit
              symbolOnly
              minimumFractionDigits={0}
            />
          ))}
        </div>

        <Button
          className="TokenManage__delegate"
          onClick={() => {
            dispatch(toggleDelegateRcModal());
          }}
        >
          Delegate
        </Button>
      </div>
    </Modal>
  );
};

export default ManageRcDelegations;
