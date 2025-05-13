import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniq, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useLocation, useParams } from 'react-router';
import { Button } from 'antd';
import { shortenDescription, removeEmptyLines } from '../../object/wObjectHelper';
import FeedMasonry from './FeedMasonry';
import { getReadLanguages } from '../../../store/settingsStore/settingsSelectors';
import {
  getFeed,
  getTiktokPreviewFromState,
  getPreviewLoadingFromState,
  getFirstLoadingFromState,
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
  setFirstLoading,
} from '../../../store/feedStore/feedActions';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import {
  accessTypesArr,
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
  getTitleForLink,
  hasDelegation,
  haveAccess,
} from '../../../common/helpers/wObjectHelper';
import { preparationPostList } from './helpers';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import {
  getHelmetIcon,
  getSiteName,
  getUserAdministrator,
} from '../../../store/appStore/appSelectors';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import { setEditMode } from '../../../store/wObjectStore/wobjActions';

const limit = 25;
let skip = 25;

const ObjectNewsFeed = ({ wobj, intl, isNested }) => {
  const readLanguages = useSelector(getReadLanguages);
  const previews = useSelector(getTiktokPreviewFromState);
  const previewLoading = useSelector(getPreviewLoadingFromState);
  const firstLoading = useSelector(getFirstLoadingFromState);
  const [newsPermlink, setNewsPermlink] = useState(wobj?.newsFeed?.permlink);
  const [currObj, setCurrObj] = useState();
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const username = useSelector(getAuthenticatedUserName);
  const authenticated = useSelector(getIsAuthenticated);
  const isAdministrator = useSelector(getUserAdministrator);
  const accessExtend =
    (haveAccess(wobj || currObj, username, accessTypesArr[0]) && isAdministrator) ||
    hasDelegation(wobj || currObj, username);
  const dispatch = useDispatch();
  const { name } = useParams();
  const location = useLocation();
  const title = getTitleForLink(wobj);
  const { canonicalUrl, descriptionSite } = useSeoInfoWithAppUrl(wobj.canonical);
  const { firstDescrPart: description } = shortenDescription(
    removeEmptyLines(wobj?.description || descriptionSite),
    200,
  );
  const desc = description || descriptionSite || siteName;
  const image = getObjectAvatar(wobj) || favicon;
  const objName = isNested
    ? wobj?.author_permlink || getLastPermlinksFromHash(location.hash)
    : name || wobj?.author_permlink;

  const postsIds = uniq(getFeedFromState('objectPosts', objName, feed));
  const hasMore = getFeedHasMoreFromState('objectPosts', objName, feed);
  const isFetching = getFeedLoadingFromState('objectPosts', objName, feed);
  const posts = preparationPostList(postsIds, postsList);
  const editObjectClick = () => {
    dispatch(setEditMode(true));
  };
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
        dispatch(getTiktokPreviewAction(res.payload)).then(() => dispatch(setFirstLoading(false)));
      });
    } else {
      dispatch(getObject(objName)).then(res => {
        dispatch(
          getObjectPosts({
            object: objName,
            username: objName,
            limit,
            newsPermlink: res?.value?.newsFeed?.permlink,
          }),
        ).then(p => {
          dispatch(getTiktokPreviewAction(p.value)).then(() => dispatch(setFirstLoading(false)));
        });
        setNewsPermlink(res?.value?.newsFeed?.permlink);
        setCurrObj(res);
      });
    }
  };

  useEffect(() => {
    if (isEmpty(posts)) {
      getPostsList();
    } else {
      dispatch(setFirstLoading(false));
    }

    if (typeof window !== 'undefined' && window.gtag)
      window.gtag('event', getObjectName(getObjectName(wobj) || getObjectName(currObj)), {
        debug_mode: false,
      });
  }, [objName]);

  useEffect(
    () => () => {
      dispatch(setFirstLoading(true));
    },
    [name],
  );

  const loadMore = () => {
    try {
      dispatch(
        getMoreObjectPosts({
          username: objName,
          authorPermlink: objName,
          limit,
          skip,
          newsPermlink,
        }),
      ).then(res => dispatch(getTiktokPreviewAction(res.value)));
      skip += limit;
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
      {accessExtend && authenticated && (
        <div className="FeedMasonry__edit-container">
          <Button onClick={editObjectClick}>
            {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
          </Button>
        </div>
      )}
      <FeedMasonry
        objName={getObjectName(wobj) || getObjectName(currObj) || 'News feed'}
        description={wobj?.description || currObj?.description}
        posts={posts}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={isFetching || previewLoading}
        firstLoading={firstLoading}
        previews={previews}
        className="Feed"
      />
    </React.Fragment>
  );
};

ObjectNewsFeed.propTypes = {
  wobj: PropTypes.shape(),
  intl: PropTypes.shape(),
  isNested: PropTypes.bool,
};

export default injectIntl(ObjectNewsFeed);
