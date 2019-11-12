import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import UserCard from '../UserCard';
import WeightTag from '../WeightTag';
import './ObjectExpertise.less';
import { getWobjectsExpertise } from '../../../waivioApi/ApiClient';
import RightSidebarLoading from '../../app/Sidebar/RightSidebarLoading';

const USERS_COUNT = 5;

const ObjectExpertise = ({ username, wobject }) => {
  const [experts, setExperts] = useState({ user: {}, users: [] });
  const { users, user } = experts;
  const isUserInTopFive = users.find(u => u.name === username);
  useEffect(() => {
    getWobjectsExpertise(username, wobject.author_permlink, 0, USERS_COUNT).then(data =>
      setExperts(data),
    );
  }, [wobject.author_permlink]);

  const showMoreExpertise = () => {
    getWobjectsExpertise(username, wobject.author_permlink, 0, users.length + USERS_COUNT).then(
      data => setExperts(data),
    );
  };

  return !_.isEmpty(users) ? (
    <div className="SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="object_expertise" defaultMessage="Experts" />
      </h4>
      <div className="SidebarContentBlock__content">
        {users &&
          _.map(_.slice(users, 0, users.length), u => (
            <UserCard
              key={u.name}
              user={u}
              showFollow={false}
              alt={<WeightTag weight={u.weight} />}
            />
          ))}

        {!isUserInTopFive && user && (
          <React.Fragment>
            <div className="ObjectExpertise__dots">...</div>
            <UserCard
              key={user.name}
              user={user}
              showFollow={false}
              alt={<WeightTag weight={user.weight} />}
            />
          </React.Fragment>
        )}

        {_.size(users) >= USERS_COUNT && (
          <div className="ObjectExpertise__buttons-wrap">
            <div className="ObjectExpertise__buttons-wrap-all">
              <Link
                className="ObjectExpertise__buttons-wrap-all"
                to={`/object/${wobject.author_permlink}/expertise`}
              >
                <FormattedMessage id="show_all" defaultMessage="Show all" />
              </Link>
            </div>
            <div
              className="ObjectExpertise__buttons-wrap-more"
              onClick={showMoreExpertise}
              role="presentation"
            >
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <RightSidebarLoading />
  );
};

ObjectExpertise.propTypes = {
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
};

export default ObjectExpertise;
