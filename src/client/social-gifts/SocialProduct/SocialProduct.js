import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isEmpty, isNil, reduce } from 'lodash';
import {
  getObjectInfo,
  getObjectsByIds,
  getObjectsRewards,
  getRelatedObjectsFromDepartments,
  getSimilarObjectsFromDepartments,
} from '../../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getAppUrl,
  getHelmetIcon,
  getUsedLocale,
  getWebsiteName,
} from '../../../store/appStore/appSelectors';
import { getActiveCategory, getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import { isMobile } from '../../../common/helpers/apiHelpers';
import ProductRewardCard from '../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import {
  getLastPermlinksFromHash,
  getObjectAvatar,
  parseAddress,
  parseWobjectField,
} from '../../../common/helpers/wObjectHelper';
import Options from '../../object/Options/Options';
import ObjectFeatures from '../../object/ObjectFeatures/ObjectFeatures';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import PicturesSlider from './PicturesSlider/PicturesSlider';
import { compareObjectTitle } from '../../../common/helpers/seoHelpes';
import DEFAULTS from '../../object/const/defaultValues';
import ProductDetails from './ProductDetails/ProductDetails';
import SocialTagCategories from './SocialTagCategories/SocialTagCategories';
import ObjectsSlider from './ObjectsSlider/ObjectsSlider';
import SocialMenuItems from './SocialMenuItems/SocialMenuItems';
import { getIsOptionClicked } from '../../../store/shopStore/shopSelectors';
import SocialProductActions from './SocialProductActions/SocialProductActions';
import OBJECT_TYPE from '../../object/const/objectTypes';
import { objectFields } from '../../../common/constants/listOfFields';
import { resetOptionClicked } from '../../../store/shopStore/shopActions';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import {
  getObject as getObjectState,
  getWobjectAuthors,
} from '../../../store/wObjectStore/wObjectSelectors';
import './SocialProduct.less';
import SocialProductReviews from './SocialProductReviews/SocialProductReviews';
import Loading from '../../components/Icon/Loading';

const limit = 30;

