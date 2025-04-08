import React from 'react';
import { Button, Icon } from 'antd';
import { FormattedNumber } from 'react-intl';
import PropsType from 'prop-types';
import Avatar from '../../../components/Avatar';

import './DelegateUserCard.less';

const DelegateUserCard = props => (
  <div className="DelegateUserCard">
    <div className={'DelegateUserCard__userInfo'}>
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
      <span className={props.quantityClassList}>
        <FormattedNumber
          value={props.quantity}
          maximumFractionDigits={3}
          minimumFractionDigits={props.minimumFractionDigits}
        />
        {props.symbolOnly ? props.symbol : ` ${props.symbol[0]}P`}
      </span>
    </div>
    {props.withEdit && (
      <Button
        onClick={() => props.onEdit({ name: props.name, quantity: props.quantity }, props.symbol)}
      >
        Edit
      </Button>
    )}
  </div>
);

DelegateUserCard.propTypes = {
  quantity: PropsType.number.isRequired,
  minimumFractionDigits: PropsType.number,
  symbol: PropsType.string.isRequired,
  onEdit: PropsType.func.isRequired,
  withEdit: PropsType.bool,
  name: PropsType.string,
  quantityClassList: PropsType.string,
  pending: PropsType.bool,
  symbolOnly: PropsType.bool,
};

DelegateUserCard.defaultProps = {
  name: '',
  quantityClassList: '',
  pending: false,
  withEdit: false,
  symbolOnly: false,
  minimumFractionDigits: 2,
};

export default DelegateUserCard;
