import React from 'react';
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';
import InfiniteSroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';
import PostModal from '../../post/PostModalContainer';
import { breakpointColumnsObj } from './helpers';

import './FeedMasonry.less';

const FeedMasonry = ({ loadMore, hasMore, posts, loading, emptyLable, intl }) => {
  if (loading && isEmpty(posts)) return <Loading margin />;

  if (isEmpty(posts))
    return (
      <div className="FeedMasonry__emptyFeed">
        {emptyLable ||
          intl.formatMessage({ id: 'empty_posts', defaultMessage: 'There are no posts yet' })}
      </div>
    );

  return (
    <InfiniteSroll threshold={3000} loader={<Loading />} hasMore={hasMore} loadMore={loadMore}>
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
    </InfiniteSroll>
  );
};

FeedMasonry.propTypes = {
  loadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  emptyLable: PropTypes.bool,
  posts: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
  intl: PropTypes.shape(),
};

export default injectIntl(FeedMasonry);
