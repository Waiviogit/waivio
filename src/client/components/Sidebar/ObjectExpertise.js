import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './ObjectExpertise.less';
import UserCard from '../UserCard';
import WeightTag from '../WeightTag';

const ObjectExpertise = ({ username, wobject }) => {
  const { users } = wobject;

  const {
    user: { name, weight, rank },
  } = wobject;

  const authUser = {
    name,
    weight,
    rank: rank.toString(),
  };

  const isUserInTopFive = users.slice(0, 5).find(u => u.name === username);

  return (
    <div className="SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="object_expertise" defaultMessage="Object Expertise" />
      </h4>
      <div className="SidebarContentBlock__content">
        {users &&
          _.map(_.slice(users, 0, 5), user => (
            <UserCard
              key={user.name}
              user={user}
              showFollow={false}
              alt={<WeightTag rank={user.rank} weight={user.weight} />}
            />
          ))}

        {!isUserInTopFive && (
          <React.Fragment>
            <div className="ObjectExpertise__dots">...</div>
            <UserCard
              key={authUser.name}
              user={authUser}
              showFollow={false}
              alt={<WeightTag rank={authUser.rank} weight={authUser.weight} />}
            />
          </React.Fragment>
        )}

        {_.size(users) > 5 && (
          <React.Fragment>
            <h4 className="ObjectExpertise__more">
              <Link to={`/object/${wobject.author_permlink}/expertise`}>
                <FormattedMessage id="show_more_authors" defaultMessage="Show more authors" />
              </Link>
            </h4>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

ObjectExpertise.propTypes = {
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
};

export default ObjectExpertise;
