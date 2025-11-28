import React from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { isEmpty, isNil } from 'lodash';
import RatingsWrap from '../../../objectCard/RatingsWrap/RatingsWrap';
import SocialProductActions from '../../SocialProduct/SocialProductActions/SocialProductActions';
import PicturesSlider from '../../SocialProduct/PicturesSlider/PicturesSlider';
import ProductRewardCard from '../../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import SocialProductDescription from '../../SocialProduct/SocialProductDescription/SocialProductDescription';
import ObjectsSlider from '../../SocialProduct/ObjectsSlider/ObjectsSlider';
import SocialTagCategories from '../../SocialProduct/SocialTagCategories/SocialTagCategories';
import SocialProductReviews from '../../SocialProduct/SocialProductReviews/SocialProductReviews';
import BusinessDetails from '../BusinessDetails/BusinessDetails';
import AddressHoursDetails from '../AddressHoursDetails/AddressHoursDetails';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import Experts from '../Experts/Experts';
import SocialMenuItems from '../../SocialProduct/SocialMenuItems/SocialMenuItems';
import Options from '../../../object/Options/Options';
import Department from '../../../object/Department/Department';
import ProductId from '../../../app/Sidebar/ProductId';
import GoogleAds from '../../../adsenseAds/GoogleAds';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const ClassicBusinessObjectView = ({
  wobject,
  wobjTitle,
  userName,
  authenticated,
  isEditMode,
  toggleViewEditMode,
  albums,
  relatedAlbum,
  description,
  activeOption,
  activeCategory,
  hoveredOption,
  setHoveredOption,
  price,
  reward,
  showGallery,
  showBusinessDetails,
  showAddressHoursBlock,
  phones,
  website,
  linkField,
  companyIdBody,
  email,
  walletAddress,
  mapObjPermlink,
  map,
  address,
  workTime,
  departments,
  serviceObj,
  groupId,
  productIdBody,
  menuItem,
  customVisibility,
  featured,
  references,
  experts,
  nearbyObjects,
  tagCategoriesList,
  history,
  setLinkSafety,
  linkUrl,
  linkUrlHref,
  pictures,
  intensive,
  minimal,
  moderate,
  intl,
}) => (
  <div className="SocialProduct">
    {history.location.search && (
      <div className="SocialProduct__column">
        <Breadcrumbs inProduct />
      </div>
    )}
    <div className="SocialProduct__column SocialProduct__column-wrapper">
      {isMobile() && (
        <h1
          className={isEmpty(wobjTitle) ? 'SocialProduct__wobjName' : 'SocialProduct__bookWobjName'}
        >
          {wobject.name}
        </h1>
      )}
      {isMobile() && !isEmpty(wobjTitle) && <div className="SocialProduct__title">{wobjTitle}</div>}
      {isMobile() && (
        <div className="SocialProduct__ratings">
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
      <div className="BusinessObject__row ">
        <div className="BusinessObject__row--center ">
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
          <div>
            {wobject.object_type === 'link' && (
              <span className="ObjectInfo__url-container">
                <ReactSVG
                  className="ObjectInfo__url-image"
                  src="/images/icons/link-icon.svg"
                  wrapper="span"
                />
                <span className="main-color-button" onClick={() => setLinkSafety(linkUrlHref)}>
                  {linkUrl}
                </span>
              </span>
            )}
          </div>
          <div
            className={
              isNil(price) && !isEmpty(wobject?.options)
                ? 'SocialProduct__price-no'
                : 'SocialProduct__price'
            }
          >
            {price}
          </div>
          {!isEmpty(wobject?.options) && serviceObj && (
            <div className="SocialProduct__paddingBottom">
              <Options
                isSocialProduct
                setHoveredOption={option => setHoveredOption(option)}
                isEditMode={false}
                wobject={wobject}
              />
            </div>
          )}
          {showBusinessDetails && (
            <BusinessDetails
              setLinkSafety={setLinkSafety}
              mapObjPermlink={mapObjPermlink}
              mapCenter={[Number(map?.latitude), Number(map?.longitude)]}
              email={email}
              isEditMode={isEditMode}
              companyIdBody={companyIdBody}
              wobject={wobject}
              phones={phones}
              walletAddress={walletAddress}
              username={userName}
              linkField={linkField}
              website={website}
            />
          )}
          {(groupId || Boolean(productIdBody.length)) && serviceObj && (
            <div style={{ marginBottom: '8px' }}>
              <ProductId
                isSocialGifts
                isEditMode={false}
                authorPermlink={wobject.author_permlink}
                groupId={groupId}
                productIdBody={productIdBody}
              />
            </div>
          )}
          {!isEmpty(departments) && serviceObj && (
            <Department
              isSocialGifts
              departments={departments}
              isEditMode={false}
              history={history}
              wobject={wobject}
            />
          )}
          {!isMobile() && <ProductRewardCard isSocialProduct reward={reward} />}
          {intensive && <GoogleAds limitWidth />}
        </div>
      </div>
      {!isMobile() && showGallery && (
        <div className="SocialProduct__row SocialProduct__right-row">
          <div className="SocialProduct__carouselWrapper">
            <PicturesSlider
              relatedAlbum={relatedAlbum}
              albums={albums}
              altText={description}
              currentWobj={wobject}
              activeOption={activeOption}
              activeCategory={activeCategory}
            />
          </div>
          <div />
        </div>
      )}
    </div>
    <div className="SocialProduct__column">
      {showAddressHoursBlock && (
        <AddressHoursDetails
          mapObjPermlink={mapObjPermlink}
          selectedObjPermlink={wobject.author_permlink}
          history={history}
          address={address}
          map={map}
          workTime={workTime}
          wobject={wobject}
          companyId={companyIdBody}
        />
      )}
      {intensive && <GoogleAds inList />}
      {!isEmpty(wobject.description) && (
        <div className="SocialProduct__aboutItem">
          <div className="SocialProduct__heading">
            {intl.formatMessage({ id: 'about', defaultMessage: 'About' })}
          </div>
          <SocialProductDescription
            description={wobject.description}
            pictures={pictures}
            authorPermlink={wobject.author_permlink}
          />
        </div>
      )}
      {(minimal || moderate || intensive) && <GoogleAds inList />}
      {!isEmpty(menuItem) && (
        <SocialMenuItems
          menuItem={menuItem}
          customVisibility={customVisibility}
          wobject={wobject}
        />
      )}
      {!isEmpty(featured) && (
        <ObjectsSlider
          objects={featured}
          title={intl.formatMessage({ id: 'featured', defaultMessage: 'featured' })}
          name="featured"
        />
      )}
      {!isEmpty(references) &&
        references?.map(ref => (
          <ObjectsSlider key={ref[0]} objects={ref[1]} title={`${ref[0]}s`} name={ref[0]} />
        ))}
      <Experts
        key="experts"
        experts={experts}
        title={intl.formatMessage({ id: 'experts', defaultMessage: 'Experts' })}
        name="experts"
      />
      {!isEmpty(nearbyObjects?.objects) && (
        <ObjectsSlider
          objects={nearbyObjects?.objects}
          title={intl.formatMessage({ id: 'nearby_to_object', defaultMessage: 'Nearby' })}
          name="nearby"
        />
      )}
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
      {!isEmpty(wobject) && <SocialProductReviews wobject={wobject} />}
    </div>
  </div>
);

ClassicBusinessObjectView.propTypes = {
  wobject: PropTypes.shape().isRequired,
  wobjTitle: PropTypes.string,
  userName: PropTypes.string,
  authenticated: PropTypes.bool,
  isEditMode: PropTypes.bool,
  toggleViewEditMode: PropTypes.func,
  albums: PropTypes.arrayOf(PropTypes.shape()),
  relatedAlbum: PropTypes.shape(),
  description: PropTypes.string,
  activeOption: PropTypes.shape(),
  activeCategory: PropTypes.string,
  hoveredOption: PropTypes.shape(),
  setHoveredOption: PropTypes.func,
  price: PropTypes.string,
  reward: PropTypes.arrayOf(PropTypes.shape()),
  showGallery: PropTypes.bool,
  showBusinessDetails: PropTypes.bool,
  showAddressHoursBlock: PropTypes.bool,
  phones: PropTypes.arrayOf(PropTypes.shape()),
  website: PropTypes.arrayOf(PropTypes.shape()),
  linkField: PropTypes.shape(),
  companyIdBody: PropTypes.arrayOf(PropTypes.shape()),
  email: PropTypes.string,
  walletAddress: PropTypes.arrayOf(PropTypes.shape()),
  mapObjPermlink: PropTypes.string,
  map: PropTypes.shape(),
  address: PropTypes.string,
  workTime: PropTypes.string,
  departments: PropTypes.arrayOf(PropTypes.shape()),
  serviceObj: PropTypes.bool,
  groupId: PropTypes.string,
  productIdBody: PropTypes.arrayOf(PropTypes.shape()),
  menuItem: PropTypes.arrayOf(PropTypes.shape()),
  customVisibility: PropTypes.arrayOf(PropTypes.string),
  featured: PropTypes.arrayOf(PropTypes.shape()),
  references: PropTypes.arrayOf(PropTypes.arrayOf()),
  experts: PropTypes.arrayOf(PropTypes.shape()),
  nearbyObjects: PropTypes.shape(),
  tagCategoriesList: PropTypes.arrayOf(PropTypes.shape()),
  history: PropTypes.shape().isRequired,
  setLinkSafety: PropTypes.func,
  linkUrl: PropTypes.string,
  linkUrlHref: PropTypes.string,
  pictures: PropTypes.arrayOf(PropTypes.shape()),
  intensive: PropTypes.bool,
  minimal: PropTypes.bool,
  moderate: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
};

export default ClassicBusinessObjectView;
