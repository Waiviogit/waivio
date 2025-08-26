import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import moment from 'moment';
import { get, has, isEmpty, isNil, reduce, uniq } from 'lodash';
import {
  getObjectInfo,
  getObjectsRewards,
  getReferenceObjectsList,
} from '../../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getAppUrl,
  getHelmetIcon,
  getSiteName,
  getUsedLocale,
} from '../../../store/appStore/appSelectors';
import { getActiveCategory, getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import EarnsCommissionsOnPurchases from '../../statics/EarnsCommissionsOnPurchases';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import { isMobile } from '../../../common/helpers/apiHelpers';
import ProductRewardCard from '../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import {
  getNumbersFromWobjPrice,
  getObjectAvatar,
  getObjectName,
  parseAddress,
  parseWobjectField,
  getTitleForLink,
  isOldInstacartProgram,
  isNewInstacartProgram,
  getPreferredInstacartItem,
} from '../../../common/helpers/wObjectHelper';
import Options from '../../object/Options/Options';
import ObjectFeatures from '../../object/ObjectFeatures/ObjectFeatures';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import PicturesSlider from './PicturesSlider/PicturesSlider';
import DEFAULTS from '../../object/const/defaultValues';
import ProductDetails from './ProductDetails/ProductDetails';
import SocialTagCategories from './SocialTagCategories/SocialTagCategories';
import ObjectsSlider from './ObjectsSlider/ObjectsSlider';
import SocialMenuItems from './SocialMenuItems/SocialMenuItems';
import { getIsOptionClicked } from '../../../store/shopStore/shopSelectors';
import SocialProductActions from './SocialProductActions/SocialProductActions';
import { resetOptionClicked } from '../../../store/shopStore/shopActions';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import SocialProductReviews from './SocialProductReviews/SocialProductReviews';
import SocialProductDescription from './SocialProductDescription/SocialProductDescription';
import {
  getAddOns,
  getSimilarObjects,
  getProductInfo,
  getRelatedObjectsAction,
} from '../../../store/wObjectStore/wobjectsActions';
import {
  getObject as getObjectState,
  getWobjectAuthors,
  getAddOnFromState,
  getSimilarObjectsFromState,
  getRelatedObjectsFromState,
  getBrandObject,
  getManufacturerObject,
  getMerchantObject,
  getPublisherObject,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectAlbums } from '../../../store/galleryStore/gallerySelectors';
