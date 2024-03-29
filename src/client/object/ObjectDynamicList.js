import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { map } from 'lodash';
import {
  getObjectsList,
  unfollowObjectInList,
  followObjectInList,
  getObjectsMoreList,
  resetLists,
} from '../../store/dynamicList/dynamicListActions';
import {
  getDynamicList,
  getDynamicListLoading,
} from '../../store/dynamicList/dynamicListSelectors';

import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import ObjectCard from '../components/Sidebar/ObjectCard';
import Loading from '../components/Icon/Loading';
import WeightTag from '../components/WeightTag';
import { changeCounterFollow } from '../../store/usersStore/usersActions';
import { isGuestUser } from '../../store/authStore/authSelectors';

import './ObjectDynamicList.less';

const ObjectDynamicList = props => {
  const { fetcher, isOnlyHashtags, match, loading } = props;
  const { list, hasMore } = props.dynamicListInfo;
  const { name, 0: type } = props.match.params;

  useEffect(() => {
    props.getObjectsList(
      props.fetcher,
      props.limit,
      0,
      props.match.params[0],
      props.isOnlyHashtags,
    );

    return () => props.resetLists();
  }, []);

  const handleLoadMore = () => {
    props.getObjectsMoreList(fetcher, props.limit, list?.length, match.params[0], isOnlyHashtags);
  };

  const unFollow = permlink => {
    props.unfollowWobj(permlink, name, type);
  };

  const follow = permlink => {
    props.followWobj(permlink, name, type);
  };

  const empty = !hasMore && list?.length === 0;
  const getWeight = wo => (props.expertize ? wo.user_weight : wo.weight);

  return (
    <div className="ObjectDynamicList">
      <ReduxInfiniteScroll
        elementIsScrollable={false}
        loadingMore={loading}
        hasMore={hasMore}
        loader={<Loading />}
        loadMore={handleLoadMore}
        threshold={500}
      >
        {map(list, wo => (
          <ObjectCard
            key={wo.author_permlink}
            wobject={wo}
            alt={<WeightTag weight={getWeight(wo)} />}
            unfollow={unFollow}
            follow={follow}
          />
        ))}
      </ReduxInfiniteScroll>
      {empty && !loading && (
        <div className="ObjectDynamicList__empty">
          <FormattedMessage id="list_empty" defaultMessage="Nothing is there" />
        </div>
      )}
    </div>
  );
};

ObjectDynamicList.propTypes = {
  fetcher: PropTypes.func.isRequired,
  isOnlyHashtags: PropTypes.bool,
  expertize: PropTypes.bool,
  loading: PropTypes.bool,
  getObjectsList: PropTypes.func,
  getObjectsMoreList: PropTypes.func,
  resetLists: PropTypes.func,
  unfollowWobj: PropTypes.func,
  followWobj: PropTypes.func,
  limit: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
      0: PropTypes.string,
    }),
  }).isRequired,
  dynamicListInfo: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.shape({})),
    hasMore: PropTypes.bool,
  }),
};

ObjectDynamicList.defaultProps = {
  isOnlyHashtags: false,
  expertize: false,
  unfollowWobj: () => {},
  followWobj: () => {},
  limit: 15,
};

export default withRouter(
  connect(
    (state, ownProps) => ({
      isGuest: isGuestUser(state),
      dynamicListInfo: getDynamicList(state, ownProps.match.params[0]),
      loading: getDynamicListLoading(state),
    }),
    {
      followWobj: followObjectInList,
      unfollowWobj: unfollowObjectInList,
      changeCounterFollow,
      getObjectsList,
      getObjectsMoreList,
      resetLists,
    },
  )(ObjectDynamicList),
);
