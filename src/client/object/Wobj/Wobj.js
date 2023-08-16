import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import { getObjectName, getObjectType } from '../../../common/helpers/wObjectHelper';
import SocialProduct from '../../social-gifts/SocialProduct/SocialProduct';
import WidgetContent from '../../social-gifts/WidgetContent/WidgetContent';
import ObjectNewsFeed from '../../social-gifts/FeedMasonry/ObjectNewsFeed';
import Checklist from '../../social-gifts/Checklist/Checklist';
import Loading from '../../components/Icon/Loading';
import WobjectView from './WobjectView';
import { getHelmetIcon, getSiteName } from '../../../store/appStore/appSelectors';
import { useSeoInfo } from '../../../hooks/useSeoInfo';

const Wobj = ({
  authenticatedUserName: userName,
  wobject,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  appendAlbum,
  nestedWobject,
  isWaivio,
  supportedObjectTypes,
  isSocial,
  weightValue,
}) => {
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);

  useEffect(() => {
    if (!isWaivio) {
      const objectType = getObjectType(wobject);

      if (!isEmpty(wobject) && supportedObjectTypes.includes(objectType) && window?.gtag)
        window.gtag('event', `view_${objectType}`);
    }
  }, [wobject.author_permlink]);

  const getWobjView = useCallback(() => {
    const title = `${getObjectName(wobject)} - ${siteName}`;
    const { canonicalUrl, descriptionSite } = useSeoInfo();
    const desc = wobject?.description || descriptionSite || siteName;
    const image = favicon;

    if (isEmpty(wobject)) {
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
          <Loading margin />
        </React.Fragment>
      );
    }

    if (
      !isSocial ||
      !['book', 'product', 'person', 'business', 'widget', 'page', 'list', 'newsfeed'].includes(
        wobject.object_type,
      ) ||
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
        />
      );

    switch (wobject?.object_type) {
      case 'book':
      case 'product':
      case 'person':
      case 'business':
        return <SocialProduct toggleViewEditMode={toggleViewEditMode} />;
      case 'widget':
        return <WidgetContent wobj={wobject} />;
      case 'page':
      case 'list':
        return <Checklist />;
      case 'newsfeed':
        return <ObjectNewsFeed wobj={wobject} />;

      default:
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
  authenticatedUserName: PropTypes.string.isRequired,
  wobject: PropTypes.shape(),
  nestedWobject: PropTypes.shape(),
  supportedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool.isRequired,
  isWaivio: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  handleFollowClick: PropTypes.func,
  weightValue: PropTypes.number.isRequired,
  appendAlbum: PropTypes.func,
};

Wobj.defaultProps = {
  wobject: {},
  toggleViewEditMode: () => {},
  handleFollowClick: () => {},
  appendAlbum: () => {},
  supportedObjectTypes: [],
};

export default Wobj;
