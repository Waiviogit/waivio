import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Masonry from 'react-masonry-css';
import { getUserProfileBlogPosts } from '../../../store/feedStore/feedActions';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';
import PostModal from '../../post/PostModalContainer';
import { breakpointColumnsObj, preparationPostList } from './helpers';

const limit = 25;

const UserBlogFeed = () => {
  const { name } = useParams();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();

  const postsIds = getFeedFromState('blog', name, feed);
  const hasMore = getFeedHasMoreFromState('blog', name, feed);
  const isFetching = getFeedLoadingFromState('blog', name, feed);
  const posts = preparationPostList(postsIds, postsList);

  useEffect(() => {
    dispatch(getUserProfileBlogPosts(name, { limit, initialLoad: true }));
  }, [name]);

  const loadMore = () => {
    dispatch(
      getUserProfileBlogPosts(name, {
        limit,
        initialLoad: false,
      }),
    );
  };

  return (
    <ReduxInfiniteScroll
      className="Feed"
      loadMore={loadMore}
      loader={<Loading />}
      loadingMore={isFetching}
      hasMore={hasMore}
      elementIsScrollable={false}
      threshold={1500}
    >
      <Masonry
        breakpointCols={breakpointColumnsObj(posts?.length)}
        className="FeedMasonry my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts?.map(post => (
          <FeedItem key={`${post.author}/${post?.permlink}`} photoQuantity={2} post={post} />
        ))}
      </Masonry>
      <PostModal />
    </ReduxInfiniteScroll>
  );
};

export default UserBlogFeed;
