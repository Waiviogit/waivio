import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Carousel, Collapse, Icon, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { remove, orderBy, get, isEmpty, isNil } from 'lodash';
import {
  getObject,
  getObjectInfo,
  getObjectsByIds,
  getObjectsRewards,
  getRelatedObjectsFromDepartments,
  getRelatedPhotos,
  getSimilarObjectsFromDepartments,
  getWobjectGallery,
} from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { objectFields } from '../../../common/constants/listOfFields';
import { getActiveCategory, getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import { isMobile } from '../../../common/helpers/apiHelpers';
import ProductRewardCard from '../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import { parseWobjectField } from '../../../common/helpers/wObjectHelper';
import Department from '../../object/Department/Department';
import Options from '../../object/Options/Options';
import ProductId from '../../app/Sidebar/ProductId';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import ObjectFeatures from '../../object/ObjectFeatures/ObjectFeatures';
import PicturesCarousel from '../../object/PicturesCarousel';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import './SocialProduct.less';

const limit = 30;

const SocialProduct = () => {
  const [wobject, setWobject] = useState({});
  const [allAlbums, setAllAlbums] = useState([]);
  const [reward, setReward] = useState([]);
  const [showMoreCategoryItems, setShowMoreCategoryItems] = useState(false);
  const [hoveredOption, setHoveredOption] = useState({});
  const [relatedAlbum, setRelatedAlbum] = useState({});
  const [addOns, setAddOns] = useState([]);
  const [similarObjects, setSimilarObjects] = useState([]);
  const [relatedObjects, setRelatedObjects] = useState([]);
  const [fields, setFields] = useState({
    brandObject: {},
    manufacturerObject: {},
    merchantObject: {},
  });
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const activeOption = useSelector(getActiveOption);
  const activeCategory = useSelector(getActiveCategory);
  const authorPermlink = match.params.name;
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
  const slideWidth = 250;
  const slidesToShow = Math.floor(typeof window !== 'undefined' && window.innerWidth / slideWidth);
  const carouselSettings = objects => ({
    dots: false,
    arrows: true,
    lazyLoad: true,
    rows: 1,
    nextArrow: <Icon type="caret-right" />,
    prevArrow: <Icon type="caret-left" />,
    infinite: slidesToShow < objects.length,
    slidesToShow,
  });

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
  const allPhotos = allAlbums?.flatMap(alb => alb.items.flat());
  const photoAlbum = allPhotos?.sort((a, b) => (b.name === 'avatar') - (a.name === 'avatar'));
  const pictures = [...photoAlbum, ...get(relatedAlbum, 'items', [])];
  let items = pictures;

  if (hoveredOption?.avatar || activeOption[activeCategory]?.avatar) {
    items = [hoveredOption || activeOption[activeCategory], ...pictures];
  }

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

    getObjectInfo(authorPermlinks).then(res => {
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
  const objAuthorPermlink = obj => obj.authorPermlink || obj.author_permlink;

  useEffect(() => {
    if (!isEmpty(authorPermlink)) {
      getObject(authorPermlink, userName, locale).then(obj => {
        setWobject(obj);
      });
      getWobjectGallery(authorPermlink, locale).then(albums => {
        const defaultAlbum = remove(albums, alb => alb.id === authorPermlink);
        const sortedAlbums = orderBy(albums, ['weight'], ['desc']);

        return setAllAlbums([...defaultAlbum, ...sortedAlbums]);
      });
      getRelatedPhotos(authorPermlink, limit, 0).then(alb => setRelatedAlbum(alb));
      getObjectsRewards(authorPermlink, userName).then(res => setReward(res));
      // getAddOnsSimilarRelatedObjects();
    }

    return () => dispatch(setStoreActiveOption({}));
  }, [authorPermlink]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [authorPermlink]);

  useEffect(() => {
    !isEmpty(wobject) && getPublisherManufacturerBrandMerchantObjects();
  }, [wobject.brand, wobject.manufacturer, wobject.merchant]);

  useEffect(() => {
    !isEmpty(wobject) && getAddOnsSimilarRelatedObjects();
  }, [addOnPermlinks.length, wobject.author_permlink]);

  const getLayout = (fieldName, field) => {
    switch (fieldName) {
      case objectFields.parent:
      case objectFields.merchant:
      case objectFields.brand:
      case objectFields.manufacturer:
        return objAuthorPermlink(field) ? (
          <Link to={`/object/product/${objAuthorPermlink(field)}`}>{field.name}</Link>
        ) : (
          <span>{field.name}</span>
        );
      case objectFields.productWeight:
        return (
          <span>
            {field.value} {field.unit}
          </span>
        );

      case objectFields.dimensions:
        return (
          <span>
            {dimensions.length} x {dimensions.width} x {dimensions.depth} {dimensions.unit}
          </span>
        );
      default:
        return null;
    }
  };

  const listItem = (fieldName, field) => (
    <div className="paddingBottom">
      <b>
        <FormattedMessage id={`object_field_${fieldName}`} defaultMessage={fieldName} />:{' '}
      </b>
      {getLayout(fieldName, field)}
    </div>
  );

  const getObjectsGalleryLayout = (title, objects) =>
    !isEmpty(objects) && (
      <div className="SocialProduct__addOn-section">
        <div className="SocialProduct__heading">{title}</div>
        <div className="Slider__wrapper">
          <Carousel {...carouselSettings(objects)}>
            {objects?.map(wObject => (
              <ShopObjectCard key={wObject.author_permlink} wObject={wObject} />
            ))}
          </Carousel>
        </div>
      </div>
    );
  const renderTagCategories = tags =>
    tags.map(item => (
      <div className="paddingBottom" key={item.id}>
        {`${item.body}:`}
        <span>{item.items && renderCategoryItems(item.items, item.body)}</span>
      </div>
    ));

  const renderCategoryItems = (categoryItems = [], category) => {
    const { object_type: type } = wobject;
    const onlyFiveItems = categoryItems.filter((f, i) => i < 5);
    const tagArray = showMoreCategoryItems ? categoryItems : onlyFiveItems;

    return (
      <span>
        {tagArray.map(item => (
          <>
            <Tag key={`${category}/${item.body}`} className="ml2">
              <Link to={`/discover-objects/${type}?${category}=${item.body}`}>{item.body}</Link>
            </Tag>{' '}
          </>
        ))}
        {categoryItems.length > 5 && !showMoreCategoryItems && (
          <span
            role="presentation"
            className="show-more"
            onClick={() => setShowMoreCategoryItems(true)}
          >
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="SocialProduct">
      <div className="SocialProduct__column SocialProduct__column-wrapper">
        {isMobile() && <div className="SocialProduct__wobjName">{wobject.name}</div>}
        {!isEmpty(items) && (
          <div className="SocialProduct__row">
            <div className="SocialProduct__carouselWrapper">
              <PicturesCarousel albums={allAlbums} pics={pictures} isSocialProduct />
            </div>
            <div>
              <ProductRewardCard isSocialProduct reward={reward} />
            </div>
          </div>
        )}
        <div className="SocialProduct__row SocialProduct__right-row">
          {!isMobile() && <div className="SocialProduct__wobjName">{wobject.name}</div>}
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
          <div className="SocialProduct__price">{price}</div>
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
        {!isEmpty(menuItem) && (
          <div className="SocialProduct__paddingBottom">
            <Collapse
            // onChange={callback}
            >
              {menuItem.map(item => {
                const itemBody = JSON.parse(item.body);

                return (
                  <Collapse.Panel header={itemBody.title} key={menuItem[item]}>
                    <div> content</div>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </div>
        )}
        {showProductDetails && (
          <div className="SocialProduct__productDetails">
            <div className="SocialProduct__heading">Product details</div>
            <div className="SocialProduct__productDetails-content SocialProduct__contentPaddingLeft">
              {!isEmpty(fields.brandObject) && listItem(objectFields.brand, fields.brandObject)}
              {!isEmpty(fields.manufacturerObject) &&
                listItem(objectFields.manufacturer, fields.manufacturerObject)}
              {!isEmpty(fields.merchantObject) &&
                listItem(objectFields.merchant, fields.merchantObject)}
              {!isEmpty(parent) && listItem(objectFields.parent, parent)}
              {!isEmpty(productWeight) && listItem(objectFields.productWeight, productWeight)}
              {!isEmpty(dimensions) && listItem(objectFields.dimensions, dimensions)}
              {!isEmpty(departments) && (
                <Department
                  isSocialGifts
                  departments={departments}
                  isEditMode={false}
                  history={history}
                  wobject={wobject}
                />
              )}
              {
                <ProductId
                  isSocialGifts
                  isEditMode={false}
                  authorPermlink={wobject.author_permlink}
                  groupId={groupId}
                  productIdBody={productIdBody}
                />
              }
            </div>
          </div>
        )}
        {getObjectsGalleryLayout('Bought together / Add-ons', addOns)}
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
        {getObjectsGalleryLayout('Similar', similarObjects)}
        {getObjectsGalleryLayout('Related items', relatedObjects)}
        {!isEmpty(tagCategoriesList) && (
          <div className="SocialProduct__featuresContainer">
            <div className="SocialProduct__heading">Tags</div>
            <div className="SocialProduct__centralContent">
              {renderTagCategories(tagCategoriesList)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialProduct;