const SocialProduct = ({
  userName,
  locale,
  activeOption,
  authors,
  activeCategory,
  siteName,
  appUrl,
  wobject,
  authenticated,
  optionClicked,
  helmetIcon,
  match,
  history,
  setStoreActiveOpt,
  resetOptClicked,
  getWobject,
}) => {
  const [isEditMode, setIsEditMode] = useState(
    wobject.type === OBJECT_TYPE.PAGE && authenticated && wobject[objectFields.pageContent],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [reward, setReward] = useState([]);
  const [hoveredOption, setHoveredOption] = useState({});
  const [addOns, setAddOns] = useState([]);
  const [similarObjects, setSimilarObjects] = useState([]);
  const [relatedObjects, setRelatedObjects] = useState([]);
  const [fields, setFields] = useState({
    brandObject: {},
    manufacturerObject: {},
    merchantObject: {},
  });
  const authorPermlink = history.location.hash
    ? getLastPermlinksFromHash(history.location.hash)
    : match.params.name;
  const affiliateLinks = wobject?.affiliateLinks || [];
  const price = hoveredOption.price || get(wobject, 'price');
  const manufacturer = parseWobjectField(wobject, 'manufacturer');
  const parent = get(wobject, 'parent');
  const departments = get(wobject, 'departments');
  const dimensions = parseWobjectField(wobject, 'dimensions');
  const brand = parseWobjectField(wobject, 'brand');
  const groupId = wobject.groupId;
  const features = wobject.features
    ? wobject.features?.map(el => parseWobjectField(el, 'body', []))
    : [];
  const productIdBody = wobject.productId
    ? wobject?.productId.map(el => parseWobjectField(el, 'body', []))
    : [];
  const merchant = parseWobjectField(wobject, 'merchant');
  const productWeight = parseWobjectField(wobject, 'productWeight');
  const menuItem = get(wobject, 'menuItem', []);
  const tagCategories = get(wobject, 'tagCategory', []);
  const tagCategoriesList = tagCategories.filter(item => !isEmpty(item.items));
  const addOnPermlinks = wobject.addOn ? wobject?.addOn?.map(obj => obj.body) : [];
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
  const desc = `${wobject.name}. ${parseAddress(wobject) || ''} ${wobject.description ||
    ''} ${tagCategoriesForDescr}`;
  const address = parseAddress(wobject);
  const titleText = compareObjectTitle(false, wobject.name, address, siteName);
  const canonicalUrl = `${appUrl}/object/${wobject.object_type}/${match.params.name}`;
  const url = `${appUrl}/object/${wobject.object_type}/${match.params.name}`;
  const bannerEl =
    typeof document !== 'undefined' && document.getElementById('socialGiftsMainBanner');
  const socialHeaderEl = typeof document !== 'undefined' && document.querySelector('.Header');
  const socialScrollHeight = bannerEl
    ? socialHeaderEl.offsetHeight + bannerEl.offsetHeight
    : socialHeaderEl?.offsetHeight;
  const scrollHeight =
    (typeof window !== 'undefined' && window.scrollY > 0) || optionClicked ? socialScrollHeight : 0;
  const toggleViewEditMode = () => setIsEditMode(!isEditMode);

  const showProductDetails =
    !isEmpty(brand) ||
    !isEmpty(manufacturer) ||
    !isEmpty(merchant) ||
    !isEmpty(parent) ||
    !isEmpty(productWeight) ||
    !isEmpty(dimensions) ||
    !isEmpty(departments) ||
    !isEmpty(groupId) ||
    !isEmpty(productIdBody);

  const getAddOnsSimilarRelatedObjects = () => {
    if (!isEmpty(addOnPermlinks) && !isNil(addOnPermlinks)) {
      getObjectsByIds({
        authorPermlinks: addOnPermlinks,
        authUserName: userName,
        limit,
        skip: 0,
      }).then(res => {
        setAddOns(res.wobjects);
      });
    }
    getRelatedObjectsFromDepartments(
      wobject.author_permlink,
      userName,
      locale,
      0,
      limit,
    ).then(res => setRelatedObjects(res.wobjects || []));
    getSimilarObjectsFromDepartments(
      wobject.author_permlink,
      userName,
      locale,
      0,
      limit,
    ).then(res => setSimilarObjects(res.wobjects || []));
  };

  const getPublisherManufacturerBrandMerchantObjects = () => {
    const authorPermlinks = [
      manufacturer?.authorPermlink,
      brand?.authorPermlink,
      merchant?.authorPermlink,
    ].filter(permlink => permlink);

    getObjectInfo(authorPermlinks, locale).then(res => {
      const brandObject =
        res.wobjects.find(wobj => wobj.author_permlink === brand?.authorPermlink) || brand;
      const manufacturerObject =
        res.wobjects.find(wobj => wobj.author_permlink === manufacturer?.authorPermlink) ||
        manufacturer;
      const merchantObject =
        res.wobjects.find(wobj => wobj.author_permlink === merchant?.authorPermlink) || merchant;

      setFields({ brandObject, manufacturerObject, merchantObject });
    });
  };

  useEffect(() => {
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    if (!isEmpty(authorPermlink)) {
      getWobject(authorPermlink, userName);

      getObjectsRewards(authorPermlink, userName).then(res => setReward(res));
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      setStoreActiveOpt({});
      resetOptClicked();
    };
  }, [authorPermlink]);

  useEffect(() => {
    !isEmpty(wobject) && getPublisherManufacturerBrandMerchantObjects();
  }, [wobject.brand, wobject.manufacturer, wobject.merchant]);

  useEffect(() => {
    !isEmpty(wobject) && getAddOnsSimilarRelatedObjects();
  }, [addOnPermlinks.length, wobject.author_permlink]);

  return (
    <div>
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
      {isLoading ? (
        <div className="mt3">
          <Loading />
        </div>
      ) : (
        <div className="SocialProduct">
          <div className="SocialProduct__column SocialProduct__column-wrapper">
            {isMobile() && <div className="SocialProduct__wobjName">{wobject.name}</div>}
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
            {isMobile() && authenticated && (
              <div className="SocialProduct__socialActions">
                <SocialProductActions
                  toggleViewEditMode={toggleViewEditMode}
                  isEditMode={isEditMode}
                  authenticated={authenticated}
                />
              </div>
            )}
            {!isEmpty(wobject.preview_gallery) && (
              <div className="SocialProduct__row">
                <div className="SocialProduct__carouselWrapper">
                  <PicturesSlider
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
              {!isMobile() && <div className="SocialProduct__wobjName">{wobject.name}</div>}
              {!isMobile() && authenticated && (
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
                <div className="SocialProduct__contentPaddingLeft SocialProduct__description">
                  {wobject.description}
                </div>
              </div>
            )}
            {!isEmpty(menuItem) && <SocialMenuItems menuItem={menuItem} />}
            {showProductDetails && (
              <ProductDetails
                wobject={wobject}
                groupId={groupId}
                history={history}
                productWeight={productWeight}
                dimensions={dimensions}
                productIdBody={productIdBody}
                departments={departments}
                fields={fields}
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
            {!isEmpty(tagCategoriesList) && (
              <div className="SocialProduct__featuresContainer">
                <div className="SocialProduct__heading">Tags</div>
                <div className="SocialProduct__centralContent">
                  <SocialTagCategories tagCategoriesList={tagCategoriesList} wobject={wobject} />
                </div>
              </div>
            )}
            <SocialProductReviews wobject={wobject} authors={authors} />
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
  appUrl: PropTypes.string,
  authenticated: PropTypes.bool,
  authors: PropTypes.arrayOf(),
  optionClicked: PropTypes.bool,
  helmetIcon: PropTypes.string,
  setStoreActiveOpt: PropTypes.string,
  resetOptClicked: PropTypes.string,
  getWobject: PropTypes.string,
};

const mapStateToProps = state => ({
  userName: getAuthenticatedUserName(state),
  locale: getUsedLocale(state),
  activeOption: getActiveOption(state),
  activeCategory: getActiveCategory(state),
  siteName: getWebsiteName(state),
  wobject: getObjectState(state),
  authors: getWobjectAuthors(state),
  appUrl: getAppUrl(state),
  authenticated: getIsAuthenticated(state),
  optionClicked: getIsOptionClicked(state),
  helmetIcon: getHelmetIcon(state),
});
const mapDispatchToProps = dispatch => ({
  setStoreActiveOpt: obj => dispatch(setStoreActiveOption(obj)),
  resetOptClicked: opt => dispatch(resetOptionClicked(opt)),
  getWobject: (obj, name) => dispatch(getObject(obj, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialProduct));
