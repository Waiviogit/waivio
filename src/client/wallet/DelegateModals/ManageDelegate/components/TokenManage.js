import React from 'react';
import { isEmpty } from 'lodash';
import { Button } from 'antd';
import PropsType from 'prop-types';
import DelegateUserCard from '../../DelegateUserCard/DelegateUserCard';
import Loading from '../../../../components/Icon/Loading';

import './TokenManage.less';

const TokenManage = props => (
  <div className="TokenManage">
    <p>
      <span className="TokenManage__title">Token:</span> {props.symbol}
    </p>
    <p>
      {props.intl.formatMessage({ id: 'available_voting_power' })}: {props.stakeAmount}{' '}
      {props.symbol}
    </p>
    {props.loading && <Loading />}
    {!isEmpty(props.delegationList) && (
      <div className="TokenManage__list">
        {props.delegationList.map(item => (
          <DelegateUserCard
            key={item._id}
            name={item.to}
            quantity={item.quantity}
            quantityClassList={'TokenManage__cardQuantity'}
            symbol={props.symbol}
            onEdit={props.onOpenUndelegate}
            withEdit
          />
        ))}
      </div>
    )}
    <Button
      className="TokenManage__delegate"
      disabled={!props.stakeAmount}
      onClick={() => props.onOpenDelegate(props.symbol)}
    >
      {props.intl.formatMessage({ id: 'delegate' })}
    </Button>
  </div>
);

TokenManage.propTypes = {
  intl: PropsType.shape({
    formatMessage: PropsType.func,
  }).isRequired,
  symbol: PropsType.string.isRequired,
  loading: PropsType.bool.isRequired,
  stakeAmount: PropsType.number.isRequired,
  onOpenDelegate: PropsType.func.isRequired,
  onOpenUndelegate: PropsType.func.isRequired,
  delegationList: PropsType.arrayOf(
    PropsType.shape({
      _id: PropsType.string,
      to: PropsType.string,
      quantity: PropsType.number,
      symbol: PropsType.string,
    }),
  ).isRequired,
};

export default TokenManage;
