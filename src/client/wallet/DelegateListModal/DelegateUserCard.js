import React from 'react';
import { Icon } from 'antd';
import { FormattedNumber } from 'react-intl';
import PropsType from 'prop-types';
import Avatar from '../../components/Avatar';

import './DelegateUserCard.less';

const DelegateUserCard = props => (
  <div className="DelegateUserCard">
    {props.pending ? (
      <span className="DelegateUserCard__expiring">
        <Icon type="clock-circle" /> expiring...
      </span>
    ) : (
      <a href={`/@${props.name}`} style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size={45} username={props.name} />
        <span className={'DelegateUserCard__name'}>{props.name}</span>
      </a>
    )}
    <span>
      <FormattedNumber value={props.quantity} maximumFractionDigits={3} minimumFractionDigits={2} />{' '}
      {props.symbol}
    </span>
  </div>
);

DelegateUserCard.propTypes = {
  quantity: PropsType.number.isRequired,
  symbol: PropsType.string.isRequired,
  name: PropsType.string,
  pending: PropsType.bool,
};

DelegateUserCard.defaultProps = {
  name: '',
  pending: false,
};

export default DelegateUserCard;