import { getAlbums, resetGallery } from '../../../store/galleryStore/galleryActions';
import Loading from '../../components/Icon/Loading';
import SocialBookAuthors from './SocialBookAuthors/SocialBookAuthors';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { checkAboutCanonicalUrl, useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { averageRate, getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import SocialListItem from './SocialListItem/SocialListItem';
import { objectFields } from '../../../common/constants/listOfFields';
import RecipeDetails from './RecipeDetails/RecipeDetails';
import { getObjectPosts } from '../../../store/feedStore/feedActions';
import { getPosts } from '../../../store/postsStore/postsSelectors';
import { getFeedFromState } from '../../../common/helpers/stateHelpers';
import { getFeed } from '../../../store/feedStore/feedSelectors';
import RecipePost from './RecipePost/RecipePost';
import { getUser } from '../../../store/usersStore/usersSelectors';
import InstacartWidget from '../../widgets/InstacartWidget';
import './SocialProduct.less';
import { resetWobjectExpertise, setLinkSafetyInfo } from '../../../store/wObjectStore/wobjActions';
import useAdLevelData from '../../../hooks/useAdsense';
import GoogleAds from '../../adsenseAds/GoogleAds';

const limit = 30;

export const enrichMenuItems = (menuItems = [], locale, isNav = false) =>
  menuItems?.reduce(async (acc, curr) => {
    const res = await acc;
    const itemBody = isNav ? curr.body : JSON.parse(curr.body);

    if (itemBody.linkToObject && !has(itemBody, 'title')) {
      const newObj = await getObjectInfo([itemBody.linkToObject], locale);

      return [
        ...res,
        {
          ...curr,
          body: isNav
            ? {
                ...itemBody,
                title: newObj.wobjects[0].name || newObj.wobjects[0].default_name,
              }
            : JSON.stringify({
                ...itemBody,
                title: newObj.wobjects[0].name || newObj.wobjects[0].default_name,
              }),
        },
      ];
    }

    return [...res, curr];
  }, []);

const SocialProduct = ({
  userName,
  locale,
  activeOption,
  authors,
  activeCategory,
  siteName,
  wobject,
  authenticated,
  optionClicked,
  helmetIcon,
  params,
  setLinkSafety,
  history,
  setStoreActiveOpt,
  resetOptClicked,
  albums,
  isEditMode,
  toggleViewEditMode,
  addOns,
  getAddOnsAction,
  getSimilarObjectsAction,
  similarObjects,
  relatedObjects,
  getRelatedAction,
  brandObject,
  manufacturerObject,
  merchantObject,
  getProductInfoAction,
  publisherObject,
  intl,
  signature,
  showPostModal,
}) => {
  const [reward, setReward] = useState([]);
  const [hoveredOption, setHoveredOption] = useState({});
  const [references, setReferences] = useState([]);
  const [menuItemsArray, setMenuItemsArray] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const { minimal, intensive, moderate } = useAdLevelData();
  const affiliateLinks = wobject?.affiliateLinks || [];
  const isRecipe = wobject.object_type === 'recipe';
  const isProduct = wobject.object_type === 'product';
  const referenceWobjType = ['business', 'place', 'person'].includes(wobject.object_type);
  const defaultPrice = isRecipe ? get(wobject, 'budget') : get(wobject, 'price');
  const sale = get(wobject, 'sale');
  const compareAtPrice = get(wobject, 'compareAtPrice');
  const price = hoveredOption.price || defaultPrice;
  const cookingTime = wobject.cookingTime;
  const calories = wobject.calories;
  const nutrition = wobject.nutrition;
  const recipeIngredients = parseWobjectField(wobject, 'recipeIngredients');
  const feed = useSelector(getFeed);
  const postsList = useSelector(getPosts);
  const postsIds = uniq(getFeedFromState('objectPosts', wobject.author_permlink, feed));
  const recipePost = postsList[postsIds?.[0]];
  const website = parseWobjectField(wobject, 'website');
  const manufacturer = parseWobjectField(wobject, 'manufacturer');
  const parent = get(wobject, 'parent');
  const ageRange = get(wobject, 'ageRange');
  const language = get(wobject, 'language');
  const wobjTitle = get(wobject, 'title');
  const publicationDate = moment(wobject.publicationDate).format('MMMM DD, YYYY');
  const printLength = wobject.printLength;
  const publisher = parseWobjectField(wobject, 'publisher');
  const instacardAff =
    isRecipe && wobject?.affiliateLinks ? getPreferredInstacartItem(wobject.affiliateLinks) : null;
  const productAuthors = wobject.authors
    ? wobject.authors.map(el => parseWobjectField(el, 'body', []))
    : [];
  const departments = get(wobject, 'departments');
  const dimensions = parseWobjectField(wobject, 'dimensions');
  const brand = parseWobjectField(wobject, 'brand');
  const currBrand = isEmpty(brandObject) ? brand : brandObject;
  const photosAlbum = !isEmpty(albums) ? albums?.find(alb => alb.body === 'Photos') : [];
  const groupId = wobject.groupId;
  // const menuItems = get(wobject, 'menuItem', []);
  const customSort = get(wobject, 'sortCustom.include', []);
  const customVisibility = get(wobject, 'sortCustom.expand', []);
  const sortExclude = get(wobject, 'sortCustom.exclude', []);
  const features = wobject.features
    ? wobject.features?.map(el => parseWobjectField(el, 'body', []))
    : [];
  const productIdBody = wobject.productId
    ? wobject?.productId.map(el => parseWobjectField(el, 'body', []))
    : [];
  const showRecipeFields =
    calories ||
    nutrition ||
    cookingTime ||
    recipeIngredients ||
    !isEmpty(productIdBody) ||
    !isEmpty(departments);
  const merchant = parseWobjectField(wobject, 'merchant');
  const productWeight = parseWobjectField(wobject, 'productWeight');

  const menuItem = !has(wobject, 'sortCustom')
    ? menuItemsArray
    : menuItemsArray
        .filter(
          item =>
            !sortExclude.includes(item.body) &&
            !sortExclude.includes(item.author_permlink) &&
            !sortExclude.includes(item.permlink) &&
            !sortExclude.includes(item.id),
        )
        .sort((a, b) => {
          const indexA = customSort.indexOf(a.permlink);
          const indexB = customSort.indexOf(b.permlink);

          return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
        });

  const tagCategories = get(wobject, 'tagCategory', []);
  const tagCategoriesList = tagCategories.filter(item => !isEmpty(item.items));
  const showGallery =
    !isEmpty(wobject.preview_gallery) || (!isEmpty(parent) && has(parent, 'avatar'));
  const tagCategoriesForDescr = reduce(
    wobject.tagCategory,
    (acc, curr) => {
      const currentCategory = !isEmpty(curr.items)
        ? `${curr.body}: ${curr.items.map(item => item.body).join(', ')}`
        : '';

      return acc ? `${acc}. ${currentCategory}` : currentCategory;
    },
    '',
  );
  const image = getObjectAvatar(wobject) || DEFAULTS.AVATAR;
  const desc = `${wobject.description || ''} ${wobject.name}. ${parseAddress(wobject) ||
    ''} ${tagCategoriesForDescr}`;
  const { firstDescrPart: description } = shortenDescription(removeEmptyLines(desc), 200);
  const title = getTitleForLink(wobject);
  const { canonicalUrl } = useSeoInfoWithAppUrl(wobject.canonical);
  const url = ['book', 'product'].includes(wobject.object_type)
    ? `https://${wobject.canonical}/object/${params.name}`
    : canonicalUrl;
  const productUrl = checkAboutCanonicalUrl(url);
  const bannerEl =
    typeof document !== 'undefined' && document.getElementById('socialGiftsMainBanner');
  const socialHeaderEl = typeof document !== 'undefined' && document.querySelector('.Header');
  const socialScrollHeight = bannerEl
    ? socialHeaderEl?.offsetHeight + bannerEl?.offsetHeight
    : socialHeaderEl?.offsetHeight;
  const scrollHeight =
    (typeof window !== 'undefined' && window.scrollY > 0) || optionClicked ? socialScrollHeight : 0;

  const showProductDetails =
    !isRecipe &&
    (!isEmpty(brand) ||
      !isEmpty(manufacturer) ||
      !isEmpty(merchant) ||
      !isEmpty(parent) ||
      !isEmpty(productWeight) ||
      !isEmpty(dimensions) ||
      !isEmpty(departments) ||
      !isEmpty(groupId) ||
      !isEmpty(productIdBody) ||
      !isEmpty(language) ||
      !isEmpty(wobject.publicationDate) ||
      !isEmpty(printLength) ||
      !isEmpty(publisher) ||
      !isEmpty(website) ||
      !isEmpty(ageRange));

  const getAddOnsSimilarRelatedObjects = () => {
    getAddOnsAction(wobject.author_permlink, userName, locale, limit);
    getRelatedAction(wobject.author_permlink, userName, locale, limit);
    getSimilarObjectsAction(wobject.author_permlink, userName, locale, limit);
  };

  const getPublisherManufacturerBrandMerchantObjects = () => {
    getProductInfoAction(wobject);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    if (!isEmpty(wobject.author_permlink)) {
      if (!isEmpty(wobject.menuItem))
        enrichMenuItems(wobject.menuItem, locale).then(r => setMenuItemsArray(r));
      isRecipe &&
        getObjectPosts({
          object: wobject.author_permlink,
          username: wobject.author_permlink,
          limit: 1,
        });
      getAddOnsSimilarRelatedObjects();
      getPublisherManufacturerBrandMerchantObjects();
      getObjectsRewards(wobject.author_permlink, userName).then(res => setReward(res));
      referenceWobjType &&
        getReferenceObjectsList({
          authorPermlink: wobject.author_permlink,
          userName,
          locale,
        }).then(res => setReferences(Object.entries(res)));
    }
    setIsLoading(false);

    return () => {
      setStoreActiveOpt({});
    };
  }, [wobject.author_permlink]);

  useEffect(() => {
    resetOptClicked();
  }, []);

  const bestRating = getRatingForSocial(wobject.rating);
  const getMicroSchema = () => {
    if (isRecipe) {
      return (
        <div>
          <link itemProp="image" href={image} />
          <meta itemProp="description" content={description} />
          <meta itemProp="recipeCuisine" content={'International'} />
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

    if (isProduct) {
      return (
        <div>
          <meta itemProp="mpn" content="925872" />
          <meta itemProp="name" content={getObjectName(wobject)} />
          <link itemProp="image" href={image} />
          <meta itemProp="description" content={description} />
          <div itemProp="offers" itemType="https://schema.org/Offer" itemScope>
            <link itemProp="url" href={productUrl} />
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
    <div
      {...(showPostModal || (!isRecipe && !isProduct)
        ? {}
        : {
            itemType: isRecipe ? 'https://schema.org/Recipe' : 'https://schema.org/Product',
            itemScope: true,
          })}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={productUrl} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:image:url" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${siteName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" property="twitter:image" content={image} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
      {getMicroSchema()}
      {loading && isEmpty(wobject) ? (
        <Loading margin />
      ) : (
        <div className="SocialProduct">
          {history.location.search && (
            <div className="SocialProduct__column">
              <Breadcrumbs inProduct />
            </div>
          )}
          <div className="SocialProduct__column SocialProduct__column-wrapper">
            {isMobile() && (
              <h1
                className={
                  isEmpty(productAuthors) && isEmpty(wobjTitle) && isEmpty(currBrand)
                    ? 'SocialProduct__wobjName'
                    : 'SocialProduct__bookWobjName'
                }
              >
                {isRecipe ? <span itemProp="name">{wobject.name}</span> : wobject.name}
              </h1>
            )}
            {isMobile() && !isEmpty(currBrand) && (
              <div className={isEmpty(wobjTitle) ? 'SocialProduct__paddingBottom' : ''}>
                <SocialListItem
                  fieldName={objectFields.brand}
                  field={currBrand}
                  showTitle={false}
                />
              </div>
            )}
            {isMobile() && !isEmpty(wobjTitle) && (
              <div className="SocialProduct__title">{wobjTitle}</div>
            )}
            {isMobile() && !isEmpty(productAuthors) && (
              <SocialBookAuthors authors={productAuthors} />
            )}
            {isMobile() && (
              <div className="SocialProduct__ratings">
                {' '}
                {!isEmpty(wobject.rating) &&
                  wobject.rating.map(rating => (
                    <div key={rating.permlink} className="SocialProduct__ratings-item">
                      <RatingsWrap
                        isSocialProduct
                        ratings={[rating]}
                        username={userName}
                        wobjId={wobject.author_permlink}
                        wobjName={wobject.name}
                      />
                    </div>
                  ))}
              </div>
            )}
            {isMobile() && authenticated && !isEmpty(wobject) && (
              <div className="SocialProduct__socialActions">
                <SocialProductActions
                  toggleViewEditMode={toggleViewEditMode}
                  isEditMode={isEditMode}
                  authenticated={authenticated}
                />
              </div>
            )}
            {showGallery && (
              <div className="SocialProduct__row">
                <div className="SocialProduct__carouselWrapper">
                  <PicturesSlider
                    albums={albums}
                    altText={description}
                    currentWobj={wobject}
                    hoveredOption={hoveredOption}
                    activeOption={activeOption}
                    activeCategory={activeCategory}
                  />
                </div>
                <div className="SocialProduct__reward-wrap">
                  <ProductRewardCard isSocialProduct reward={reward} />
                </div>
              </div>
            )}
            <div className="SocialProduct__row SocialProduct__right-row">
              {!isMobile() && (
                <h1
                  className={
                    isEmpty(productAuthors) && isEmpty(wobjTitle) && isEmpty(currBrand)
                      ? 'SocialProduct__wobjName'
                      : 'SocialProduct__bookWobjName'
                  }
                >
                  {!showPostModal && isRecipe ? (
                    <span itemProp="name">{wobject.name}</span>
                  ) : (
                    wobject.name
                  )}
                </h1>
              )}
              {!isMobile() && !isEmpty(brand) && (
                <div className={isEmpty(wobjTitle) ? 'SocialProduct__paddingBottom' : ''}>
                  <SocialListItem
                    fieldName={objectFields.brand}
                    field={currBrand}
                    showTitle={false}
                  />
                </div>
              )}
              {!isMobile() && !isEmpty(wobjTitle) && (
                <div className="SocialProduct__title">{wobjTitle}</div>
              )}
              {!isMobile() && !isEmpty(productAuthors) && (
                <SocialBookAuthors authors={productAuthors} />
              )}
              {!isMobile() && authenticated && !isEmpty(wobject) && (
                <div className="SocialProduct__socialActions">
                  <SocialProductActions
                    currentWobj={wobject}
                    toggleViewEditMode={toggleViewEditMode}
                    isEditMode={isEditMode}
                    authenticated={authenticated}
                  />
                </div>
              )}
              {!isMobile() && (
                <div className="SocialProduct__ratings">
                  {' '}
                  {!isEmpty(wobject.rating) &&
                    wobject.rating.map(rating => (
                      <div key={rating.permlink} className="SocialProduct__ratings-item">
                        <RatingsWrap
                          isSocialProduct
                          ratings={[rating]}
                          username={userName}
                          wobjId={wobject.author_permlink}
                          wobjName={wobject.name}
                        />
                      </div>
                    ))}
                </div>
              )}
              <div className="flex flex-row">
                {compareAtPrice && (
                  <div
                    className={
                      // eslint-disable-next-line no-nested-ternary
                      isNil(compareAtPrice) && !isEmpty(wobject?.options)
                        ? 'SocialProduct__price-no'
                        : price
                        ? 'SocialProduct__price--old'
                        : 'SocialProduct__price'
                    }
                  >
                    {compareAtPrice}
                  </div>
                )}
                <div
                  className={
                    // eslint-disable-next-line no-nested-ternary
                    isNil(price) && !isEmpty(wobject?.options)
                      ? 'SocialProduct__price-no'
                      : sale
                      ? 'SocialProduct__price--old'
                      : 'SocialProduct__price'
                  }
                >
                  {price}
                </div>
                {sale && (
                  <div>
                    {' '}
                    <span className={'SocialProduct__price'}>{sale}</span>{' '}
                    <button className="SocialProduct__sale-button">Sale</button>
                  </div>
                )}
              </div>
              {!showPostModal &&
                isRecipe &&
                instacardAff &&
                isOldInstacartProgram(instacardAff) && (
                  <InstacartWidget
                    isProduct
                    className={'SocialProduct__instacard'}
                    instacartAff={instacardAff}
                    wobjPerm={wobject.author_permlink}
                    withDisclamer
                    inlineFlex
                    marginBottom={'5px'}
                  />
                )}
              {showRecipeFields && isRecipe && (
                <RecipeDetails
                  wobject={wobject}
                  history={history}
                  departments={departments}
                  productIdBody={productIdBody}
                  isEditMode={isEditMode}
                  calories={calories}
                  nutrition={nutrition}
                  cookingTime={cookingTime}
                  recipeIngredients={recipeIngredients}
                />
              )}
              {!isEmpty(wobject?.options) && (
                <div className="SocialProduct__paddingBottom">
                  <Options
                    isSocialProduct
                    setHoveredOption={option => setHoveredOption(option)}
                    isEditMode={false}
                    wobject={wobject}
                  />
                </div>
              )}
              {!isEmpty(affiliateLinks) &&
                !(
                  affiliateLinks.length === 1 &&
                  instacardAff &&
                  isOldInstacartProgram(instacardAff)
                ) && (
                  <div className="SocialProduct__paddingBottom">
                    <div className="SocialProduct__subtitle">
                      <FormattedMessage id="buy_it_on" defaultMessage="Buy it on" />:
                    </div>
                    <div className="SocialProduct__affiliateContainer">
                      {affiliateLinks
                        .sort((a, b) => a?.type?.charCodeAt(0) - b?.type?.charCodeAt(0))
                        .map(affLink => {
                          if (isNewInstacartProgram(affLink)) {
                            return (
                              <InstacartWidget
                                key={affLink.link}
                                wobjPerm={wobject.author_permlink}
                                instacartAff={affLink}
                              />
                            );
                          }

                          if (isOldInstacartProgram(affLink)) return null;

                          return <AffiliatLink key={affLink.link} link={affLink} />;
                        })}
                    </div>
                    <EarnsCommissionsOnPurchases align={'left'} />
                  </div>
                )}
              {intensive && <GoogleAds limitWidth />}
              {isEmpty(wobject.preview_gallery) && (
                <ProductRewardCard isSocialProduct reward={reward} />
              )}
            </div>
          </div>
          <div className="SocialProduct__column">
            {!isEmpty(wobject.description) && (
              <div className="SocialProduct__aboutItem">
                <div className="SocialProduct__heading">
                  {intl.formatMessage({ id: 'about', defaultMessage: 'About' })}
                </div>
                <SocialProductDescription
                  objectType={wobject.object_type}
                  description={wobject.description}
                  pictures={photosAlbum.items}
                  authorPermlink={wobject.author_permlink}
                />
              </div>
            )}
            {(minimal || moderate || intensive) && <GoogleAds inPost />}
            {recipePost && isRecipe && !showPostModal && (
              <div className={'SocialProduct__postWrapper PageContent social'}>
                <RecipePost signature={signature} recipePost={recipePost} />
                <br />
              </div>
            )}
            {!isEmpty(menuItem) && (
              <SocialMenuItems
                customSort={customSort}
                sortExclude={sortExclude}
                menuItem={menuItem}
                customVisibility={customVisibility}
                isProduct
                wobject={wobject}
              />
            )}
            {showProductDetails && (
              <ProductDetails
                setLinkSafety={setLinkSafety}
                website={website}
                locale={locale}
                publisher={publisher}
                publisherObject={publisherObject}
                printLength={printLength}
                publicationDate={publicationDate}
                language={language}
                ageRange={ageRange}
                wobject={wobject}
                groupId={groupId}
                history={history}
                productWeight={productWeight}
                dimensions={dimensions}
                productIdBody={productIdBody}
                departments={departments}
                fields={{ manufacturerObject, merchantObject }}
                parent={parent}
              />
            )}
            {intensive && <GoogleAds inList />}
            <ObjectsSlider
              objects={addOns}
              title={intl.formatMessage({
                id: 'bought_together',
                defaultMessage: 'Bought together / Add-on',
              })}
              name={'addOn'}
            />
            {!isEmpty(features) && (
              <div className="SocialProduct__featuresContainer">
                <div className="SocialProduct__heading">
                  {intl.formatMessage({ id: 'features', defaultMessage: 'Features' })}
                </div>
                <div className="SocialProduct__centralContent">
                  <ObjectFeatures
                    isSocialGifts
                    features={features}
                    isEditMode={false}
                    wobjPermlink={wobject.author_permlink}
                  />
                </div>
              </div>
            )}
            <ObjectsSlider
              objects={similarObjects}
              title={intl.formatMessage({ id: 'object_field_similar', defaultMessage: 'Similar' })}
              name={'similar'}
            />
            <ObjectsSlider
              objects={relatedObjects}
              title={intl.formatMessage({ id: 'related_items', defaultMessage: 'Related items' })}
              name={'related'}
            />
            {!isEmpty(references) &&
              references?.map(ref => (
                <ObjectsSlider key={ref[0]} objects={ref[1]} title={`${ref[0]}s`} name={ref[0]} />
              ))}
            {!isEmpty(tagCategoriesList) && (
              <div className="SocialProduct__featuresContainer">
                <div className="SocialProduct__heading">
                  {intl.formatMessage({ id: 'tags', defaultMessage: 'Tags' })}
                </div>
                <div className="SocialProduct__centralContent">
                  <SocialTagCategories tagCategoriesList={tagCategoriesList} wobject={wobject} />
                </div>
              </div>
            )}
            {!isEmpty(wobject) && <SocialProductReviews wobject={wobject} authors={authors} />}
          </div>
        </div>
      )}
    </div>
  );
};

SocialProduct.propTypes = {
  userName: PropTypes.string,
  locale: PropTypes.string,
  activeOption: PropTypes.shape(),
  wobject: PropTypes.shape(),
  history: PropTypes.shape(),
  params: PropTypes.shape(),
  activeCategory: PropTypes.string,
  siteName: PropTypes.string,
  authenticated: PropTypes.bool,
  showPostModal: PropTypes.bool,
  authors: PropTypes.arrayOf(PropTypes.shape()),
  albums: PropTypes.arrayOf(PropTypes.shape()),
  addOns: PropTypes.arrayOf(PropTypes.shape()),
  optionClicked: PropTypes.bool,
  getAddOnsAction: PropTypes.func,
  getSimilarObjectsAction: PropTypes.func,
  similarObjects: PropTypes.arrayOf(PropTypes.shape()),
  relatedObjects: PropTypes.arrayOf(PropTypes.shape()),
  getRelatedAction: PropTypes.func,
  helmetIcon: PropTypes.string,
  signature: PropTypes.string,
  setStoreActiveOpt: PropTypes.func,
  resetOptClicked: PropTypes.func,
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  brandObject: PropTypes.shape({}),
  manufacturerObject: PropTypes.shape({}),
  merchantObject: PropTypes.shape({}),
  publisherObject: PropTypes.shape({}),
  setLinkSafety: PropTypes.func,
  getProductInfoAction: PropTypes.func,
  intl: PropTypes.shape().isRequired,
};

const mapStateToProps = state => {
  const userName = getAuthenticatedUserName(state);

  return {
    userName,
    locale: getUsedLocale(state),
    activeOption: getActiveOption(state),
    activeCategory: getActiveCategory(state),
    siteName: getSiteName(state),
    wobject: getObjectState(state),
    authors: getWobjectAuthors(state),
    appUrl: getAppUrl(state),
    albums: getObjectAlbums(state),
    authenticated: getIsAuthenticated(state),
    optionClicked: getIsOptionClicked(state),
    helmetIcon: getHelmetIcon(state),
    addOns: getAddOnFromState(state),
    similarObjects: getSimilarObjectsFromState(state),
    relatedObjects: getRelatedObjectsFromState(state),
    brandObject: getBrandObject(state),
    manufacturerObject: getManufacturerObject(state),
    merchantObject: getMerchantObject(state),
    publisherObject: getPublisherObject(state),
    user: getUser(state, userName),
  };
};

const mapDispatchToProps = dispatch => ({
  setStoreActiveOpt: obj => dispatch(setStoreActiveOption(obj)),
  resetWobjExpertise: () => dispatch(resetWobjectExpertise()),
  setLinkSafety: url => dispatch(setLinkSafetyInfo(url)),
  getObjectPosts: (username, object, lim) =>
    dispatch(getObjectPosts({ username, object, limit: lim })),
  resetOptClicked: opt => dispatch(resetOptionClicked(opt)),
  getWobjAlbums: obj => dispatch(getAlbums(obj)),
  resetWobjGallery: () => dispatch(resetGallery()),
  getAddOnsAction: (author_permlink, userName, locale, lim = 30) =>
    dispatch(getAddOns(author_permlink, userName, locale, lim)),
  getSimilarObjectsAction: (author_permlink, userName, locale, lim = 30) =>
    dispatch(getSimilarObjects(author_permlink, userName, locale, lim)),
  getProductInfoAction: obj => dispatch(getProductInfo(obj)),
  getRelatedAction: (author_permlink, userName, locale, lim = 30) =>
    dispatch(getRelatedObjectsAction(author_permlink, userName, locale, lim)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(SocialProduct)));
