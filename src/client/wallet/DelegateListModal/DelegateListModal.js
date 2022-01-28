import React from 'react';
import { Modal, Tabs } from 'antd';
import { isEmpty, round } from 'lodash';
import PropsType from 'prop-types';

import DelegateUserCard from './DelegateUserCard';

const DelegateListModal = props => {
  const calculateSumm = list =>
    round(
      list.reduce((acc, curr) => acc + +curr.quantity, 0),
      3,
    );

  return (
    <Modal
      visible={props.visible}
      onCancel={() => props.toggleModal(false)}
      className="DelegateListModal"
      footer={null}
    >
      <Tabs defaultActiveKey="1" onChange={() => {}}>
        {!isEmpty(props.recivedList) && (
          <Tabs.TabPane
            tab={`Recived: ${calculateSumm(props.recivedList)} ${props.symbol}`}
            key="1"
          >
            <div className="DelegateListModal__list">
              {props.recivedList.map(recive => (
                <DelegateUserCard
                  key={recive._id}
                  name={recive.to}
                  quantity={recive.quantity}
                  symbol={props.symbol}
                />
              ))}
            </div>
          </Tabs.TabPane>
        )}
        {!isEmpty(props.deligateList) && (
          <Tabs.TabPane
            tab={`Delegeted: ${calculateSumm(props.deligateList)} ${props.symbol}`}
            key="2"
          >
            <div className="DelegateListModal__list">
              {props.deligateList.map(deligate => (
                <DelegateUserCard
                  key={deligate._id}
                  name={deligate.to}
                  quantity={deligate.quantity}
                  symbol={props.symbol}
                />
              ))}
            </div>
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

DelegateListModal.propTypes = {
  visible: PropsType.bool.isRequired,
  toggleModal: PropsType.func.isRequired,
  recivedList: PropsType.arrayOf(PropsType.shape({})).isRequired,
  symbol: PropsType.string.isRequired,
  deligateList: PropsType.arrayOf(PropsType.shape({})).isRequired,
};

export default DelegateListModal;
