import React from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
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

const ManageRcDelegations = () => {
  const visible = useSelector(getManageRcModalVisible);
  const info = useSelector(getManageRcInfo);
  const dispatch = useDispatch();
  const billion = 1000000000;

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(toggleManageRcModal())}
      footer={null}
      title={'Manage RC delegations'}
      wrapClassName={'ManageRcDelegations'}
    >
      <div>
        <p>
          <b>Resource Credits (RC)</b>
        </p>

        <p>Available for delegations: {info.rcBalance}b RC</p>
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
