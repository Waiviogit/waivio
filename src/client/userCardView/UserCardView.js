import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './UserCardView.less';
import Avatar from '../components/Avatar';

const UserCardView = ({ user }) => {
  const userName = user.name || user.account;
  return (
    <React.Fragment>
      <div className="UserCardView">
        <div className="UserCardView__content">
          <div className="UserCardView__content-row">
            <Avatar username={userName} size={80} />
            <div className="UserCardView__content--name-wrap">
              <Link
                to={`/@${userName}`}
                title={userName}
                className="UserCardView__content--user-name"
              >
                {userName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

UserCardView.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default UserCardView;
