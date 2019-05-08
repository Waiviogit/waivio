import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './ObjectExpertise.less';
import UserCard from '../UserCard';
import WeightTag from '../WeightTag';

const ObjectExpertise = ({ username, wobject }) => {
  const { users, user } = wobject;
  const isUserInTopFive = users.slice(0, 5).find(u => u.name === username);

  return (
    <div className="SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="object_expertise" defaultMessage="Experts" />
      </h4>
      <div className="SidebarContentBlock__content">
        {users &&
          _.map(_.slice(users, 0, 5), u => (
            <UserCard
              key={u.name}
              user={u}
              showFollow={false}
              alt={<WeightTag rank={u.rank} weight={u.weight} />}
            />
          ))}

        {!isUserInTopFive && user && (
          <React.Fragment>
            <div className="ObjectExpertise__dots">...</div>
            <UserCard
              key={user.name}
              user={user}
              showFollow={false}
              alt={<WeightTag rank={user.rank.toString()} weight={user.weight} />}
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
