import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { get, isEmpty, round, reduce, isNil } from 'lodash';
import { renderRoutes } from 'react-router-config';
import DEFAULTS from '../const/defaultValues';
import ScrollToTopOnMount from '../../components/Utils/ScrollToTopOnMount';
import WobjHero from '../WobjHero';
import Affix from '../../components/Utils/Affix';
import LeftObjectProfileSidebar from '../../app/Sidebar/LeftObjectProfileSidebar';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ObjectsRelated from '../../components/Sidebar/ObjectsRelated/index';
import {
  getObjectAvatar,
  getObjectType,
  hasType,
  parseAddress,
} from '../../../common/helpers/wObjectHelper';
import OBJECT_TYPE from '../const/objectTypes';
import { formColumnsField } from '../../../common/constants/listOfFields';
import WobjectSidebarFollowers from '../../app/Sidebar/ObjectInfoExperts/WobjectSidebarFollowers';
import WobjectNearby from '../../app/Sidebar/ObjectInfoExperts/WobjectNearby';
import { compareObjectTitle } from '../../../common/helpers/seoHelpes';
import WobjectShopFilter from '../ObjectTypeShop/WobjectShopFilter';
import ObjectsAddOn from '../../components/Sidebar/ObjectsAddOn/ObjectsAddOn';
import ObjectsSimilar from '../../components/Sidebar/ObjectsSimilar/ObjectsSimilar';
import ObjectReference from '../../components/Sidebar/ObjectReference/ObjectReference';
import { isMobile } from '../../../common/helpers/apiHelpers';
import SocialProduct from '../../social-gifts/SocialProduct/SocialProduct';
import WidgetContent from '../../social-gifts/WidgetContent/WidgetContent';
import ObjectNewsFeed from '../../social-gifts/FeedMasonry/ObjectNewsFeed';
import Checklist from '../../social-gifts/Checklist/Checklist';

