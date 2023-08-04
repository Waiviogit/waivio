import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Helmet } from 'react-helmet/es/Helmet';
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileBlogPosts } from '../../../store/feedStore/feedActions';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import PostModal from '../../post/PostModalContainer';
import { breakpointColumnsObj, preparationPostList, preparationPreview } from './helpers';
import { getAppUrl, getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';

const limit = 25;

const UserBlogFeed = () => {
  const { name } = useParams();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const appUrl = useSelector(getAppUrl);
  const location = useLocation();
  const [previews, setPreviews] = useState();
  const [firstLoading, setFirstLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(true);
  const title = `Blog - ${siteName}`;
  const desc = siteName;
  const image = favicon;
  const canonicalUrl = `${appUrl}${location.pathname}`;

  const postsIds = getFeedFromState('blog', name, feed);
  const hasMore = getFeedHasMoreFromState('blog', name, feed);
  const isFetching = getFeedLoadingFromState('blog', name, feed);
  const posts = preparationPostList(postsIds, postsList);

  useEffect(() => {
    dispatch(getUserProfileBlogPosts(name, { limit, initialLoad: true })).then(res => {
      setFirstLoading(false);
      preparationPreview(res.value.posts, setPreviews).then(() => setPreviewLoading(false));
    });
  }, [name]);

  const loadMore = () => {
    setPreviewLoading(true);
    dispatch(
      getUserProfileBlogPosts(name, {
        limit,
        initialLoad: false,
      }),
    ).then(res =>
      preparationPreview(res.value.posts, setPreviews, previews).then(() =>
        setPreviewLoading(false),
      ),
    );
  };

  if (firstLoading && previewLoading) return <Loading margin />;

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
        loadingMore={isFetching || previewLoading}
        hasMore={hasMore}
        elementIsScrollable={false}
        threshold={2500}
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
                key={`${post.author}/${post?.permlink}`}
                preview={urlPreview}
                photoQuantity={2}
                post={post}
              />
            );
          })}
        </Masonry>
        <PostModal />
      </ReduxInfiniteScroll>
    </React.Fragment>
  );
};

export default UserBlogFeed;
