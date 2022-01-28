import React from 'react';
import { FormattedNumber } from 'react-intl';
import PropsType from 'prop-types';
import Avatar from '../../components/Avatar';

import './DelegateUserCard.less';

const DelegateUserCard = props => (
  <div className="DelegateUserCard">
    <a href={`/@${props.name}`} style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar size={45} username={props.name} />
      <b className={'DelegateUserCard__name'}>{props.name}</b>
    </a>
    <span>
      <FormattedNumber value={props.quantity} maximumFractionDigits={3} minimumFractionDigits={2} />{' '}
      {props.symbol}
    </span>
  </div>
);

DelegateUserCard.propTypes = {
  quantity: PropsType.number.isRequired,
  symbol: PropsType.string.isRequired,
  name: PropsType.string.isRequired,
};

export default DelegateUserCard;
