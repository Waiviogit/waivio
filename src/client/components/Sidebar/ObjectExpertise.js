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
  const [experts, setExperts] = useState({ user: {}, users: [], loading: true });
  const { users, user, loading } = experts;
  const isUserInTopFive = users.find(u => u.name === username);

  useEffect(() => {
    getWobjectsExpertise(username, wobject.author_permlink, 0, 5)
      .then(data => {
        setExperts({ ...data, loading: false });
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => setExperts({ user: {}, users: [], loading: false }));
  }, [wobject.author_permlink]);
  let renderExperts = null;

  if (loading) {
    renderExperts = <RightSidebarLoading />;
  } else if (!loading && !_.isEmpty(users)) {
    renderExperts = (
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
  }
  return renderExperts;
};

ObjectExpertise.propTypes = {
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
};

export default ObjectExpertise;
