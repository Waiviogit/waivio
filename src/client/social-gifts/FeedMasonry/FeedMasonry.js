import React from 'react';
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';
import InfiniteSroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';

import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';
import PostModal from '../../post/PostModalContainer';
import { breakpointColumnsObj } from './constants';

import './FeedMasonry.less';

const FeedMasonry = ({ loadMore, hasMore, posts, loading }) => {
  if (loading && isEmpty(posts))
    return (
      <div className="FeedMasonry__loading">
        <Loading />
      </div>
    );

  if (isEmpty(posts)) return <div className="FeedMasonry__emptyFeed">There are no posts yet</div>;

  return (
    <InfiniteSroll loader={<Loading />} hasMore={hasMore} loadMore={loadMore}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="FeedMasonry my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts?.map(post => (
          <FeedItem key={`${post.author}/${post?.permlink}`} photoQuantity={2} post={post} />
        ))}
      </Masonry>
      <PostModal />
    </InfiniteSroll>
  );
};

FeedMasonry.propTypes = {
  loadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  posts: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
};

export default FeedMasonry;
