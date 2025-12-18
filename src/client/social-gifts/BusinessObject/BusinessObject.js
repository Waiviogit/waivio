import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { get, has, isEmpty, isNil, reduce } from 'lodash';
import { Helmet } from 'react-helmet';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getAppHost,
  getHelmetIcon,
  getSiteName,
  getUsedLocale,
} from '../../../store/appStore/appSelectors';
import { getActiveCategory, getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import {
  getObject as getObjectState,
  getObjectExpertiseUsers,
  getObjectsNearby,
  getWobjectAuthors,
} from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectAlbums, getRelatedPhotos } from '../../../store/galleryStore/gallerySelectors';
import { getIsOptionClicked } from '../../../store/shopStore/shopSelectors';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import { resetOptionClicked } from '../../../store/shopStore/shopActions';
import { getAlbums, resetGallery } from '../../../store/galleryStore/galleryActions';
import {
  getObjectAvatar,
  parseAddress,
  parseWobjectField,
  getTitleForLink,
} from '../../../common/helpers/wObjectHelper';
import Loading from '../../components/Icon/Loading';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import { checkAboutCanonicalUrl, useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import DEFAULTS from '../../object/const/defaultValues';
import {
  getFeaturedObjects,
  getMapPermlinkByObject,
  getObjectsRewards,
  getReferenceObjectsList,
} from '../../../waivioApi/ApiClient';
import { checkAndOpenWaivioLink } from '../../../common/helpers/urlHelpers';
import { resetWobjectExpertise, setLinkSafetyInfo } from '../../../store/wObjectStore/wobjActions';
import './BusinessObject.less';
import { enrichMenuItems } from '../SocialProduct/SocialProduct';
import useAdLevelData from '../../../hooks/useAdsense';
import useTemplateProvider from '../../../designTemplates/TemplateProvider';

const BusinessObject = ({
  userName,
  locale,
  activeOption,
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
  isEditMode,
  toggleViewEditMode,
  experts,
  nearbyObjects,
  intl,
  resetWobjExpertise,
  setLinkSafety,
  host,
}) => {
  const [reward, setReward] = useState([]);
  const [references, setReferences] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [menuItemsArray, setMenuItemsArray] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [mapObjPermlink, setMapObjPermlink] = useState('');
  const [hoveredOption, setHoveredOption] = useState({});
  const { minimal, intensive, moderate } = useAdLevelData();
  const departments = get(wobject, 'departments');
  const referenceWobjType = ['business', 'person'].includes(wobject?.object_type || '');
  const serviceObj = ['service'].includes(wobject?.object_type || '');
  const price = hoveredOption.price || get(wobject, 'price');
  const website = get(wobject, 'website');
  const linkField = parseWobjectField(wobject, 'link');
  const wobjTitle = get(wobject, 'title');
  const walletAddress = get(wobject, 'walletAddress', []);
  const pictures = albums?.flatMap(alb => alb?.items)?.filter(i => i.name !== 'avatar');
  const customVisibility = get(wobject, 'sortCustom.expand', []);
  const sortExclude = get(wobject, 'sortCustom.exclude', []);
  const customSort = get(wobject, 'sortCustom.include', []);
  const phones = get(wobject, 'phone', []);

  const email = get(wobject, 'email');
  const menuItem = !has(wobject, 'sortCustom')
    ? menuItemsArray
    : menuItemsArray
        .filter(
          item =>
            !sortExclude?.includes(item.body) &&
            !sortExclude?.includes(item.author_permlink) &&
            !sortExclude?.includes(item.permlink) &&
            !sortExclude?.includes(item.id),
        )
        .sort((a, b) => {
          const indexA = customSort?.indexOf(a.permlink);
          const indexB = customSort?.indexOf(b.permlink);

          return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
        });
  const tagCategories = get(wobject, 'tagCategory', []);
  const companyIdBody = wobject.companyId
    ? wobject.companyId?.map(el => parseWobjectField(el, 'body', []))
    : [];
  const address = parseAddress(wobject);
  const map = parseWobjectField(wobject, 'map');
  const workTime = get(wobject, 'workTime');
  const linkUrl = get(wobject, 'url', '');
  const linkUrlHref = linkUrl?.endsWith('*') ? linkUrl?.slice(0, -1) : linkUrl;
  const tagCategoriesList = tagCategories.filter(item => !isEmpty(item.items));
  const showGallery = !isEmpty(wobject.preview_gallery) || !isEmpty(getObjectAvatar(wobject));
  const groupId = wobject.groupId;
  const productIdBody = wobject.productId
    ? wobject?.productId.map(el => parseWobjectField(el, 'body', []))
    : [];
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
  const url = ['business', 'restaurant', 'place'].includes(wobject?.object_type || '')
    ? `https://${wobject.canonical}/object/${match.params.name}`
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
  // const bestRating = getRatingForSocial(wobject.rating);
  const showBusinessDetails =
    !isEmpty(phones) ||
    !isNil(website) ||
    !isNil(email) ||
    !isNil(linkField) ||
    !isEmpty(walletAddress) ||
    !isEmpty(companyIdBody);

  const showAddressHoursBlock = !isNil(address) || !isNil(map) || !isNil(workTime);
  const templateComponents = useTemplateProvider();
  const BusinessObjectView = templateComponents?.BusinessObjectView;

  useEffect(() => {
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    if (!isEmpty(wobject.author_permlink)) {
      if (!isEmpty(wobject.menuItem))
        enrichMenuItems(wobject.menuItem, locale).then(r => setMenuItemsArray(r));
      getMapPermlinkByObject(wobject.author_permlink, locale, userName, host).then(r =>
        setMapObjPermlink(r.result),
      );
      getObjectsRewards(wobject.author_permlink, userName).then(res => setReward(res));
      if (referenceWobjType)
        getReferenceObjectsList({
          authorPermlink: wobject.author_permlink,
          userName,
          locale,
        }).then(res => setReferences(Object.entries(res)));
      if (wobject.featured)
        getFeaturedObjects(wobject.author_permlink, userName, locale).then(res =>
          setFeatured(res.wobjects),
        );
    }
    setIsLoading(false);

    return () => {
      setStoreActiveOpt({});
    };
  }, [wobject.author_permlink]);
  useEffect(() => {
    resetOptClicked();
    resetWobjExpertise();
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
      {/* <div itemType="https://schema.org/Product" itemScope> */}
      {/*   <meta itemProp="mpn" content="925872" /> */}
      {/*   <meta itemProp="name" content={getObjectName(wobject)} /> */}
      {/*   <link itemProp="image" href={image} /> */}
      {/*   <meta itemProp="description" content={description} /> */}
      {/*   <div itemProp="offers" itemType="https://schema.org/Offer" itemScope> */}
      {/*     <link itemProp="url" href={productUrl} /> */}
      {/*     <meta itemProp="availability" content="https://schema.org/InStock" /> */}
      {/*     <meta itemProp="priceCurrency" content={wobject?.price?.includes('С$') ? 'CAD' : 'USD'} /> */}
      {/*     <meta itemProp="itemCondition" content="https://schema.org/UsedCondition" /> */}
      {/*     <meta itemProp="price" content={getNumbersFromWobjPrice(wobject)} /> */}
      {/*   </div> */}
      {/*   {Boolean(averageRate(bestRating)) && ( */}
      {/*     <div itemProp="aggregateRating" itemType="https://schema.org/AggregateRating" itemScope> */}
      {/*       <meta itemProp="reviewCount" content={bestRating?.rating_votes?.length} /> */}
      {/*       <meta itemProp="ratingValue" content={averageRate(bestRating)} /> */}
      {/*     </div> */}
      {/*   )} */}
      {/* </div> */}
      {(loading && isEmpty(wobject)) || !BusinessObjectView ? (
        <Loading margin />
      ) : (
        <BusinessObjectView
          wobject={wobject}
          wobjTitle={wobjTitle}
          userName={userName}
          authenticated={authenticated}
          isEditMode={isEditMode}
          toggleViewEditMode={toggleViewEditMode}
          albums={albums}
          relatedAlbum={relatedAlbum}
          description={description}
          activeOption={activeOption}
          activeCategory={activeCategory}
          hoveredOption={hoveredOption}
          setHoveredOption={setHoveredOption}
          price={price}
          reward={reward}
          showGallery={showGallery}
          showBusinessDetails={showBusinessDetails}
          showAddressHoursBlock={showAddressHoursBlock}
          phones={phones}
          website={website}
          linkField={linkField}
          companyIdBody={companyIdBody}
          email={email}
          walletAddress={walletAddress}
          mapObjPermlink={mapObjPermlink}
          map={map}
          address={address}
          workTime={workTime}
          departments={departments}
          serviceObj={serviceObj}
          groupId={groupId}
          productIdBody={productIdBody}
          menuItem={menuItem}
          customVisibility={customVisibility}
          featured={featured}
          references={references}
          experts={experts}
          nearbyObjects={nearbyObjects}
          tagCategoriesList={tagCategoriesList}
          history={history}
          setLinkSafety={setLinkSafety}
          linkUrl={linkUrl}
          linkUrlHref={linkUrlHref}
          pictures={pictures}
          intensive={intensive}
          minimal={minimal}
          moderate={moderate}
          intl={intl}
        />
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
  albums: PropTypes.arrayOf(PropTypes.shape()),
  experts: PropTypes.arrayOf(),
  relatedAlbum: PropTypes.shape(),
  optionClicked: PropTypes.bool,
  helmetIcon: PropTypes.string,
  host: PropTypes.string,
  setStoreActiveOpt: PropTypes.func,
  resetOptClicked: PropTypes.func,
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  resetWobjExpertise: PropTypes.func,
  setLinkSafety: PropTypes.func,
  brandObject: PropTypes.shape({}),
  nearbyObjects: PropTypes.shape(),
  manufacturerObject: PropTypes.shape({}),
  merchantObject: PropTypes.shape({}),
  intl: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  userName: getAuthenticatedUserName(state),
  locale: getUsedLocale(state),
  activeOption: getActiveOption(state),
  activeCategory: getActiveCategory(state),
  siteName: getSiteName(state),
  wobject: getObjectState(state),
  authors: getWobjectAuthors(state),
  host: getAppHost(state),
  albums: getObjectAlbums(state),
  relatedAlbum: getRelatedPhotos(state),
  authenticated: getIsAuthenticated(state),
  optionClicked: getIsOptionClicked(state),
  helmetIcon: getHelmetIcon(state),
  experts: getObjectExpertiseUsers(state),
  nearbyObjects: getObjectsNearby(state),
});

const mapDispatchToProps = dispatch => ({
  setStoreActiveOpt: obj => dispatch(setStoreActiveOption(obj)),
  resetOptClicked: opt => dispatch(resetOptionClicked(opt)),
  getWobjAlbums: obj => dispatch(getAlbums(obj)),
  resetWobjGallery: () => dispatch(resetGallery()),
  resetWobjExpertise: () => dispatch(resetWobjectExpertise()),
  setLinkSafety: url => {
    if (!checkAndOpenWaivioLink(url)) {
      dispatch(setLinkSafetyInfo(url));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(BusinessObject)));
