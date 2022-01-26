import React from 'react';
import { Modal, Tabs } from 'antd';
import UserCard from '../../components/UserCard';

const DelegateListModal = () => (
  // format number 3
  // add card with hp rewards
  // get info from back end
  // sum from props

  <Modal visible>
    <Tabs defaultActiveKey="1" onChange={() => {}}>
      <Tabs.TabPane tab="Recived: 2323 HP" key="1">
        <UserCard user={{ name: 'lucykolosova' }} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Delegeted: 0 HP" key="2">
        <UserCard user={{ name: 'lucykolosova' }} />
      </Tabs.TabPane>
    </Tabs>
  </Modal>
);
export default DelegateListModal;
