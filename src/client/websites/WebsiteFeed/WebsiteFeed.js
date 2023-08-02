import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, uniq } from 'lodash';
import Masonry from 'react-masonry-css';

import { getFeed } from '../../../store/feedStore/feedSelectors';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import {
  getFeedHasMoreFromState,
  getUserFeedFromState,
  getUserFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import {
  breakpointColumnsObj,
  preparationPostList,
  preparationPreview,
} from '../../social-gifts/FeedMasonry/helpers';
import { getMoreUserFeedContent, getUserFeedContent } from '../../../store/feedStore/feedActions';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import FeedItem from '../../social-gifts/FeedMasonry/FeedItem';
import PostModal from '../../post/PostModalContainer';

const limit = 20;

const WebsiteFeed = () => {
  const [firstLoading, setFirstLoading] = useState(true);
  const [previews, setPreviews] = useState();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();

  const postsIds = uniq(getUserFeedFromState(authUserName, feed));
  const hasMore = getFeedHasMoreFromState('feed', authUserName, feed);
  const isFetching = getUserFeedLoadingFromState(authUserName, feed);
  const posts = preparationPostList(postsIds, postsList);

  useEffect(() => {
    dispatch(getUserFeedContent({ userName: authUserName, limit })).then(res => {
      setFirstLoading(false);
      preparationPreview(res.value.posts, setPreviews);
    });
  }, []);

  const loadMore = () =>
    dispatch(getMoreUserFeedContent({ userName: authUserName, limit })).then(res =>
      preparationPreview(res.value.posts, setPreviews, previews),
    );

  if (isEmpty(posts) && firstLoading) return <Loading margin />;

  return (
    <ReduxInfiniteScroll
      className="Feed"
      loadMore={loadMore}
      loader={<Loading />}
      loadingMore={isFetching}
      hasMore={hasMore}
      elementIsScrollable={false}
      threshold={3000}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj(posts?.length)}
        className="FeedMasonry my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts?.map(post => {
          const urlPreview = isEmpty(previews)
            ? ''
            : previews?.find(i => i.url === post?.embeds[0].url).urlPreview;

          return (
            <FeedItem
              preview={urlPreview}
              key={`${post.author}/${post?.permlink}`}
              photoQuantity={2}
              post={post}
            />
          );
        })}
      </Masonry>
      <PostModal />
    </ReduxInfiniteScroll>
  );
};

export default WebsiteFeed;
