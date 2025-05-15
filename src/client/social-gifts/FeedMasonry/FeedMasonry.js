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

const FeedMasonry = ({
  loadMore,
  hasMore,
  posts,
  emptyLable,
  intl,
  writeReview,
  previews,
  firstLoading,
  isReviewsPage,
  className,
}) => {
  const getContent = () => {
    if (firstLoading) return <Loading margin />;
    if (isEmpty(posts))
      return (
        <div className="FeedMasonry__emptyFeed" onClick={writeReview}>
          {emptyLable ||
            intl.formatMessage({ id: 'empty_posts', defaultMessage: 'There are no posts yet' })}
        </div>
      );

    return (
      <InfiniteSroll
        initialLoad={false}
        threshold={2000}
        loader={<Loading />}
        hasMore={hasMore}
        loadMore={loadMore}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj(posts?.length)}
          className={`${className} FeedMasonry my-masonry-grid`}
          columnClassName="my-masonry-grid_column"
          key={'my-masonry-grid_column'}
        >
          {posts?.map(post => {
            const urlPreview = isEmpty(previews)
              ? ''
              : previews?.find(i => i.url === post?.embeds[0]?.url)?.urlPreview;

            return (
              <FeedItem
                isReviewsPage={isReviewsPage}
                preview={urlPreview}
                key={`${post.author}/${post?.permlink}`}
                photoQuantity={2}
                post={post}
              />
            );
          })}
        </Masonry>
        <PostModal />
      </InfiniteSroll>
    );
  };

  return <React.Fragment>{getContent()}</React.Fragment>;
};

FeedMasonry.propTypes = {
  loadMore: PropTypes.func,
  writeReview: PropTypes.func,
  hasMore: PropTypes.bool,
  isReviewsPage: PropTypes.bool,
  firstLoading: PropTypes.bool,
  emptyLable: PropTypes.string,
  className: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.shape({})),
  previews: PropTypes.arrayOf(PropTypes.shape({})),
  intl: PropTypes.shape(),
};

export default injectIntl(FeedMasonry);
