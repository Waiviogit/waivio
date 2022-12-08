import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { get } from 'lodash';
import Avatar from '../../components/Avatar';
import WeightTag from '../../components/WeightTag';

const BlacklistUser = ({ intl, user, handleDeleteUsers }) => {
  const [loading, setLoading] = useState(false);
  const userName = user.name || get(user, ['user', 'name']) || user.account;
  const userWeight = user.wobjects_weight || get(user, ['user', 'wobjects_weight']);

  const handleDelUsers = async () => {
    await setLoading(true);
    await handleDeleteUsers(userName);
    await setLoading(false);
  };

  return (
    <div key={userName} className="Blacklist__user">
      <div className="Blacklist__user-content">
        <div className="Blacklist__user-links">
          <Link to={`/@${userName}`}>
            <Avatar username={userName} size={40} />
          </Link>
          <div className="Blacklist__user-profile">
            <div className="Blacklist__user__profile__header">
              <Link to={`/@${userName}`}>
                <span className="Blacklist__user-name">
                  <span className="username">{userName}</span>
                </span>
              </Link>
              {userWeight && <WeightTag weight={userWeight} />}
            </div>
            <div className="Blacklist__user__profile__delete">
              <Button
                type="primary"
                onClick={() => handleDelUsers()}
                loading={loading}
                id={userName}
              >
                {intl.formatMessage({
                  id: 'matchBot_btn_delete',
                  defaultMessage: 'Delete',
                })}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="Blacklist__user__divider" />
    </div>
  );
};

BlacklistUser.propTypes = {
  user: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  handleDeleteUsers: PropTypes.func.isRequired,
};

export default injectIntl(BlacklistUser);
