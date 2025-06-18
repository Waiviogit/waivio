import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, uniq } from 'lodash';
import Masonry from 'react-masonry-css';
import Helmet from 'react-helmet';

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
import { getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import { useSeoInfo } from '../../../hooks/useSeoInfo';

const limit = 20;

const WebsiteFeed = () => {
  const [firstLoading, setFirstLoading] = useState(false);
  const [previews, setPreviews] = useState();
  const [previewLoading, setPreviewLoading] = useState(false);

  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const title = `My feed - ${siteName}`;
  const desc = siteName;
  const image = favicon;
  const { canonicalUrl } = useSeoInfo();
  const postsIds = uniq(getUserFeedFromState(authUserName, feed));
  const hasMore = getFeedHasMoreFromState('feed', authUserName, feed);
  const isFetching = getUserFeedLoadingFromState(authUserName, feed);
  const posts = preparationPostList(postsIds, postsList);

  useEffect(() => {
    setFirstLoading(true);
    setPreviewLoading(true);
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

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={`@${siteName}`} />
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
      {firstLoading && previewLoading ? (
        <Loading margin />
      ) : (
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
      )}
    </React.Fragment>
  );
};

WebsiteFeed.fetchData = ({ store }) => store.dispatch(getUserFeedContent({ limit }));

export default WebsiteFeed;
