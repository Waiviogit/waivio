import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import classNames from 'classnames';
import { get, isEmpty, isNil, reduce, round } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import WobjHero from '../WobjHero';
import Affix from '../../components/Utils/Affix';
import LeftObjectProfileSidebar from '../../app/Sidebar/LeftObjectProfileSidebar';
import WobjectShopFilter from '../ObjectTypeShop/WobjectShopFilter';
import ObjectsRelated from '../../components/Sidebar/ObjectsRelated/index';
import ObjectsAddOn from '../../components/Sidebar/ObjectsAddOn/ObjectsAddOn';
import ObjectsSimilar from '../../components/Sidebar/ObjectsSimilar/ObjectsSimilar';
import ObjectReference from '../../components/Sidebar/ObjectReference/ObjectReference';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import WobjectNearby from '../../app/Sidebar/ObjectInfoExperts/WobjectNearby';
import WobjectSidebarFollowers from '../../app/Sidebar/ObjectInfoExperts/WobjectSidebarFollowers';
import {
  getObjectAvatar,
  getObjectName,
  hasType,
  parseAddress,
} from '../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { formColumnsField } from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../const/objectTypes';
import DEFAULTS from '../const/defaultValues';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { compareObjectTitle } from '../../../common/helpers/seoHelpes';
import { getHelmetIcon, getIsWaivio, getSiteName } from '../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import useQuery from '../../../hooks/useQuery';

const WobjectView = ({
  authenticatedUserName,
  match,
  wobject,
  history,
  isEditMode,
  toggleViewEditMode,
  route,
  handleFollowClick,
  appendAlbum,
  nestedWobject,
  weightValue,
}) => {
  const image = getObjectAvatar(wobject) || DEFAULTS.AVATAR;
  const objectName = getObjectName(wobject);
  const { canonicalUrl } = useSeoInfoWithAppUrl(wobject.canonical);
  const isWaivio = useSelector(getIsWaivio);
  const authenticated = useSelector(getIsAuthenticated);
  const siteName = useSelector(getSiteName);
  const helmetIcon = useSelector(getHelmetIcon);
  const query = useQuery();
  const viewUrl = query.get('viewUrl');
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
  const referenceWobjType = ['business', 'person'].includes(wobject.object_type) && !isMobile();
  const albumsAndImagesCount = wobject.albums_count;
  const formsList = get(wobject, 'form', []);
  const currentForm = formsList?.find(item => item?.permlink === match.params.parentName) || {};
  const currentWobject = history.location.hash ? nestedWobject : wobject;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);
  const isWidgetPage = isNil(match.params[0]) && match.params[1] === 'widget';
  const isWebPage = match.params[0] === 'webpage';
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
      hasType(wobject, OBJECT_TYPE.PAGE) || isWebPage || middleRightColumn || entireColumn,
  });
  const centerClassList = classNames('center', {
    'center--page': hasType(wobject, OBJECT_TYPE.PAGE) || isWebPage,
    'center--middleForm': middleRightColumn,
    'center--fullForm': entireColumn,
  });

  const url =
    match.params[0] === 'reviews'
      ? `https://${wobject.canonical}/object/${match.params.name}`
      : canonicalUrl;

  useEffect(() => {
    if (viewUrl && !isEditMode && wobject.object_type === 'shop') {
      history.push(viewUrl);
    }
  }, [isEditMode]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{titleText}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={titleText} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={url} />
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
      <WobjHero
        isEditMode={isEditMode}
        authenticated={authenticated}
        isFetching={isEmpty(wobject)}
        wobject={wobject}
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
                userName={authenticatedUserName}
                history={history}
                appendAlbum={appendAlbum}
              />
            </div>
          </Affix>
          {wobject.author_permlink && (
            <Affix className={rightSidebarClassList} stickPosition={72}>
              {match.url.includes('/shop') ? (
                !isMobile() && <WobjectShopFilter />
              ) : (
                <React.Fragment>
                  {!isMobile() && <ObjectsAddOn wobject={wobject} />}
                  {!isMobile() && <ObjectsRelated />}
                  {!isMobile() && <ObjectsSimilar wobject={wobject} />}
                  {referenceWobjType && !isMobile() && <ObjectReference wobject={wobject} />}
                  {!isMobile() && <ObjectExpertise wobject={wobject} />}
                  {wobject.map && !isMobile() && <WobjectNearby wobject={wobject} />}
                  {!isMobile() && <WobjectSidebarFollowers wobject={wobject} />}
                </React.Fragment>
              )}
            </Affix>
          )}
          <div className={centerClassList}>
            {renderRoutes(route.routes, {
              isEditMode,
              wobject,
              authenticatedUserName,
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
};

WobjectView.propTypes = {
  authenticatedUserName: PropTypes.string,
  match: PropTypes.shape(),
  wobject: PropTypes.shape(),
  history: PropTypes.shape(),
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  route: PropTypes.shape(),
  handleFollowClick: PropTypes.func,
  appendAlbum: PropTypes.func,
  nestedWobject: PropTypes.shape(),
  weightValue: PropTypes.number,
};

export default withRouter(WobjectView);
