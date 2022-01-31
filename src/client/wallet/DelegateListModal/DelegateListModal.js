import React from 'react';
import { Modal, Tabs } from 'antd';
import { isEmpty } from 'lodash';
import { FormattedNumber } from 'react-intl';

import PropsType from 'prop-types';

import DelegateUserCard from './DelegateUserCard';

const DelegateListModal = props => {
  const getTitle = (list, type) => (
    <React.Fragment>
      {type}:{' '}
      <FormattedNumber
        value={list.reduce((acc, curr) => acc + +curr.quantity, 0)}
        minimumFractionDigits={2}
        maximumFractionDigits={2}
      />{' '}
      {props.symbol}
    </React.Fragment>
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
          <Tabs.TabPane tab={getTitle(props.recivedList, 'Recived')} key="1">
            <div className="DelegateListModal__list">
              {props.recivedList
                .sort((a, b) => b.quantity - a.quantity)
                .map(recive => (
                  <DelegateUserCard
                    key={recive._id}
                    name={recive.from}
                    quantity={recive.quantity}
                    symbol={props.symbol}
                  />
                ))}
            </div>
          </Tabs.TabPane>
        )}
        {!isEmpty(props.deligateList) && (
          <Tabs.TabPane tab={getTitle(props.deligateList, 'Delegated')} key="2">
            <div className="DelegateListModal__list">
              {props.deligateList
                .sort((a, b) => b.quantity - a.quantity)
                .map(deligate => (
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
