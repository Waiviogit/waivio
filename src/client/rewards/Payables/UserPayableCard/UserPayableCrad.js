import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../../components/Avatar';
import './UserPayableCard.less';

const UserPayableCard = ({ user }) => (
  <div className="UserPayableCard">
    <Avatar username={user.userName} size={40} />
    <div className="UserPayableCard__content">
      <div className="UserPayableCard__content-alias-name"> {user.aliasName}</div>
      <div className="UserPayableCard__content-name"> {`@${user.userName}`}</div>
    </div>
  </div>
);

UserPayableCard.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default UserPayableCard;
