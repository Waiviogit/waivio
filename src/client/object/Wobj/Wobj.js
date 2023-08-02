import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { isEmpty, round, reduce } from 'lodash';
import DEFAULTS from '../const/defaultValues';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import {
  getObjectAvatar,
  getObjectType,
  hasType,
  parseAddress,
} from '../../../common/helpers/wObjectHelper';
import { compareObjectTitle } from '../../../common/helpers/seoHelpes';
import SocialProduct from '../../social-gifts/SocialProduct/SocialProduct';
import WidgetContent from '../../social-gifts/WidgetContent/WidgetContent';
import ObjectNewsFeed from '../../social-gifts/FeedMasonry/ObjectNewsFeed';
import Checklist from '../../social-gifts/Checklist/Checklist';
import WobjectView from './WobjectView';
import Loading from '../../components/Icon/Loading';

const Wobj = ({
  authenticatedUserName: userName,
  match,
  wobject,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  objectName,
  appendAlbum,
  helmetIcon,
  nestedWobject,
  isWaivio,
  supportedObjectTypes,
  weightValue,
  siteName,
  appUrl,
  isSocial,
}) => {
  const image = getObjectAvatar(wobject) || DEFAULTS.AVATAR;
  const canonicalUrl = `${appUrl}/object/${match.params.name}`;
  const url = `${appUrl}/object/${match.params.name}`;
  const address = parseAddress(wobject);
  const titleText = compareObjectTitle(isWaivio, objectName, address, siteName);
  const rank = hasType(wobject, 'restaurant') ? `Restaurant rank: ${round(weightValue, 2)}.` : '';
  const tagCategories = reduce(
    wobject.tagCategory,
    (acc, curr) => {
      const currentCategory = !isEmpty(curr.items)
        ? `${curr.body}: ${curr.items.map(item => item.body).join(', ')}`
        : '';

      return acc ? `${acc}. ${currentCategory}` : currentCategory;
    },
    '',
  );

  const desc = `${objectName}. ${rank} ${parseAddress(wobject) || ''} ${wobject.description ||
    ''} ${tagCategories}`;

  useEffect(() => {
    if (!isWaivio) {
      const objectType = getObjectType(wobject);

      if (!isEmpty(wobject) && supportedObjectTypes.includes(objectType) && window.gtag)
        window.gtag('event', `view_${objectType}`);
    }
  }, [wobject.author_permlink]);

  const getWobjView = useCallback(() => {
    if (isEmpty(wobject)) return <Loading />;

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
        />
      );

    switch (wobject?.object_type) {
      case 'book':
      case 'product':
      case 'person':
      case 'business':
        return <SocialProduct toggleViewEditMode={toggleViewEditMode} />;
      case 'widget':
        return <WidgetContent />;
      case 'page':
      case 'list':
        return <Checklist />;
      case 'newsfeed':
        return <ObjectNewsFeed />;

      default:
        return null;
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
      <Helmet>
        <title>{titleText}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="description" content={desc} />
        <meta property="og:title" content={titleText} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:image:url" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${siteName}`} />
        <meta name="twitter:title" content={titleText} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" property="twitter:image" content={image} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
      <ScrollToTopOnMount />
      {getWobjView()}
    </div>
  );
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  nestedWobject: PropTypes.shape(),
  supportedObjectTypes: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool.isRequired,
  isWaivio: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  handleFollowClick: PropTypes.func,
  objectName: PropTypes.string.isRequired,
  helmetIcon: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  appUrl: PropTypes.string.isRequired,
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
