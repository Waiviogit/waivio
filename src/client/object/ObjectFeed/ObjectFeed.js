import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isEmpty, uniq, isNil } from 'lodash';
import Feed from '../../feed/Feed';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../../../common/helpers/stateHelpers';
import { getObjectPosts, getMoreObjectPosts } from '../../../store/feedStore/feedActions';
import { showPostModal } from '../../../store/appStore/appActions';
import PostModal from '../../post/PostModalContainer';
import Loading from '../../components/Icon/Loading';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import { getReadLanguages } from '../../../store/settingsStore/settingsSelectors';
import { getObject, getObjectsRewards } from '../../../waivioApi/ApiClient';
import { getPropositionsKey } from '../../../common/helpers/newRewardsHelper';
import Proposition from '../../newRewards/reuseble/Proposition/Proposition';
import Campaing from '../../newRewards/reuseble/Campaing';

import './ObjectFeed.less';

const ObjectFeed = ({ limit, handleCreatePost, userName, wobject }) => {
  const [loadingPropositions, setLoadingPropositions] = useState(false);
  const [newsPermlink, setNewsPermlink] = useState('');
  const [reward, setReward] = useState({});
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const readLocales = useSelector(getReadLanguages);
  const feed = useSelector(getFeed);
  const { name, parentName } = match.params;
  const objectFeed = getFeedFromState('objectPosts', name, feed);
  const content = uniq(objectFeed);
  const isFetching = getFeedLoadingFromState('objectPosts', name, feed);
  const hasMore = getFeedHasMoreFromState('objectPosts', name, feed);
  const skip = content.length;
  const query = new URLSearchParams(history.location.search);
  const isNewsfeedType = query.get('category') === 'newsfeed';
  let newsPerml;

  const getFeedPosts = permlink => {
    if (isNewsfeedType) {
      getObject(name).then(res => {
        dispatch(
          getObjectPosts({
            object: name,
            username: name,
            readLanguages: readLocales,
            limit,
            newsPermlink: res?.newsFeed?.permlink,
          }),
        );
        setNewsPermlink(res?.newsFeed?.permlink);
      });
    } else {
      dispatch(
        getObjectPosts({
          object: parentName || name,
          username: name,
          readLanguages: readLocales,
          limit,
          newsPermlink: permlink || getNewsPermlink(),
        }),
      );
    }
  };

  const getWobjPropos = () => getObjectsRewards(name, userName).then(res => setReward(res));

  const getNewsPermlink = () => {
    if (isEmpty(match.params[1]) || isNil(match.params[1])) return undefined;

    return newsPermlink;
  };

  useEffect(() => {
    if (wobject?.newsFeed && match.params[0] === 'newsfeed') {
      getFeedPosts(wobject?.newsFeed?.permlink);
    } else {
      getFeedPosts();
    }

    if (parentName) {
      getObject(parentName).then(wobj => {
        newsPerml = wobj?.newsFeed?.permlink;
        setNewsPermlink(newsPerml);
        getFeedPosts(newsPerml);
      });
    }
    getWobjPropos();
    setLoadingPropositions(false);
  }, [parentName]);

  const loadMoreContentAction = () => {
    dispatch(
      getMoreObjectPosts({
        username: name,
        authorPermlink: parentName || name,
        limit,
        skip,
        newsPermlink: isNewsfeedType ? newsPermlink : getNewsPermlink(),
      }),
    );
  };

  const handleShowPostModal = post => dispatch(showPostModal(post));

  return (
    <div className="object-feed">
      {loadingPropositions ? (
        <Loading />
      ) : (
        <React.Fragment>
          {!isEmpty(reward?.main) && <Campaing campain={reward.main} />}
          {!isEmpty(reward?.secondary) &&
            reward?.secondary?.map((proposition, i) => (
              <Proposition key={getPropositionsKey(proposition, i)} proposition={proposition} />
            ))}
          {!isEmpty(content) || isFetching ? (
            <Feed
              content={content}
              isFetching={isFetching}
              hasMore={hasMore}
              loadMoreContent={loadMoreContentAction}
              showPostModal={handleShowPostModal}
            />
          ) : (
            <div
              role="presentation"
              className="object-feed__row justify-center"
              onClick={handleCreatePost}
            >
              <FormattedMessage
                id="empty_object_profile"
                defaultMessage="Be the first to write a review"
              />
            </div>
          )}
        </React.Fragment>
      )}
      <PostModal />
    </div>
  );
};

ObjectFeed.propTypes = {
  wobject: PropTypes.shape(),
  limit: PropTypes.number,
  handleCreatePost: PropTypes.func,
  userName: PropTypes.string.isRequired,
};

ObjectFeed.defaultProps = {
  limit: 10,
  handleCreatePost: () => {},
};

export default ObjectFeed;
