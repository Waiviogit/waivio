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

const ObjectExpertise = ({ username, wobject }) => {
  const [experts, setExperts] = useState({ user: {}, users: [] });
  const { users, user } = experts;
  const isUserInTopFive = users.find(u => u.name === username);
  const [limit, setLimit] = useState(5);
  useEffect(() => {
    getWobjectsExpertise(username, wobject.author_permlink, 0, 5).then(data => setExperts(data));
  }, [wobject.author_permlink]);

  const showMoreExpertise = () => {
    getWobjectsExpertise(username, wobject.author_permlink, 0, limit + 5).then(data =>
      setExperts(data),
    );
    setLimit(limit + 5);
  };

  return !_.isEmpty(users) ? (
    <div className="SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="object_expertise" defaultMessage="Experts" />
      </h4>
      <div className="SidebarContentBlock__content">
        {users &&
          _.map(_.slice(users, 0, limit), u => (
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

        {_.size(users) >= 5 && (
          <div className="ObjectExpertise__buttons-wrap">
            <div className="ObjectExpertise__buttons-wrap-all">
              <Link to={`/object/${wobject.author_permlink}/expertise`}>
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
