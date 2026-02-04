import moment from 'moment/moment';
import React, { useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import classNames from 'classnames';
import { get, isEmpty, isNil, reduce, round } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { averageRate, getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import EarnsCommissionsOnPurchases from '../../statics/EarnsCommissionsOnPurchases';
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
  getNumbersFromWobjPrice,
} from '../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { formColumnsField } from '../../../common/constants/listOfFields';
import OBJECT_TYPE from '../const/objectTypes';
import DEFAULTS from '../const/defaultValues';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { compareObjectTitle } from '../../../common/helpers/seoHelpes';
import {
  getHelmetIcon,
  getIsWaivio,
  getShowPostModal,
  getSiteName,
} from '../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import useQuery from '../../../hooks/useQuery';
import ObjectsFeatured from '../../components/Sidebar/ObjectsFeatured/ObjectsFeatured';

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
  showPostModal,
}) => {
  const image = getObjectAvatar(wobject) || DEFAULTS.AVATAR;
  const objectName = getObjectName(wobject);
  const { canonicalUrl } = useSeoInfoWithAppUrl(wobject.canonical);
  const isWaivio = useSelector(getIsWaivio);
  const showModal = useSelector(getShowPostModal);
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
  const isWidgetPage = isNil(match.params[1]) && match.params[0] === 'widget';
  const isWebPage = match.params[0] === 'webpage';
  const currentColumn = get(currentForm, 'column', '');
  const currentWidgetColumn = get(widgetForm, 'column', '');
  const middleRightColumn =
    currentColumn === formColumnsField.middleRight ||
    (currentWidgetColumn === formColumnsField.middleRight && isWidgetPage);
  const entireColumn =
    currentColumn === formColumnsField.entire ||
    (currentWidgetColumn === formColumnsField.entire && isWidgetPage);
  const fullScreenColumn =
    currentColumn === formColumnsField.fullScreen ||
    (currentWidgetColumn === formColumnsField.fullScreen && isWidgetPage);
  const leftSidebarClassList = classNames('leftContainer leftContainer__wobj', {
    'leftContainer--left': entireColumn || fullScreenColumn,
  });
  const rightSidebarClassList = classNames('wobjRightContainer', {
    'wobjRightContainer--right':
      hasType(wobject, OBJECT_TYPE.PAGE) ||
      (hasType(wobject, OBJECT_TYPE.HTML) && match.params[0] === 'code') ||
      (hasType(wobject, OBJECT_TYPE.HTML) && !match.params[0]) ||
      isWebPage ||
      middleRightColumn ||
      entireColumn ||
      fullScreenColumn,
  });
  const centerClassList = classNames('center', {
    'center--page':
      hasType(wobject, OBJECT_TYPE.PAGE) ||
      (hasType(wobject, OBJECT_TYPE.HTML) && match.params[0] === 'code') ||
      (hasType(wobject, OBJECT_TYPE.HTML) && !match.params[0]) ||
      isWebPage,
    'center--middleForm': middleRightColumn,
    'center--fullForm': entireColumn || fullScreenColumn,
  });
  const bestRating = getRatingForSocial(wobject.rating);

  const url =
    match.params[0] === 'reviews'
      ? `https://${wobject.canonical}/object/${match.params.name}`
      : canonicalUrl;

  useEffect(() => {
    if (viewUrl && !isEditMode && wobject.object_type === 'shop') {
      history.push(viewUrl);
    }
  }, [isEditMode]);

  const getItemData = () => {
    if (!showModal) {
      if (hasType(wobject, OBJECT_TYPE.RECIPE))
        return {
          itemScope: true,
          itemType: 'https://schema.org/Recipe',
        };

      if (hasType(wobject, OBJECT_TYPE.PRODUCT))
        return {
          itemScope: true,
          itemType: 'https://schema.org/Product',
        };
    }

    return {};
  };

  const getMicroSchema = () => {
    if (hasType(wobject, OBJECT_TYPE.RECIPE)) {
      return (
        <div>
          <link itemProp="image" href={image} />
          <meta itemProp="description" content={desc} />
          <meta itemProp="recipeCuisine" content={'International'} />
          <meta itemProp="recipeYield" content={'1 servings'} />
          <meta itemProp="recipeCategory" content={wobject?.departments?.[0]?.body} />
          {wobject.cookingTime && <meta itemProp="cookTime" content={wobject.cookingTime} />}
          {wobject.calories && (
            <div itemProp="nutrition" itemScope itemType="https://schema.org/NutritionInformation">
              <meta itemProp="calories" content={wobject.calories} />
            </div>
          )}

          {/* Оценка рецепта */}
          {Boolean(averageRate(bestRating)) && (
            <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <meta itemProp="reviewCount" content={bestRating?.rating_votes?.length} />
              <meta itemProp="ratingValue" content={averageRate(bestRating)} />
            </div>
          )}
        </div>
      );
    }

    if (hasType(wobject, OBJECT_TYPE.PRODUCT)) {
      return (
        <div>
          <meta itemProp="mpn" content="925872" />
          <meta itemProp="name" content={getObjectName(wobject)} />
          <link itemProp="image" href={image} />
          <meta itemProp="description" content={desc} />
          <div itemProp="offers" itemType="https://schema.org/Offer" itemScope>
            <link itemProp="url" href={url} />
            <meta itemProp="availability" content="https://schema.org/InStock" />
            <meta
              itemProp="priceValidUntil"
              content={moment()
                .add(1, 'months')
                .format('YYYY-MM-DD')}
            />
            <meta
              itemProp="priceCurrency"
              content={wobject?.price?.includes('С$') ? 'CAD' : 'USD'}
            />
            <meta itemProp="itemCondition" content="https://schema.org/UsedCondition" />
            <meta itemProp="price" content={getNumbersFromWobjPrice(wobject)} />
          </div>
          {Boolean(averageRate(bestRating)) && (
            <div itemProp="aggregateRating" itemType="https://schema.org/AggregateRating" itemScope>
              <meta itemProp="reviewCount" content={bestRating?.rating_votes?.length} />
              <meta itemProp="ratingValue" content={averageRate(bestRating)} />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div {...getItemData()}>
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
      {getMicroSchema()}
      <WobjHero
        isEditMode={isEditMode}
        authenticated={authenticated}
        isFetching={isEmpty(wobject)}
        wobject={wobject}
        onFollowClick={handleFollowClick}
        toggleViewEditMode={toggleViewEditMode}
        albumsAndImagesCount={albumsAndImagesCount}
        appendAlbum={appendAlbum}
        showPostModal={showPostModal}
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
              {match.url?.includes('/shop') ? (
                !isMobile() && <WobjectShopFilter />
              ) : (
                <React.Fragment>
                  {!isMobile() && <ObjectsFeatured wobject={wobject} />}
                  {!isMobile() && <ObjectsAddOn wobject={wobject} />}
                  {!isMobile() && <ObjectsRelated />}
                  {!isMobile() && <ObjectsSimilar wobject={wobject} />}
                  {referenceWobjType && !isMobile() && <ObjectReference wobject={wobject} />}
                  {!isMobile() && <ObjectExpertise wobject={wobject} />}
                  {wobject.map && !isMobile() && <WobjectNearby wobject={wobject} />}
                  {!isMobile() && <WobjectSidebarFollowers wobject={wobject} />}
                  {(hasType(wobject, OBJECT_TYPE.LIST) || !isEmpty(wobject.affiliateLinks)) && (
                    <EarnsCommissionsOnPurchases />
                  )}
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
    </div>
  );
};

WobjectView.propTypes = {
  authenticatedUserName: PropTypes.string,
  match: PropTypes.shape(),
  wobject: PropTypes.shape(),
  history: PropTypes.shape(),
  isEditMode: PropTypes.bool,
  showPostModal: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  route: PropTypes.shape(),
  handleFollowClick: PropTypes.func,
  appendAlbum: PropTypes.func,
  nestedWobject: PropTypes.shape(),
  weightValue: PropTypes.number,
};

export default withRouter(WobjectView);
