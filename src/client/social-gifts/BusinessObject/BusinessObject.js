import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { get, has, isEmpty, isNil, reduce } from 'lodash';
import { Helmet } from 'react-helmet';
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
import {
  getObject as getObjectState,
  getObjectExpertiseUsers,
  getWobjectAuthors,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import { getIsOptionClicked } from '../../../store/shopStore/shopSelectors';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import { resetOptionClicked } from '../../../store/shopStore/shopActions';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import { getAlbums, resetGallery } from '../../../store/galleryStore/galleryActions';
import {
  getNumbersFromWobjPrice,
  getObjectAvatar,
  getObjectName,
  parseAddress,
  parseWobjectField,
} from '../../../common/helpers/wObjectHelper';
import { averageRate, getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import Loading from '../../components/Icon/Loading';
import { isMobile } from '../../../common/helpers/apiHelpers';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import SocialProductActions from '../SocialProduct/SocialProductActions/SocialProductActions';
import PicturesSlider from '../SocialProduct/PicturesSlider/PicturesSlider';
import ProductRewardCard from '../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import SocialProductDescription from '../SocialProduct/SocialProductDescription/SocialProductDescription';
import BusinessMenuItemsList from './BusinessMenuItems/BusinessMenuItemsList';
import ObjectsSlider from '../SocialProduct/ObjectsSlider/ObjectsSlider';
import SocialTagCategories from '../SocialProduct/SocialTagCategories/SocialTagCategories';
import SocialProductReviews from '../SocialProduct/SocialProductReviews/SocialProductReviews';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import { checkAboutCanonicalUrl, useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import DEFAULTS from '../../object/const/defaultValues';
import { getObjectsRewards, getReferenceObjectsList } from '../../../waivioApi/ApiClient';
import BusinessDetails from './BusinessDetails/BusinessDetails';
import './BusinessObject.less';
import AddressHoursDetails from './AddressHoursDetails/AddressHoursDetails';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Experts from './Experts/Experts';

const BusinessObject = ({
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
  setStoreActiveOpt,
  resetOptClicked,
  albums,
  relatedAlbum,
  history,
  resetWobjGallery,
  isEditMode,
  toggleViewEditMode,
  experts,
}) => {
  const [reward, setReward] = useState([]);
  const [references, setReferences] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const referenceWobjType = ['business', 'person'].includes(wobject.object_type);
  const price = get(wobject, 'price');
  const website = parseWobjectField(wobject, 'website');
  const linkField = parseWobjectField(wobject, 'link');
  const parent = get(wobject, 'parent');
  const wobjTitle = get(wobject, 'title');
  const photosAlbum = !isEmpty(albums) ? albums?.find(alb => alb.body === 'Photos') : [];
  const customSort = get(wobject, 'sortCustom.include', []);
  const menuItems = get(wobject, 'menuItem', []);
  const phones = get(wobject, 'phone', []);
  const email = get(wobject, 'email');
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
  const companyIdBody = wobject.companyId
    ? wobject.companyId?.map(el => parseWobjectField(el, 'body', []))
    : [];
  const address = parseAddress(wobject);
  const map = parseWobjectField(wobject, 'map');
  const workTime = get(wobject, 'workTime');
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
  const title = `${wobject.name}`;
  const { canonicalUrl } = useSeoInfoWithAppUrl(wobject.canonical);
  const url = ['business'].includes(wobject.object_type)
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
  const bestRating = getRatingForSocial(wobject.rating);
  const showBusinessDetails =
    !isEmpty(phones) ||
    !isNil(website) ||
    !isNil(email) ||
    !isNil(linkField) ||
    !isEmpty(companyIdBody) ||
    !isNil(parent);

  const showAddressHoursBlock = !isNil(address) || !isNil(map) || !isNil(workTime);

  useEffect(() => {
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    if (!isEmpty(wobject.author_permlink)) {
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
      resetWobjGallery();
      setStoreActiveOpt({});
    };
  }, [wobject.author_permlink]);
  useEffect(() => {
    resetOptClicked();
  }, []);

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
                  isEmpty(wobjTitle) ? 'SocialProduct__wobjName' : 'SocialProduct__bookWobjName'
                }
              >
                {wobject.name}
              </h1>
            )}
            {isMobile() && !isEmpty(wobjTitle) && (
              <div className="SocialProduct__title">{wobjTitle}</div>
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
            {isMobile() && showGallery && (
              <div className="SocialProduct__row SocialProduct__right-row">
                <div className="SocialProduct__carouselWrapper">
                  <PicturesSlider
                    relatedAlbum={relatedAlbum}
                    albums={albums}
                    altText={description}
                    currentWobj={wobject}
                    // hoveredOption={hoveredOption}
                    activeOption={activeOption}
                    activeCategory={activeCategory}
                  />
                </div>
                <div>
                  <ProductRewardCard isSocialProduct reward={reward} />
                </div>
              </div>
            )}
            <div className="SocialProduct__row ">
              {!isMobile() && (
                <h1
                  className={
                    isEmpty(wobjTitle) ? 'SocialProduct__wobjName' : 'SocialProduct__bookWobjName'
                  }
                >
                  {wobject.name}
                </h1>
              )}
              {!isMobile() && !isEmpty(wobjTitle) && (
                <div className="SocialProduct__title">{wobjTitle}</div>
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
              {showBusinessDetails && (
                <BusinessDetails
                  isEditMode={isEditMode}
                  companyIdBody={companyIdBody}
                  wobject={wobject}
                  phones={phones}
                  username={userName}
                  linkField={linkField}
                  website={website}
                  parent={parent}
                />
              )}

              {isEmpty(wobject.preview_gallery) && (
                <ProductRewardCard isSocialProduct reward={reward} />
              )}
            </div>
            {!isMobile() && showGallery && (
              <div className="SocialProduct__row SocialProduct__right-row">
                <div className="SocialProduct__carouselWrapper">
                  <PicturesSlider
                    relatedAlbum={relatedAlbum}
                    albums={albums}
                    altText={description}
                    currentWobj={wobject}
                    // hoveredOption={hoveredOption}
                    activeOption={activeOption}
                    activeCategory={activeCategory}
                  />
                </div>
                <div>
                  <ProductRewardCard isSocialProduct reward={reward} />
                </div>
              </div>
            )}
          </div>
          <div className="SocialProduct__column">
            {showAddressHoursBlock && (
              <AddressHoursDetails
                history={history}
                address={address}
                map={map}
                workTime={workTime}
                wobject={wobject}
              />
            )}
            {!isEmpty(menuItem) && <BusinessMenuItemsList menuItem={menuItem} />}
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
            {!isEmpty(references) &&
              references?.map(ref => (
                <ObjectsSlider key={ref[0]} objects={ref[1]} title={`${ref[0]}s`} name={ref[0]} />
              ))}
            {!isEmpty(experts) && (
              <Experts key={'experts'} experts={experts} title={`experts`} name={'experts'} />
            )}
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

BusinessObject.propTypes = {
  userName: PropTypes.string,
  locale: PropTypes.string,
  activeOption: PropTypes.shape(),
  wobject: PropTypes.shape(),
  match: PropTypes.shape(),
  history: PropTypes.shape(),
  activeCategory: PropTypes.string,
  siteName: PropTypes.string,
  authenticated: PropTypes.bool,
  authors: PropTypes.arrayOf(),
  albums: PropTypes.arrayOf(),
  experts: PropTypes.arrayOf(),
  relatedAlbum: PropTypes.shape(),
  optionClicked: PropTypes.bool,
  helmetIcon: PropTypes.string,
  setStoreActiveOpt: PropTypes.func,
  resetOptClicked: PropTypes.func,
  resetWobjGallery: PropTypes.func,
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  brandObject: PropTypes.shape({}),
  manufacturerObject: PropTypes.shape({}),
  merchantObject: PropTypes.shape({}),
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
  experts: getObjectExpertiseUsers(state),
});

const mapDispatchToProps = dispatch => ({
  setStoreActiveOpt: obj => dispatch(setStoreActiveOption(obj)),
  resetOptClicked: opt => dispatch(resetOptionClicked(opt)),
  getWobject: (obj, name) => dispatch(getObject(obj, name)),
  getWobjAlbums: obj => dispatch(getAlbums(obj)),
  resetWobjGallery: () => dispatch(resetGallery()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BusinessObject));
