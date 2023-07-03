import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniq } from 'lodash';
import { useLocation, useParams } from 'react-router';
import FeedMasonry from './FeedMasonry';
import { getObject } from '../../../waivioApi/ApiClient';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getMoreObjectPosts, getObjectPosts } from '../../../store/feedStore/feedActions';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

const ObjectNewsFeed = () => {
  const [newsPermlink, setNewsPermlink] = useState();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();

  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;

  const postsIds = uniq(getFeedFromState('objectPosts', objName, feed));
  const hasMore = getFeedHasMoreFromState('objectPosts', objName, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', objName, feed);
  const posts = postsIds.reduce((acc, curr) => [...acc, postsList[curr]], []);

  const getPostsList = () => {
    getObject(objName).then(res => {
      dispatch(
        getObjectPosts({
          object: objName,
          username: objName,
          limit: 20,
          newsPermlink: res?.newsFeed?.permlink,
        }),
      );
      setNewsPermlink(res?.newsFeed?.permlink);
    });
  };

  useEffect(() => {
    getPostsList();
  }, [objName]);

  const loadMore = () =>
    dispatch(
      getMoreObjectPosts({
        username: objName,
        authorPermlink: objName,
        limit: 20,
        skip: posts?.length,
        newsPermlink,
      }),
    );

  return <FeedMasonry posts={posts} hasMore={hasMore} loadMore={loadMore} loading={isFetching} />;
};

export default ObjectNewsFeed;