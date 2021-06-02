import { isEmpty, map, slice, size } from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import UserCard from '../../UserCard';
import WeightTag from '../../WeightTag';
import { getWobjectsExpertiseWithNewsFilter } from '../../../../waivioApi/ApiClient';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';

import '../ObjectExpertise.less';

const ObjectExpertise = ({
  username,
  wobject,
  match,
  isCenterContent,
  history,
  unfollowExpert,
  followExpert,
}) => {
  const [experts, setExperts] = useState({ user: {}, users: [], loading: true });
  const { users, user, loading } = experts;
  const isUserInTopFive = users.find(u => u.name === username);
  const newsFilter = match.params[1] === 'newsFilter' ? { newsFilter: match.params.itemId } : {};

  useEffect(() => {
    getWobjectsExpertiseWithNewsFilter(username, wobject.author_permlink, 0, 5, newsFilter)
      .then(data => {
        setExperts({
          ...data,
          users: data.users.map(userExpert => ({ ...userExpert, pending: false })),
          loading: false,
        });
      })
      .catch(() => setExperts({ user: {}, users: [], loading: false }));
  }, [wobject.author_permlink, match.url]);

  const handleRedirectToExperts = () => {
    if (isCenterContent) history.push(`${match.url.replace(/\/[^/]+$/, '')}/expertise`);
  };

  const setIsLoading = userExpert =>
    setExperts(data => ({
      ...data,
      users: data.users.map(item =>
        item.name === userExpert ? { ...item, pending: !item.pending } : item,
      ),
    }));

  const setFollowUnFollow = userExpert =>
    setExperts(data => ({
      ...data,
      users: data.users.map(item =>
        item.name === userExpert
          ? { ...item, youFollows: !item.youFollows, pending: !item.pending }
          : item,
      ),
    }));

  const followUnFollow = (userExpert, callback) => {
    setIsLoading(userExpert);
    callback(userExpert)
      .then(() => setFollowUnFollow(userExpert))
      .catch(() => setIsLoading(userExpert));
  };

  const follow = userExpert => followUnFollow(userExpert, followExpert);

  const unFollow = userExpert => followUnFollow(userExpert, unfollowExpert);

  let renderExperts = null;

  if (loading) {
    renderExperts = <RightSidebarLoading />;
  } else if (!loading && !isEmpty(users)) {
    renderExperts = (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title" onClick={handleRedirectToExperts}>
          {!isCenterContent && <i className="iconfont icon-collection SidebarContentBlock__icon" />}{' '}
          <FormattedMessage id="object_expertise" defaultMessage="Experts" />
        </h4>
        <div className="SidebarContentBlock__content">
          {users &&
            map(slice(users, 0, 5), u => (
              <UserCard
                key={u.name}
                user={u}
                showFollow={isCenterContent}
                follow={follow}
                unfollow={unFollow}
                alt={<WeightTag weight={u.weight} />}
              />
            ))}
          {!isUserInTopFive && user && (
            <React.Fragment>
              <div className="ObjectExpertise__dots">...</div>
              <UserCard
                key={user.name}
                user={user}
                follow={follow}
                unfollow={unFollow}
                showFollow={false}
                alt={<WeightTag weight={user.weight} />}
              />
            </React.Fragment>
          )}
          {size(users) > 5 && (
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
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
  followExpert: PropTypes.func.isRequired,
  unfollowExpert: PropTypes.func.isRequired,
};

ObjectExpertise.defaultProps = {
  isCenterContent: false,
};

export default withRouter(ObjectExpertise);
