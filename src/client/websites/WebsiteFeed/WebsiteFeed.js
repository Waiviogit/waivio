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
  const [firstLoading, setFirstLoading] = useState(false);
  const [previews, setPreviews] = useState();
  const [previewLoading, setPreviewLoading] = useState(true);

  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();

  const postsIds = uniq(getUserFeedFromState(authUserName, feed));
  const hasMore = getFeedHasMoreFromState('feed', authUserName, feed);
  const isFetching = getUserFeedLoadingFromState(authUserName, feed);
  const posts = preparationPostList(postsIds, postsList);

  useEffect(() => {
    setFirstLoading(true);
    dispatch(getUserFeedContent({ userName: authUserName, limit })).then(res => {
      setFirstLoading(false);
      preparationPreview(res.value, setPreviews).then(() => {
        setPreviewLoading(false);
      });
    });
  }, []);

  const loadMore = () => {
    setPreviewLoading(true);

    dispatch(getMoreUserFeedContent({ userName: authUserName, limit })).then(res =>
      preparationPreview(res.value, setPreviews, previews).then(() => setPreviewLoading(false)),
    );
  };

  if (firstLoading && previewLoading) return <Loading margin />;

  return (
    <ReduxInfiniteScroll
      className="Feed"
      loadMore={loadMore}
      loader={<Loading />}
      loadingMore={isFetching || previewLoading}
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
            : previews?.find(i => i.url === post?.embeds[0].url)?.urlPreview;

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

WebsiteFeed.fetchData = ({ store }) => store.dispatch(getUserFeedContent({ limit }));

export default WebsiteFeed;
