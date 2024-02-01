import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { get, has, isEmpty, isNil, reduce } from 'lodash';
import { getObjectsRewards, getReferenceObjectsList } from '../../../waivioApi/ApiClient';
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
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import { isMobile } from '../../../common/helpers/apiHelpers';
import ProductRewardCard from '../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import {
  getNumbersFromWobjPrice,
  getObjectAvatar,
  getObjectName,
  parseAddress,
  parseWobjectField,
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
  getObject,
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
} from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import { getAlbums, resetGallery } from '../../../store/galleryStore/galleryActions';
import Loading from '../../components/Icon/Loading';
import SocialBookAuthors from './SocialBookAuthors/SocialBookAuthors';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { checkAboutCanonicalUrl, useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { averageRate, getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import './SocialProduct.less';

const limit = 30;

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
  match,
  history,
  setStoreActiveOpt,
  resetOptClicked,
  albums,
  relatedAlbum,
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
}) => {
  const [reward, setReward] = useState([]);
  const [hoveredOption, setHoveredOption] = useState({});
  const [references, setReferences] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const affiliateLinks = wobject?.affiliateLinks || [];
  const referenceWobjType = ['business', 'person'].includes(wobject.object_type);
  const price = hoveredOption.price || get(wobject, 'price');
  const website = parseWobjectField(wobject, 'website');
  const manufacturer = parseWobjectField(wobject, 'manufacturer');
  const parent = get(wobject, 'parent');
  const ageRange = get(wobject, 'ageRange');
  const language = get(wobject, 'language');
  const wobjTitle = get(wobject, 'title');
  const publicationDate = moment(wobject.publicationDate).format('MMMM DD, YYYY');
  const printLength = wobject.printLength;
  const publisher = parseWobjectField(wobject, 'publisher');
  const productAuthors = wobject.authors
    ? wobject.authors.map(el => parseWobjectField(el, 'body', []))
    : [];
  const departments = get(wobject, 'departments');
  const dimensions = parseWobjectField(wobject, 'dimensions');
  const brand = parseWobjectField(wobject, 'brand');
  const photosAlbum = !isEmpty(albums) ? albums?.find(alb => alb.body === 'Photos') : [];
  const groupId = wobject.groupId;
  const customSort = get(wobject, 'sortCustom.include', []);
  const menuItems = get(wobject, 'menuItem', []);

  const features = wobject.features
    ? wobject.features?.map(el => parseWobjectField(el, 'body', []))
    : [];
  const productIdBody = wobject.productId
    ? wobject?.productId.map(el => parseWobjectField(el, 'body', []))
    : [];
  const merchant = parseWobjectField(wobject, 'merchant');
  const productWeight = parseWobjectField(wobject, 'productWeight');
  const menuItem = isEmpty(customSort)
    ? menuItems
    : customSort.reduce((acc, curr) => {
        const currentLink = wobject?.menuItem?.find(
          btn =>
            btn.body === curr ||
            btn.author_permlink === curr ||
            btn.permlink === curr ||
            btn.id === curr,
        );

        return currentLink ? [...acc, currentLink] : acc;
      }, []);
  const tagCategories = get(wobject, 'tagCategory', []);
  const tagCategoriesList = tagCategories.filter(item => !isEmpty(item.items));
  const addOnPermlinks = wobject.addOn ? wobject?.addOn?.map(obj => obj.body) : [];
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
  const title = `${wobject.name}`;
  const { canonicalUrl } = useSeoInfoWithAppUrl(wobject.canonical);
  const url = ['book', 'product'].includes(wobject.object_type)
    ? `https://${wobject.canonical}/object/${match.params.name}`
    : canonicalUrl;
  const productUrl = checkAboutCanonicalUrl(url);
  const bannerEl =
    typeof document !== 'undefined' && document.getElementById('socialGiftsMainBanner');
  const socialHeaderEl = typeof document !== 'undefined' && document.querySelector('.Header');
  const socialScrollHeight = bannerEl
    ? socialHeaderEl.offsetHeight + bannerEl.offsetHeight
    : socialHeaderEl?.offsetHeight;
  const scrollHeight =
    (typeof window !== 'undefined' && window.scrollY > 0) || optionClicked ? socialScrollHeight : 0;

  const showProductDetails =
    !isEmpty(brand) ||
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
    !isEmpty(ageRange);

  const getAddOnsSimilarRelatedObjects = () => {
    getAddOnsAction(addOnPermlinks, userName, limit);
    getRelatedAction(wobject.author_permlink, userName, locale, limit);
    getSimilarObjectsAction(wobject.author_permlink, userName, locale, limit);
  };

  const getPublisherManufacturerBrandMerchantObjects = () => {
    getProductInfoAction(wobject);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    if (!isEmpty(wobject.author_permlink)) {
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

  return (
    <div>
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
      <div itemType="https://schema.org/Product" itemScope>
        <meta itemProp="mpn" content="925872" />
        <meta itemProp="name" content={getObjectName(wobject)} />
        <link itemProp="image" href={image} />
        <meta itemProp="description" content={description} />
        <div itemProp="offers" itemType="https://schema.org/Offer" itemScope>
          <link itemProp="url" href={productUrl} />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <meta itemProp="priceCurrency" content={wobject?.price?.includes('С$') ? 'CAD' : 'USD'} />
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
                  isEmpty(productAuthors) && isEmpty(wobjTitle)
                    ? 'SocialProduct__wobjName'
                    : 'SocialProduct__bookWobjName'
                }
              >
                {wobject.name}
              </h1>
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
                    relatedAlbum={relatedAlbum}
                    albums={albums}
                    altText={description}
                    currentWobj={wobject}
                    hoveredOption={hoveredOption}
                    activeOption={activeOption}
                    activeCategory={activeCategory}
                  />
                </div>
                <div>
                  <ProductRewardCard isSocialProduct reward={reward} />
                </div>
              </div>
            )}
            <div className="SocialProduct__row SocialProduct__right-row">
              {!isMobile() && (
                <h1
                  className={
                    isEmpty(productAuthors) && isEmpty(wobjTitle)
                      ? 'SocialProduct__wobjName'
                      : 'SocialProduct__bookWobjName'
                  }
                >
                  {wobject.name}
                </h1>
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
              <div
                className={
                  isNil(price) && !isEmpty(wobject?.options)
                    ? 'SocialProduct__price-no'
                    : 'SocialProduct__price'
                }
              >
                {price}
              </div>
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
              {!isEmpty(affiliateLinks) && (
                <div className="SocialProduct__paddingBottom">
                  <div className="SocialProduct__subtitle">
                    <FormattedMessage id="buy_it_on" defaultMessage="Buy it on" />:
                  </div>
                  <div className="SocialProduct__affLinks">
                    {affiliateLinks.map(link => (
                      <div key={link.link} className="SocialProduct__links">
                        <AffiliatLink link={link} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isEmpty(wobject.preview_gallery) && (
                <ProductRewardCard isSocialProduct reward={reward} />
              )}
            </div>
          </div>
          <div className="SocialProduct__column">
            {!isEmpty(wobject.description) && (
              <div className="SocialProduct__aboutItem">
                <div className="SocialProduct__heading"> About this item</div>
                <SocialProductDescription
                  description={wobject.description}
                  pictures={photosAlbum.items}
                  authorPermlink={wobject.author_permlink}
                />
              </div>
            )}
            {!isEmpty(menuItem) && <SocialMenuItems menuItem={menuItem} />}
            {showProductDetails && (
              <ProductDetails
                website={website}
                locale={locale}
                publisher={publisher}
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
                fields={{ brandObject, manufacturerObject, merchantObject }}
                parent={parent}
              />
            )}
            <ObjectsSlider objects={addOns} title={'Bought together / Add-ons'} name={'addOn'} />
            {!isEmpty(features) && (
              <div className="SocialProduct__featuresContainer">
                <div className="SocialProduct__heading">Features</div>
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
            <ObjectsSlider objects={similarObjects} title={'Similar'} name={'similar'} />
            <ObjectsSlider objects={relatedObjects} title={'Related items'} name={'related'} />
            {!isEmpty(references) &&
              references?.map(ref => (
                <ObjectsSlider key={ref[0]} objects={ref[1]} title={`${ref[0]}s`} name={ref[0]} />
              ))}
            {!isEmpty(tagCategoriesList) && (
              <div className="SocialProduct__featuresContainer">
                <div className="SocialProduct__heading">Tags</div>
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
  match: PropTypes.shape(),
  activeCategory: PropTypes.string,
  siteName: PropTypes.string,
  authenticated: PropTypes.bool,
  authors: PropTypes.arrayOf(),
  albums: PropTypes.arrayOf(),
  addOns: PropTypes.arrayOf(),
  relatedAlbum: PropTypes.shape(),
  optionClicked: PropTypes.bool,
  getAddOnsAction: PropTypes.func,
  getSimilarObjectsAction: PropTypes.func,
  similarObjects: PropTypes.arrayOf(),
  relatedObjects: PropTypes.arrayOf(),
  getRelatedAction: PropTypes.func,
  helmetIcon: PropTypes.string,
  setStoreActiveOpt: PropTypes.func,
  resetOptClicked: PropTypes.func,
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  brandObject: PropTypes.shape({}),
  manufacturerObject: PropTypes.shape({}),
  merchantObject: PropTypes.shape({}),
  getProductInfoAction: PropTypes.func,
};

const mapStateToProps = state => ({
  userName: getAuthenticatedUserName(state),
  locale: getUsedLocale(state),
  activeOption: getActiveOption(state),
  activeCategory: getActiveCategory(state),
  siteName: getSiteName(state),
  wobject: getObjectState(state),
  authors: getWobjectAuthors(state),
  appUrl: getAppUrl(state),
  albums: getObjectAlbums(state),
  relatedAlbum: getRelatedPhotos(state),
  authenticated: getIsAuthenticated(state),
  optionClicked: getIsOptionClicked(state),
  helmetIcon: getHelmetIcon(state),
  addOns: getAddOnFromState(state),
  similarObjects: getSimilarObjectsFromState(state),
  relatedObjects: getRelatedObjectsFromState(state),
  brandObject: getBrandObject(state),
  manufacturerObject: getManufacturerObject(state),
  merchantObject: getMerchantObject(state),
});

const mapDispatchToProps = dispatch => ({
  setStoreActiveOpt: obj => dispatch(setStoreActiveOption(obj)),
  resetOptClicked: opt => dispatch(resetOptionClicked(opt)),
  getWobject: (obj, name) => dispatch(getObject(obj, name)),
  getWobjAlbums: obj => dispatch(getAlbums(obj)),
  resetWobjGallery: () => dispatch(resetGallery()),
  getAddOnsAction: (addOnPermlinks, userName) => dispatch(getAddOns(addOnPermlinks, userName)),
  getSimilarObjectsAction: (author_permlink, userName, locale, lim = 30) =>
    dispatch(getSimilarObjects(author_permlink, userName, locale, lim)),
  getProductInfoAction: obj => dispatch(getProductInfo(obj)),
  getRelatedAction: (author_permlink, userName, locale, lim = 30) =>
    dispatch(getRelatedObjectsAction(author_permlink, userName, locale, lim)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialProduct));