const Wobj = ({
  authenticated,
  authenticatedUserName: userName,
  match,
  wobject,
  history,
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
  const referenceWobjType = ['business', 'person'].includes(wobject.object_type) && !isMobile();
  const albumsAndImagesCount = wobject.albums_count;
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
  const formsList = get(wobject, 'form', []);
  const currentForm = formsList?.find(item => item?.permlink === match.params.parentName) || {};
  const currentWobject = history.location.hash ? nestedWobject : wobject;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);
  const isWidgetPage = isNil(match.params[0]) && match.params[1] === 'widget';
  const currentColumn = get(currentForm, 'column', '');
  const currentWidgetColumn = get(widgetForm, 'column', '');
  const middleRightColumn =
    currentColumn === formColumnsField.middleRight ||
    (currentWidgetColumn === formColumnsField.middleRight && isWidgetPage);
  const entireColumn =
    currentColumn === formColumnsField.entire ||
    (currentWidgetColumn === formColumnsField.entire && isWidgetPage);
  const leftSidebarClassList = classNames('leftContainer leftContainer__wobj', {
    'leftContainer--left': entireColumn,
  });
  const rightSidebarClassList = classNames('wobjRightContainer', {
    'wobjRightContainer--right':
      hasType(wobject, OBJECT_TYPE.PAGE) || middleRightColumn || entireColumn,
  });
  const centerClassList = classNames('center', {
    'center--page': hasType(wobject, OBJECT_TYPE.PAGE),
    'center--middleForm': middleRightColumn,
    'center--fullForm': entireColumn,
  });

  useEffect(() => {
    if (!isWaivio) {
      const objectType = getObjectType(wobject);

      if (!isEmpty(wobject) && supportedObjectTypes.includes(objectType) && window.gtag)
        window.gtag('event', `view_${objectType}`);
    }
  }, [wobject.author_permlink]);

  const getWobjView = () => {
    switch (wobject?.object_type) {
      case 'book':
      case 'product':
        return <SocialProduct toggleViewEditMode={toggleViewEditMode} />;
      case 'widget':
        return <WidgetContent />;
      case 'page':
      case 'list':
        return <Checklist />;
      case 'newsfeed':
        return <ObjectNewsFeed />;

      default:
        return (
          <React.Fragment>
            <WobjHero
              isEditMode={isEditMode}
              authenticated={authenticated}
              isFetching={isEmpty(wobject)}
              wobject={wobject}
              username={objectName}
              onFollowClick={handleFollowClick}
              toggleViewEditMode={toggleViewEditMode}
              albumsAndImagesCount={albumsAndImagesCount}
              appendAlbum={appendAlbum}
            />
            <div className="shifted">
              <div className="container feed-layout">
                <Affix key={match.params.name} className={leftSidebarClassList} stickPosition={72}>
                  <div className="left">
                    <LeftObjectProfileSidebar
                      isEditMode={isEditMode}
                      wobject={wobject}
                      userName={userName}
                      history={history}
                      appendAlbum={appendAlbum}
                    />
                  </div>
                </Affix>
                {wobject.author_permlink && (
                  <Affix className={rightSidebarClassList} stickPosition={72}>
                    {match.url.includes('/shop') ? (
                      <WobjectShopFilter />
                    ) : (
                      <React.Fragment>
                        <ObjectsRelated wobject={wobject} />
                        <ObjectsAddOn wobject={wobject} />
                        <ObjectsSimilar wobject={wobject} />
                        {referenceWobjType && <ObjectReference wobject={wobject} />}
                        <ObjectExpertise wobject={wobject} />
                        {wobject.map && <WobjectNearby wobject={wobject} />}
                        <WobjectSidebarFollowers wobject={wobject} />
                      </React.Fragment>
                    )}
                  </Affix>
                )}
                <div className={centerClassList}>
                  {renderRoutes(route.routes, {
                    isEditMode,
                    wobject,
                    userName,
                    match,
                    toggleViewEditMode,
                    appendAlbum,
                    currentForm,
                    route,
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
    }
  };

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
      {isSocial && !isEditMode ? (
        getWobjView()
      ) : (
        <React.Fragment>
          <WobjHero
            isEditMode={isEditMode}
            authenticated={authenticated}
            isFetching={isEmpty(wobject)}
            wobject={wobject}
            username={objectName}
            onFollowClick={handleFollowClick}
            toggleViewEditMode={toggleViewEditMode}
            albumsAndImagesCount={albumsAndImagesCount}
            appendAlbum={appendAlbum}
          />
          <div className="shifted">
            <div className="container feed-layout">
              <Affix key={match.params.name} className={leftSidebarClassList} stickPosition={72}>
                <div className="left">
                  <LeftObjectProfileSidebar
                    isEditMode={isEditMode}
                    wobject={wobject}
                    userName={userName}
                    history={history}
                    appendAlbum={appendAlbum}
                  />
                </div>
              </Affix>
              {wobject.author_permlink && (
                <Affix className={rightSidebarClassList} stickPosition={72}>
                  {match.url.includes('/shop') ? (
                    <WobjectShopFilter />
                  ) : (
                    <React.Fragment>
                      <ObjectsRelated wobject={wobject} />
                      <ObjectsAddOn wobject={wobject} />
                      <ObjectsSimilar wobject={wobject} />
                      {referenceWobjType && <ObjectReference wobject={wobject} />}
                      <ObjectExpertise wobject={wobject} />
                      {wobject.map && <WobjectNearby wobject={wobject} />}
                      <WobjectSidebarFollowers wobject={wobject} />
                    </React.Fragment>
                  )}
                </Affix>
              )}
              <div className={centerClassList}>
                {renderRoutes(route.routes, {
                  isEditMode,
                  wobject,
                  userName,
                  match,
                  toggleViewEditMode,
                  appendAlbum,
                  currentForm,
                  route,
                })}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

Wobj.propTypes = {
  route: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  nestedWobject: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
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
