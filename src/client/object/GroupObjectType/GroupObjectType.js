import React, { useState, useEffect } from 'react';
import { last } from 'lodash';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteSroll from 'react-infinite-scroller';
import { getGroupObjectUserList } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Loading from '../../components/Icon/Loading';
import UserCard from '../../components/UserCard';
import WeightTag from '../../components/WeightTag';

import {
  followUserInList,
  unfollowUserInList,
} from '../../../store/dynamicList/dynamicListActions';

const limit = 50;
const GroupObjectType = ({ unfollowUser, followUser, authUser }) => {
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState();
  const [loading, setLoading] = useState(false);
  const [lastUser, setLastUser] = useState(undefined);
  const params = useParams();
  const name = params.name;

  useEffect(() => {
    setLoading(true);

    getGroupObjectUserList(name, authUser, limit, lastUser).then(res => {
      setUsers(res.result);
      setLastUser(last(res.result)?.name);
      setHasMore(res?.hasMore);
      setLoading(false);
    });
  }, []);

  const unFollow = user => {
    unfollowUser(user, name, params[0]);
  };

  const follow = user => {
    followUser(user, name, params[0]);
  };

  const loadMore = () => {
    getGroupObjectUserList(name, authUser, limit, lastUser).then(res => {
      setUsers([...users, ...res.result]);
      setLastUser(last(res.result)?.name);
      setHasMore(res?.hasMore);
    });
  };

  return (
    <div className="UserDynamicList">
      {loading ? (
        <Loading />
      ) : (
        <InfiniteSroll hasMore={hasMore} loader={<Loading />} loadMore={loadMore}>
          {users?.map(user => {
            if (user.name !== authUser) {
              return (
                <UserCard
                  key={`${user.name}-${user._id}`}
                  user={user}
                  unfollow={unFollow}
                  follow={follow}
                  alt={<WeightTag weight={user.wobjects_weight || user.weight} />}
                />
              );
            }

            return null;
          })}
        </InfiniteSroll>
      )}
    </div>
  );
};

GroupObjectType.propTypes = {
  authUser: PropTypes.string.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    authUser: getAuthenticatedUserName(state),
  }),
  {
    unfollowUser: unfollowUserInList,
    followUser: followUserInList,
  },
)(GroupObjectType);
