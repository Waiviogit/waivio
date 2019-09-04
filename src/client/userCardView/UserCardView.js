import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './UserCardView.less';
import Avatar from '../components/Avatar';

const UserCardView = ({ user }) => (
  <React.Fragment>
    <div className="UserCardView">
      <div className="UserCardView__content">
        <div className="UserCardView__content-row">
          <Avatar username={user.account} size={80} />
          <div className="UserCardView__content--name-wrap">
            <Link
              to={`/@${user.account}`}
              title={user.account}
              className="UserCardView__content--user-name"
            >
              {user.account}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

UserCardView.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default UserCardView;
