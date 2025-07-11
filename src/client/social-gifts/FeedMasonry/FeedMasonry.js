import React from 'react';
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';
import InfiniteSroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';
import PostModal from '../../post/PostModalContainer';
import { breakpointColumnsObj } from './helpers';
import GoogleAds from '../../adsenseAds/GoogleAds';
import { getSettingsAds } from '../../../store/websiteStore/websiteSelectors';
import { adIntensityLevels } from '../../websites/WebsiteTools/AdSenseAds/AdSenseAds';

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
  const adSenseSettings = useSelector(getSettingsAds);
  const adFrequency = adIntensityLevels?.find(l => l.key === adSenseSettings?.level)?.frequency;

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
          {posts?.flatMap((post, index) => {
            const elements = [];

            const urlPreview = isEmpty(previews)
              ? ''
              : previews?.find(i => i.url === post?.embeds?.[0]?.url)?.urlPreview;

            elements.push(
              <div key={`${post.author}/${post.permlink}`}>
                <FeedItem
                  isReviewsPage={isReviewsPage}
                  preview={urlPreview}
                  photoQuantity={2}
                  post={post}
                />
              </div>,
            );

            if ((index + 1) % adFrequency === 0) {
              elements.push(
                // eslint-disable-next-line react/no-array-index-key
                <div key={`google-ad-${index}`}>
                  <GoogleAds inFeed />{' '}
                </div>,
              );
            }

            return elements;
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
