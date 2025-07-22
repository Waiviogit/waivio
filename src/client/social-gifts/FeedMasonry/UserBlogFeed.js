import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import Masonry from 'react-masonry-css';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
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
import { getHelmetIcon, getMainObj, getSiteName } from '../../../store/appStore/appSelectors';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import FeedItem from './FeedItem';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import GoogleAds from '../../adsenseAds/GoogleAds';
import useAdLevelData from '../../../hooks/useAdsense';
import { getSettingsAds } from '../../../store/websiteStore/websiteSelectors';
import './FeedMasonry.less';

const limit = 25;

const UserBlogFeed = ({ user }) => {
  const [previews, setPreviews] = useState();
  const [firstLoading, setFirstLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const { name: userName } = useParams();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const dispatch = useDispatch();
  const name = userName || user;
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const unitCode = useSelector(getSettingsAds)?.displayUnitCode || '';
  const { frequency } = useAdLevelData();
  const title = `Blog`;
  const desc = mainObj?.description || siteName;
  const image = favicon;
  const { canonicalUrl } = useSeoInfo();
  const postsIds = getFeedFromState('blog', name, feed);
  const hasMore = getFeedHasMoreFromState('blog', name, feed);
  const isFetching = getFeedLoadingFromState('blog', name, feed);
  const posts = preparationPostList(postsIds, postsList);

  useEffect(() => {
    setFirstLoading(true);
    setPreviewLoading(true);
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
      {/* eslint-disable-next-line no-nested-ternary */}
      {firstLoading && previewLoading ? (
        <Loading margin />
      ) : !isEmpty(posts) ? (
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
            className={'FeedContainer FeedMasonry my-masonry-grid'}
            columnClassName="my-masonry-grid_column"
          >
            {posts?.flatMap((post, index) => {
              const urlPreview = isEmpty(previews)
                ? ''
                : previews?.find(i => i.url === post?.embeds?.[0]?.url)?.urlPreview;

              const elements = [
                <FeedItem
                  key={`${post.author}/${post.permlink}`}
                  preview={urlPreview}
                  photoQuantity={2}
                  post={post}
                />,
              ];

              if ((index + 1) % frequency === 0 && !isEmpty(unitCode)) {
                elements.push(
                  <div key={`google-ad-${index}`}>
                    <GoogleAds inFeed />
                  </div>,
                );
              }

              return elements;
            })}
          </Masonry>
          <PostModal />
        </ReduxInfiniteScroll>
      ) : (
        <div className="FeedMasonry__emptyFeed">
          <div>
            <FormattedMessage id="no_posts" defaultMessage="There are no posts." />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

UserBlogFeed.propTypes = {
  user: PropTypes.string,
};

UserBlogFeed.fetchData = ({ store, match }) =>
  store.dispatch(getUserProfileBlogPosts(match.params.name, { limit, initialLoad: true }));

export default UserBlogFeed;
