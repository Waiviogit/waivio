import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniq } from 'lodash';
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
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

const ObjectNewsFeed = ({ wobj }) => {
  const readLanguages = useSelector(getReadLanguages);
  const feed = useSelector(getFeed);
  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const objectFeed = getFeedFromState('objectPosts', objName, feed);
  const postsIds = uniq(objectFeed);
  const dispatch = useDispatch();
  const hasMore = getFeedHasMoreFromState('objectPosts', objName, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', objName, feed);
  const [newsPermlink, setNewsPermlink] = useState();

  const postsList = useSelector(getPosts);
  const posts = postsIds.reduce((acc, curr) => [...acc, postsList[curr]], []);

  const getPostsList = () => {
    if (wobj) {
      dispatch(
        getObjectPosts({
          object: wobj.author_permlink,
          username: wobj.author_permlink,
          readLanguages,
          limit: 20,
          newsPermlink: wobj?.newsFeed?.permlink,
        }),
      );
      setNewsPermlink(wobj?.newsFeed?.permlink);
    } else {
      getObject(objName).then(res => {
        dispatch(
          getObjectPosts({
            object: objName,
            username: objName,
            readLanguages,
            limit: 20,
            newsPermlink: res?.newsFeed?.permlink,
          }),
        );
        setNewsPermlink(res?.newsFeed?.permlink);
      });
    }
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

ObjectNewsFeed.propTypes = {
  wobj: PropTypes.shape(),
};

export default ObjectNewsFeed;
