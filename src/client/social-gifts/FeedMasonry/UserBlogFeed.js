import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet/es/Helmet';
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
import { getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';

const limit = 25;

const UserBlogFeed = () => {
  const { name } = useParams();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const title = `Blog - ${siteName}`;
  const desc = siteName;
  const image = favicon;
  const canonicalUrl = typeof location !== 'undefined' && location?.origin;

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
      <ReduxInfiniteScroll
        className="Feed"
        loadMore={loadMore}
        loader={<Loading />}
        loadingMore={isFetching}
        hasMore={hasMore}
        elementIsScrollable={false}
        threshold={2500}
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
    </React.Fragment>
  );
};

export default UserBlogFeed;
