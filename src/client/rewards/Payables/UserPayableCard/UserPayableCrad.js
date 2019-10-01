import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Avatar from '../../../components/Avatar';
import './UserPayableCard.less';

const UserPayableCard = ({ user }) => (
  <div className="UserPayableCard">
    <div className="UserPayableCard__content">
      <Avatar username={user.userName} size={40} />
      <div className="UserPayableCard__content-name-wrap">
        <div className="UserPayableCard__content-name-wrap-alias"> {user.aliasName}</div>
        <div className="UserPayableCard__content-name-wrap-name"> {`@${user.userName}`}</div>
      </div>
    </div>
    <div className="UserPayableCard__end-wrap">
      <div className="UserPayableCard__end-wrap-payable">
        {' '}
        {`${user.payable && user.payable.toFixed(2)} SBD`}
      </div>
      <div className="UserPayableCard__end-wrap-icon">
        <Icon type="right" />
      </div>
    </div>
  </div>
);

UserPayableCard.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default UserPayableCard;
