import { Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router';
import HtmlSandbox from '../../../components/HtmlSandbox';
import { appendObject } from '../../../store/appendStore/appendActions';
import { getAuthorityList } from '../../../store/appendStore/appendSelectors';
import { addAlbumToStore } from '../../../store/galleryStore/galleryActions';
import {
  getObject as getObjectState,
  getWobjectNested,
} from '../../../store/wObjectStore/wObjectSelectors';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import {
  getObjectAvatar,
  getObjectType,
  prepareAlbumData,
  prepareAlbumToStore,
  getTitleForLink,
  haveAccess,
  accessTypesArr,
  hasDelegation,
} from '../../../common/helpers/wObjectHelper';
import SocialProduct from '../../social-gifts/SocialProduct/SocialProduct';
import WidgetContent from '../../social-gifts/WidgetContent/WidgetContent';
import ObjectNewsFeed from '../../social-gifts/FeedMasonry/ObjectNewsFeed';
import Checklist from '../../social-gifts/Checklist/Checklist';
import Loading from '../../components/Icon/Loading';
import WobjectView from './WobjectView';
import {
  getHelmetIcon,
  getSiteName,
  getSiteTrusties,
  getUserAdministrator,
} from '../../../store/appStore/appSelectors';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import BusinessObject from '../../social-gifts/BusinessObject/BusinessObject';
import ObjectOfTypeWebpage from '../ObjectOfTypeWebpage/ObjectOfTypeWebpage';
import { getWobjectExpertise } from '../../../store/wObjectStore/wobjActions';
import WebsiteBody from '../../websites/WebsiteLayoutComponents/Body/WebsiteBody';
import ObjShop from '../../Shop/ObjShop';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

const Wobj = ({
  authenticatedUserName: userName,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  isSocial,
  weightValue,
  showPostModal,
  intl,
}) => {
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const wobject = useSelector(getObjectState);
  const nestedWobject = useSelector(getWobjectNested);
  const authenticated = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(typeof window !== 'undefined');
  const params = useParams();
  const location = useLocation();
  const appendAlbum = () => {
    const formData = {
      galleryAlbum: 'Photos',
    };

    const data = prepareAlbumData(formData, userName, wobject);
    const album = prepareAlbumToStore(data);

    const { author } = dispatch(appendObject(data));

    dispatch(addAlbumToStore({ ...album, author }));
  };

  useEffect(() => {
    setLoading(true);
  }, [params.name]);

  useEffect(() => {
    const objectType = getObjectType(wobject);
    const newsFilter = params[1] === 'newsFilter' ? { newsFilter: params.itemId } : {};

    if ((wobject.object_type !== 'map' && isSocial) || !isSocial) {
      wobject.author_permlink &&
        dispatch(getWobjectExpertise(newsFilter, wobject.author_permlink, isSocial));
    }
    if (!isEmpty(wobject) && typeof window !== 'undefined' && window?.gtag)
      window.gtag('event', `view_${objectType}`, { debug_mode: false });
    setLoading(false);
  }, [wobject.author_permlink]);

  const getWobjView = useCallback(() => {
    const title = getTitleForLink(wobject);
    const { canonicalUrl, descriptionSite } = useSeoInfoWithAppUrl(wobject.canonical);
    const canonical = `${canonicalUrl}${location.search}`;
    const desc = wobject?.description || descriptionSite || siteName;
    const image = getObjectAvatar(wobject) || favicon;
    const trusties = useSelector(getSiteTrusties);
    const authorityList = useSelector(getAuthorityList);
    const activeHeart = authorityList[wobject.author_permlink];
    const isAdministrator = useSelector(getUserAdministrator);
    const isTrusty = trusties?.includes(userName);

    const accessExtend =
      (haveAccess(wobject, userName, accessTypesArr[0]) && isAdministrator) ||
      hasDelegation(wobject, userName) ||
      (activeHeart && isTrusty);

    if (isEmpty(wobject) || loading) {
      return (
        <React.Fragment>
          <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <link rel="canonical" href={canonical} />
            <meta name="description" content={desc} />
            <meta name="twitter:card" content={'summary_large_image'} />
            <meta name="twitter:site" content={`@${siteName}`} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={image} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="600" />
            <meta property="og:description" content={desc} />
            <meta property="og:site_name" content={siteName} />
            <link rel="image_src" href={image} />
            <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
          </Helmet>
          <Loading margin />
        </React.Fragment>
      );
    }

    if (
      !isSocial ||
      ![
        'book',
        'product',
        'service',
        'business',
        'place',
        'restaurant',
        'person',
        'widget',
        'page',
        'list',
        'newsfeed',
        'webpage',
        'map',
        'link',
        'recipe',
        'shop',
        'html',
      ]?.includes(wobject.object_type) ||
      (isSocial && isEditMode)
    )
      return (
        <WobjectView
          authenticatedUserName={userName}
          wobject={wobject}
          isEditMode={isEditMode}
          toggleViewEditMode={toggleViewEditMode}
          route={route}
          handleFollowClick={handleFollowClick}
          appendAlbum={appendAlbum}
          nestedWobject={nestedWobject}
          weightValue={weightValue}
          showPostModal={showPostModal}
        />
      );

    switch (wobject?.object_type) {
      case 'book':
      case 'product':
      case 'recipe':
        return (
          <SocialProduct
            showPostModal={showPostModal}
            toggleViewEditMode={toggleViewEditMode}
            params={params}
          />
        );
      case 'business':
      case 'place':
      case 'restaurant':
      case 'service':
      case 'link':
      case 'person':
        return <BusinessObject toggleViewEditMode={toggleViewEditMode} />;
      case 'widget':
        return <WidgetContent wobj={wobject} />;
      case 'html': {
        // eslint-disable-next-line no-console
        console.log(getObjectAvatar(wobject));

        return (
          <React.Fragment>
            <Helmet>
              <title>{title}</title>
              <meta property="og:title" content={title} />
              <link rel="canonical" href={canonical} />
              <meta name="description" content={desc} />
              <meta name="twitter:card" content={'summary_large_image'} />
              <meta name="twitter:site" content={`@${siteName}`} />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={desc} />
              <meta name="twitter:image" content={image} />
              <meta property="og:title" content={title} />
              <meta property="og:type" content="article" />
              <meta property="og:url" content={canonical} />
              <meta property="og:image" content={image} />
              <meta property="og:image:width" content="600" />
              <meta property="og:image:height" content="600" />
              <meta property="og:description" content={desc} />
              <meta property="og:site_name" content={siteName} />
              <link rel="image_src" href={image} />
              <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
            </Helmet>
            <div style={{ position: 'relative' }}>
              {accessExtend && authenticated && (
                <Button
                  onClick={toggleViewEditMode}
                  style={{ position: 'absolute', left: '20px', top: '70px', zIndex: 10 }}
                >
                  {isEditMode
                    ? intl.formatMessage({ id: 'view', defaultMessage: 'View' })
                    : intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
                </Button>
              )}
              <HtmlSandbox fullPage wobject={wobject} html={wobject.code} />
            </div>
          </React.Fragment>
        );
      }
      case 'page':
      case 'list':
        return <Checklist />;
      case 'webpage':
        return <ObjectOfTypeWebpage />;
      case 'map':
        return <WebsiteBody isSocial={isSocial} />;
      case 'newsfeed':
        return <ObjectNewsFeed wobj={wobject} />;
      case 'shop':
        return <ObjShop isSocial={isSocial} />;

      default:
        return (
          <React.Fragment>
            <Helmet>
              <title>{title}</title>
              <meta property="og:title" content={title} />
              <link rel="canonical" href={canonical} />
              <meta name="description" content={desc} />
              <meta name="twitter:card" content={'summary_large_image'} />
              <meta name="twitter:site" content={`@${siteName}`} />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={desc} />
              <meta name="twitter:image" content={image} />
              <meta property="og:title" content={title} />
              <meta property="og:type" content="article" />
              <meta property="og:url" content={canonical} />
              <meta property="og:image" content={image} />
              <meta property="og:image:width" content="600" />
              <meta property="og:image:height" content="600" />
              <meta property="og:description" content={desc} />
              <meta property="og:site_name" content={siteName} />
              <link rel="image_src" href={image} />
              <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
            </Helmet>
          </React.Fragment>
        );
    }
  }, [
    wobject,
    userName,
    isEditMode,
    toggleViewEditMode,
    route,
    handleFollowClick,
    appendAlbum,
    nestedWobject,
    toggleViewEditMode,
  ]);

  return (
    <div className="main-panel">
      <ScrollToTopOnMount />
      {getWobjView()}
    </div>
  );
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string,
  isEditMode: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool,
  showPostModal: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  handleFollowClick: PropTypes.func,
  weightValue: PropTypes.number,
};

Wobj.defaultProps = {
  wobject: {},
  toggleViewEditMode: () => {},
  handleFollowClick: () => {},
};

export default injectIntl(Wobj);
