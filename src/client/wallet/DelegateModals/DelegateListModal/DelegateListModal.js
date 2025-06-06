import React from 'react';
import { Modal, Tabs } from 'antd';
import { isEmpty } from 'lodash';
import { FormattedNumber } from 'react-intl';
import PropsType from 'prop-types';

import DelegateUserCard from '../DelegateUserCard/DelegateUserCard';

import './DelegateListModal.less';

const DelegateListModal = props => {
  const getTitle = (list, type) => (
    <React.Fragment>
      {type}:{' '}
      <FormattedNumber
        value={list.reduce((acc, curr) => acc + +curr.quantity, 0)}
        minimumFractionDigits={props.isRc ? 0 : 2}
        maximumFractionDigits={2}
      />
      {props.isRc ? props.symbol : ` ${props.symbol}`}
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
          <Tabs.TabPane tab={getTitle(props.recivedList, 'Received')} key="1">
            <div className="DelegateListModal__list">
              {props.recivedList
                .sort((a, b) => b.quantity - a.quantity)
                .map(recive => (
                  <DelegateUserCard
                    minimumFractionDigits={props.isRc ? 0 : 2}
                    key={recive._id}
                    name={recive.from}
                    quantity={recive.quantity}
                    symbol={props.symbol}
                    symbolOnly={props.isRc}
                  />
                ))}
            </div>
          </Tabs.TabPane>
        )}
        {(!isEmpty(props.deligateList) || !isEmpty(props.undeligatedList)) && (
          <Tabs.TabPane
            tab={
              isEmpty(props.undeligatedList)
                ? getTitle(props.deligateList, 'Delegated')
                : getTitle([...props.deligateList, ...props.undeligatedList], 'Delegated')
            }
            key="2"
          >
            <div className="DelegateListModal__list">
              {props.deligateList
                .sort((a, b) => b.quantity - a.quantity)
                .map(deligate => (
                  <DelegateUserCard
                    minimumFractionDigits={props.isRc ? 0 : 2}
                    key={deligate._id}
                    name={deligate.to}
                    quantity={deligate.quantity}
                    symbol={props.symbol}
                    symbolOnly={props.isRc}
                  />
                ))}
              {!isEmpty(props.undeligatedList) &&
                props.undeligatedList
                  .sort((a, b) => b.quantity - a.quantity)
                  .map(undeligate => (
                    <DelegateUserCard
                      minimumFractionDigits={props.isRc ? 0 : 2}
                      key={undeligate._id}
                      quantity={undeligate.quantity}
                      symbol={props.symbol}
                      pending
                      symbolOnly={props.isRc}
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
  isRc: PropsType.bool,
  toggleModal: PropsType.func.isRequired,
  recivedList: PropsType.arrayOf(PropsType.shape({})).isRequired,
  symbol: PropsType.string.isRequired,
  deligateList: PropsType.arrayOf(PropsType.shape({})).isRequired,
  undeligatedList: PropsType.arrayOf(PropsType.shape({})).isRequired,
};

export default DelegateListModal;
