import React, { useState, useEffect } from 'react';
import { isEmpty, last } from 'lodash';
import { useParams } from 'react-router';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InfiniteSroll from 'react-infinite-scroller';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Loading from '../../components/Icon/Loading';
import UserCard from '../../components/UserCard';
import WeightTag from '../../components/WeightTag';

import {
  followUserInList,
  setMoreUsersList,
  setUsersList,
  unfollowUserInList,
} from '../../../store/dynamicList/dynamicListActions';
import {
  getDynamicList,
  getDynamicListLoading,
} from '../../../store/dynamicList/dynamicListSelectors';

const limit = 50;
const GroupObjectType = ({ unfollowUser, followUser, authUser, dynamicListInfo, loading }) => {
  const { hasMore, list } = dynamicListInfo;
  const [lastUser, setLastUser] = useState(undefined);
  const params = useParams();
  const dispatch = useDispatch();
  const name = params.name;

  useEffect(() => {
    dispatch(setUsersList(name, authUser, limit, lastUser));
    setLastUser(last(list)?.name);
  }, [name]);

  const unFollow = user => {
    unfollowUser(user, name, name);
  };

  const follow = user => {
    followUser(user, name, name);
  };

  const loadMore = () => {
    dispatch(setMoreUsersList(name, authUser, limit, lastUser));
    setLastUser(last(list)?.name);
  };

  return (
    <div className="UserDynamicList">
      {loading ? (
        <Loading />
      ) : (
        <>
          <InfiniteSroll hasMore={hasMore} loader={<Loading />} loadMore={loadMore}>
            {list?.map(user => {
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
          {isEmpty(list) && !loading && (
            <div className="UserDynamicList__empty">No users have been added yet.</div>
          )}
        </>
      )}
    </div>
  );
};

GroupObjectType.propTypes = {
  authUser: PropTypes.string.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  dynamicListInfo: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default connect(
  (state, ownProps) => ({
    dynamicListInfo: getDynamicList(state, ownProps.match.params.name),
    loading: getDynamicListLoading(state),
    authUser: getAuthenticatedUserName(state),
  }),
  {
    unfollowUser: unfollowUserInList,
    followUser: followUserInList,
  },
)(GroupObjectType);
