import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, uniq } from 'lodash';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router';
import FeedMasonry from './FeedMasonry';
import { getObject } from '../../../waivioApi/ApiClient';
import { getReadLanguages } from '../../../store/settingsStore/settingsSelectors';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getMoreObjectPosts, getObjectPosts } from '../../../store/feedStore/feedActions';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import { getLastPermlinksFromHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { preparationPostList, preparationPreview } from './helpers';
import Loading from '../../components/Icon/Loading';

const limit = 15;

const ObjectNewsFeed = ({ wobj }) => {
  const readLanguages = useSelector(getReadLanguages);
  const [newsPermlink, setNewsPermlink] = useState();
  const [currObj, setCurrObj] = useState();
  const [previews, setPreviews] = useState();
  const [firstLoading, setFirstLoading] = useState(true);
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();
  const { name } = useParams();
  const location = useLocation();

  const objName = wobj?.author_permlink || getLastPermlinksFromHash(location.hash) || name;
  const postsIds = uniq(getFeedFromState('objectPosts', objName, feed));
  const hasMore = getFeedHasMoreFromState('objectPosts', objName, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', objName, feed);
  const posts = preparationPostList(postsIds, postsList);

  const getPostsList = () => {
    if (wobj) {
      dispatch(
        getObjectPosts({
          object: wobj.author_permlink,
          username: wobj.author_permlink,
          readLanguages,
          limit,
          newsPermlink: wobj?.newsFeed?.permlink,
        }),
      ).then(res => {
        setFirstLoading(false);
        preparationPreview(res.value?.posts, setPreviews);
      });
      setNewsPermlink(wobj?.newsFeed?.permlink);
    } else {
      getObject(objName).then(res => {
        dispatch(
          getObjectPosts({
            object: objName,
            username: objName,
            limit: 20,
            newsPermlink: res?.newsFeed?.permlink,
          }),
        ).then(result => preparationPreview(result.value, setPreviews));
        setNewsPermlink(res?.newsFeed?.permlink);
        setCurrObj(res);
      });
    }
  };

  useEffect(() => {
    getPostsList();
  }, [objName]);

  const loadMore = () => {
    try {
      dispatch(
        getMoreObjectPosts({
          username: objName,
          authorPermlink: objName,
          limit,
          skip: posts?.length,
          newsPermlink,
        }),
      ).then(res => {
        preparationPreview(res.value, setPreviews, previews);
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

  if (isEmpty(posts) && firstLoading) return <Loading margin />;

  return (
    <FeedMasonry
      objName={getObjectName(wobj) || getObjectName(currObj)}
      posts={posts}
      hasMore={hasMore}
      loadMore={loadMore}
      loading={isFetching}
      previews={previews}
    />
  );
};

ObjectNewsFeed.propTypes = {
  wobj: PropTypes.shape(),
};

export default ObjectNewsFeed;
