import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import { getObjectsList, getUsersList } from '../../store/dynamicList/dynamicListActions';
import UserDynamicList from './UserDynamicList';
import {
  getFollowersFromAPI,
  getWobjectFollowing,
  getFollowingsFromAPI,
} from '../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getAuthorizationUserFollowSort,
} from '../../store/authStore/authSelectors';
import { changeSorting } from '../../store/authStore/authActions';
import { getUser } from '../../store/usersStore/usersSelectors';
import ObjectDynamicList from '../object/ObjectDynamicList';

const UserFollowers = ({ match, sort, authUser, handleChange, user, locale, intl }) => {
  const { name, 0: tab } = match.params;
  const limit = 50;
  const objectsFollowingCount = user.objects_following_count || 0;
  const usersFollowingCount = user.users_following_count || 0;
  const followersCount = user.followers_count || 0;

  const getObjects = async skip => {
    const r = await getWobjectFollowing(name, skip, limit, authUser, locale);

    return { wobjects: r, hasMore: r?.length === limit };
  };

  const fetcher = async (usersList, auth, sorting, skip) => {
    const response = await getFollowersFromAPI(name, limit, skip, sort, authUser);
    const users = response.followers;

    return { users, hasMore: response.hasMore };
  };

  const fetcherFollowing = async (usersList, auth, sorting, skip) => {
    const response = await getFollowingsFromAPI(match.params.name, limit, skip, authUser, sorting);
    const users = response.users;

    return { users, hasMore: response.hasMore };
  };

  return (
    <Tabs defaultActiveKey={tab} className={'UserFollowers'}>
      <Tabs.TabPane
        className="UserFollowing__item"
        tab={
          <Link to={`/@${name}/followers`}>
            {intl.formatMessage({
              id: 'followers',
              defaultMessage: 'Followers',
            })}{' '}
            {followersCount}
          </Link>
        }
        key="followers"
      >
        <UserDynamicList limit={limit} sort={sort} fetcher={fetcher} handleChange={handleChange} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Link to={`/@${name}/following`}>
            {intl.formatMessage({
              id: 'following',
              defaultMessage: 'Following',
            })}{' '}
            {usersFollowingCount}
          </Link>
        }
        key="following"
        className="UserFollowing__item"
      >
        <div className="UserFollowing">
          <UserDynamicList
            limit={limit}
            fetcher={fetcherFollowing}
            handleChange={handleChange}
            sort={sort}
          />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={
          <Link to={`/@${name}/following-objects`}>
            {intl.formatMessage({
              id: 'objects',
              defaultMessage: 'Objects',
            })}{' '}
            {objectsFollowingCount}
          </Link>
        }
        className="UserFollowing__item"
        key="following-objects"
      >
        <ObjectDynamicList limit={limit} fetcher={getObjects} />
      </Tabs.TabPane>
    </Tabs>
  );
};

UserFollowers.propTypes = {
  match: PropTypes.shape().isRequired,
  sort: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  authUser: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

UserFollowers.fetchData = ({ match, store }) => {
  const fetcher = async (skip, authUser) => {
    const r = await getWobjectFollowing(match.params.name, skip, 30, authUser);

    return { wobjects: r, hasMore: r?.length === 30 };
  };

  const fetcherFollower = async (usersList, auth, sorting, skip) => {
    const response = await getFollowersFromAPI(match.params.name, 30, skip);
    const users = response.followers;

    return { users, hasMore: response.hasMore };
  };

  const fetcherFollowing = async (usersList, auth, sorting, skip) => {
    const response = await getFollowingsFromAPI(match.params.name, 30, skip);
    const users = response.users;

    return { users, hasMore: response.hasMore };
  };

  if (match.params[0] === 'following-objects') {
    return Promise.allSettled([store.dispatch(getObjectsList(fetcher, 30, 0, match.params[0]))]);
  }

  if (match.params[0] === 'following') {
    return Promise.allSettled([
      store.dispatch(getUsersList(fetcherFollowing, 30, 0, match.params[0])),
    ]);
  }

  return Promise.allSettled([
    store.dispatch(getUsersList(fetcherFollower, 30, 0, match.params[0])),
  ]);
};

export default connect(
  (state, ownProps) => ({
    sort: getAuthorizationUserFollowSort(state),
    authUser: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
  }),
  {
    handleChange: changeSorting,
  },
)(injectIntl(UserFollowers));
