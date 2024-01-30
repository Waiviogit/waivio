import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniq, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useLocation, useParams } from 'react-router';
import FeedMasonry from './FeedMasonry';
import { getReadLanguages } from '../../../store/settingsStore/settingsSelectors';
import {
  getFeed,
  getTiktokPreviewFromState,
  getPreviewLoadingFromState,
} from '../../../store/feedStore/feedSelectors';
import {
  getFeedFromState,
  getFeedHasMoreFromState,
  getFeedLoadingFromState,
} from '../../../common/helpers/stateHelpers';
import {
  getMoreObjectPosts,
  getObjectPosts,
  getTiktokPreviewAction,
} from '../../../store/feedStore/feedActions';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import {
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import { preparationPostList } from './helpers';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';

const limit = 15;

const ObjectNewsFeed = ({ wobj }) => {
  const readLanguages = useSelector(getReadLanguages);
  const previews = useSelector(getTiktokPreviewFromState);
  const previewLoading = useSelector(getPreviewLoadingFromState);
  const [newsPermlink, setNewsPermlink] = useState(wobj?.newsFeed?.permlink);
  const [currObj, setCurrObj] = useState();
  const [firstLoading, setFirstLoading] = useState(false);
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const dispatch = useDispatch();
  const { name } = useParams();
  const location = useLocation();
  const title = `${getObjectName(wobj)}`;
  const { canonicalUrl, descriptionSite } = useSeoInfoWithAppUrl(wobj.canonical);
  const desc = wobj?.description || descriptionSite || siteName;
  const image = getObjectAvatar(wobj) || favicon;
  const objName = wobj?.author_permlink || getLastPermlinksFromHash(location.hash) || name;
  const postsIds = uniq(getFeedFromState('objectPosts', objName, feed));
  const hasMore = getFeedHasMoreFromState('objectPosts', objName, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', objName, feed);
  const posts = preparationPostList(postsIds, postsList);
  const getPostsList = () => {
    if (wobj) {
      dispatch(
        getObjectPosts({
          object: wobj.author_permlink,
          username: wobj.author_permlink,
          readLanguages,
          limit,
          newsPermlink: wobj?.newsFeed?.permlink,
        }),
      ).then(res => {
        dispatch(getTiktokPreviewAction(res.value)).then(() => setFirstLoading(false));
      });
    } else {
      dispatch(getObject(objName)).then(res => {
        dispatch(
          getObjectPosts({
            object: objName,
            username: objName,
            limit: 20,
            newsPermlink: res?.newsFeed?.permlink,
          }),
        ).then(() => {
          dispatch(getTiktokPreviewAction(res.value)).then(() => setFirstLoading(false));
        });
        setNewsPermlink(res?.newsFeed?.permlink);
        setCurrObj(res);
      });
    }
  };

  useEffect(() => {
    if (isEmpty(posts)) {
      setFirstLoading(true);
      getPostsList();
    }

    if (typeof window !== 'undefined' && window.gtag)
      window.gtag('event', getObjectName(getObjectName(wobj) || getObjectName(currObj)), {
        debug_mode: true,
      });
  }, [objName]);

  const loadMore = () => {
    try {
      dispatch(
        getMoreObjectPosts({
          username: objName,
          authorPermlink: objName,
          limit,
          skip: posts?.length,
          newsPermlink,
        }),
      ).then(res => dispatch(getTiktokPreviewAction(res.value)));
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
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
      <FeedMasonry
        objName={getObjectName(wobj) || getObjectName(currObj) || 'News feed'}
        description={wobj?.description || currObj?.description}
        posts={posts}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={isFetching || previewLoading}
        firstLoading={firstLoading}
        previews={previews}
      />
    </React.Fragment>
  );
};

ObjectNewsFeed.propTypes = {
  wobj: PropTypes.shape(),
};

export default ObjectNewsFeed;
