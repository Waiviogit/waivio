import React from 'react';
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';
import InfiniteSroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Helmet from 'react-helmet';

import { getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';
import PostModal from '../../post/PostModalContainer';
import { breakpointColumnsObj } from './helpers';

import './FeedMasonry.less';

const FeedMasonry = ({ loadMore, hasMore, posts, loading, emptyLable, intl }) => {
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const title = siteName;
  const desc = siteName;
  const image = favicon;
  const canonicalUrl = typeof location !== 'undefined' && location?.origin;

  if (loading && isEmpty(posts)) return <Loading margin />;

  if (isEmpty(posts))
    return (
      <div className="FeedMasonry__emptyFeed">
        {emptyLable ||
          intl.formatMessage({ id: 'empty_posts', defaultMessage: 'There are no posts yet' })}
      </div>
    );

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
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
    </React.Fragment>
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
