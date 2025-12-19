import React from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { identity, isEmpty, pickBy } from 'lodash';
import { Icon } from 'antd';
import SocialLinks from '../../../components/SocialLinks/SocialLinks';
import RatingsWrap from '../../../objectCard/RatingsWrap/RatingsWrap';
import SocialProductActions from '../../SocialProduct/SocialProductActions/SocialProductActions';
import PicturesSlider from '../../SocialProduct/PicturesSlider/PicturesSlider';
import SocialProductDescription from '../../SocialProduct/SocialProductDescription/SocialProductDescription';
import ObjectsSlider from '../../SocialProduct/ObjectsSlider/ObjectsSlider';
import SocialTagCategories from '../../SocialProduct/SocialTagCategories/SocialTagCategories';
import SocialProductReviews from '../../SocialProduct/SocialProductReviews/SocialProductReviews';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import Experts from '../Experts/Experts';
import SocialMenuItems from '../../SocialProduct/SocialMenuItems/SocialMenuItems';
import MapObjectInfo from '../../../components/Maps/MapObjectInfo';
import WalletAddress from '../../../app/Sidebar/WalletAddress/WalletAddress';
import CompanyId from '../../../app/Sidebar/CompanyId';
import EmailDraft from '../../../widgets/EmailDraft/EmailDraft';
import ProductRewardCard from '../../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import { isCoordinatesValid } from '../../../components/Maps/mapHelpers';
import { parseWobjectField } from '../../../../common/helpers/wObjectHelper';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { linkFields } from '../../../../common/constants/listOfFields';

import '../BusinessObject.clean.less';

const CleanBusinessObjectView = ({
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
  showGallery,
  phones,
  website,
  email,
  mapObjPermlink,
  map,
  address,
  workTime,
  menuItem,
  customVisibility,
  featured,
  references,
  experts,
  nearbyObjects,
  tagCategoriesList,
  history,
  setLinkSafety,
  pictures,
  intl,
  companyIdBody,
  price,
  linkField,
  walletAddress,
  linkUrl,
  linkUrlHref,
  reward,
}) => {
  const isRenderMap = map && isCoordinatesValid(map.latitude, map.longitude);
  const googleObject = companyIdBody?.find(i => i.companyIdType === 'googleMaps');
  const placeId = googleObject?.companyId;
  const profile = linkField
    ? {
        facebook: linkField[linkFields.linkFacebook] || '',
        twitter: linkField[linkFields.linkTwitter] || '',
        youtube: linkField[linkFields.linkYouTube] || '',
        tiktok: linkField[linkFields.linkTikTok] || '',
        reddit: linkField[linkFields.linkReddit] || '',
        linkedin: linkField[linkFields.linkLinkedIn] || '',
        telegram: linkField[linkFields.linkTelegram] || '',
        whatsapp: linkField[linkFields.linkWhatsApp] || '',
        pinterest: linkField[linkFields.linkPinterest] || '',
        twitch: linkField[linkFields.linkTwitch] || '',
        snapchat: linkField[linkFields.linkSnapchat] || '',
        instagram: linkField[linkFields.linkInstagram] || '',
        github: linkField[linkFields.linkGitHub] || '',
        hive: linkField[linkFields.linkHive] || '',
      }
    : {};

  return (
    <div className="BusinessObjectClean">
      {history.location.search && (
        <div className="BusinessObjectClean__breadcrumbs">
          <Breadcrumbs inProduct />
        </div>
      )}

      <div className="BusinessObjectClean__mainCard">
        <div className="BusinessObjectClean__mainContent">
          <div className="BusinessObjectClean__leftColumn">
            <h1 className="BusinessObjectClean__name">{wobject.name}</h1>
            {!isEmpty(wobjTitle) && <div className="BusinessObjectClean__title">{wobjTitle}</div>}
            {authenticated && !isEmpty(wobject) && (
              <div className="BusinessObjectClean__actions">
                <SocialProductActions
                  currentWobj={wobject}
                  toggleViewEditMode={toggleViewEditMode}
                  isEditMode={isEditMode}
                  authenticated={authenticated}
                />
              </div>
            )}
            <div className="BusinessObjectClean__ratings">
              {!isEmpty(wobject.rating) &&
                wobject.rating.map(rating => (
                  <div key={rating.permlink} className="BusinessObjectClean__ratings-item">
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

            {price && <div className="BusinessObjectClean__price">{price}</div>}

            {wobject.object_type === 'link' && linkUrl && (
              <div className="BusinessObjectClean__urlContainer">
                <ReactSVG
                  className="BusinessObjectClean__urlIcon"
                  src="/images/icons/link-icon.svg"
                  wrapper="span"
                />
                <span
                  className="BusinessObjectClean__urlLink"
                  onClick={() => setLinkSafety(linkUrlHref)}
                >
                  {linkUrl}
                </span>
              </div>
            )}

            <div className="BusinessObjectClean__contactInfo">
              {phones?.length > 0 &&
                phones.map(phone => (
                  <div key={phone.number} className="BusinessObjectClean__contactItem">
                    <Icon type="phone" className="BusinessObjectClean__contactIcon" />
                    <a href={`tel:${phone.number}`}>
                      {phone.body && `${phone.body} `}
                      {phone.number}
                    </a>
                  </div>
                ))}
              {email && (
                <EmailDraft
                  accessExtend={authenticated}
                  email={email}
                  name={wobject.name}
                  permlink={wobject.author_permlink}
                  mapObjPermlink={mapObjPermlink}
                  center={map ? [Number(map.latitude), Number(map.longitude)] : []}
                />
              )}
              {website &&
                website.map(w => {
                  const body = parseWobjectField(w, 'body');

                  return (
                    <div key={body?.link} className="BusinessObjectClean__contactItem">
                      <Icon type="link" className="BusinessObjectClean__contactIcon" />
                      <span
                        className="BusinessObjectClean__websiteLink"
                        onClick={() => setLinkSafety(body?.link)}
                      >
                        {body?.title || 'Website'}
                      </span>
                    </div>
                  );
                })}
            </div>
            {!isEmpty(companyIdBody) && (
              <div className="BusinessObjectClean__companyId">
                <CompanyId companyIdBody={companyIdBody} isSocial />
              </div>
            )}
            {!isEmpty(pickBy(profile, identity)) && (
              <div className="BusinessObjectClean__socialLinks">
                <SocialLinks isSocial profile={pickBy(profile, identity)} />
              </div>
            )}
            {!isEmpty(walletAddress) && (
              <div className="BusinessObjectClean__wallets">
                <WalletAddress walletAddress={walletAddress} isSocial />
              </div>
            )}
          </div>

          {showGallery && (
            <div className="BusinessObjectClean__rightColumn">
              <PicturesSlider
                relatedAlbum={relatedAlbum}
                albums={albums}
                altText={description}
                currentWobj={wobject}
                hoveredOption={hoveredOption}
                activeOption={activeOption}
                activeCategory={activeCategory}
                countShowSlide={6}
                countShowMobile={5}
              />
              {!isEmpty(reward) && <ProductRewardCard isSocialProduct reward={reward} />}
            </div>
          )}
          {!showGallery && !isEmpty(reward) && (
            <div className="BusinessObjectClean__rewardWrap">
              <ProductRewardCard isSocialProduct reward={reward} />
            </div>
          )}
        </div>
      </div>

      <div className="BusinessObjectClean__detailsRow">
        {address && (
          <div className="BusinessObjectClean__detailsCard">
            <div className="BusinessObjectClean__detailsTitle">
              {intl.formatMessage({ id: 'object_field_address', defaultMessage: 'ADDRESS' })}
            </div>
            <div className="BusinessObjectClean__detailsContent">{address}</div>
            {isRenderMap ? (
              <a
                href={
                  googleObject
                    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
                    : `https://www.google.com/maps/search/?api=1&query=${map.latitude},${map.longitude}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="BusinessObjectClean__directionsLink"
              >
                {intl.formatMessage({ id: 'directions', defaultMessage: 'Directions' })}
              </a>
            ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="BusinessObjectClean__directionsLink"
              >
                {intl.formatMessage({ id: 'directions', defaultMessage: 'Directions' })}
              </a>
            )}
          </div>
        )}

        {isRenderMap && (
          <div className="BusinessObjectClean__detailsCard BusinessObjectClean__detailsCard--map">
            <div className="BusinessObjectClean__detailsTitle">
              {intl.formatMessage({ id: 'object_field_map', defaultMessage: 'MAP' })}
            </div>
            <div className="BusinessObjectClean__mapWrapper">
              <MapObjectInfo
                mapObjPermlink={mapObjPermlink}
                selectedObjPermlink={wobject.author_permlink}
                isSocial
                mapHeigth={isMobile() ? 150 : 180}
                center={[Number(map.latitude), Number(map.longitude)]}
                width={isMobile() ? 280 : 200}
                wobject={wobject}
                history={history}
                isWaivio
              />
            </div>
          </div>
        )}

        {workTime && (
          <div className="BusinessObjectClean__detailsCard">
            <div className="BusinessObjectClean__detailsTitle">
              {intl.formatMessage({ id: 'object_field_workTime', defaultMessage: 'HOURS' })}
            </div>
            <div className="BusinessObjectClean__detailsContent BusinessObjectClean__hours">
              {workTime}
            </div>
          </div>
        )}
      </div>

      {!isEmpty(wobject.description) && (
        <div className="BusinessObjectClean__section">
          <div className="BusinessObjectClean__sectionTitle">
            {intl.formatMessage({ id: 'about', defaultMessage: 'About' })}
          </div>
          <div className="BusinessObjectClean__sectionContent">
            <SocialProductDescription
              description={wobject.description}
              pictures={pictures}
              authorPermlink={wobject.author_permlink}
            />
          </div>
        </div>
      )}

      {!isEmpty(menuItem) && (
        <SocialMenuItems
          menuItem={menuItem}
          customVisibility={customVisibility}
          wobject={wobject}
        />
      )}

      {!isEmpty(experts) && (
        <div className="BusinessObjectClean__section">
          <Experts
            key="experts"
            experts={experts}
            title={intl.formatMessage({ id: 'experts', defaultMessage: 'Experts' })}
            name="experts"
          />
        </div>
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

      {!isEmpty(nearbyObjects?.objects) && (
        <ObjectsSlider
          objects={nearbyObjects?.objects}
          title={intl.formatMessage({ id: 'nearby_to_object', defaultMessage: 'Nearby' })}
          name="nearby"
        />
      )}

      {!isEmpty(tagCategoriesList) && (
        <div className="BusinessObjectClean__section">
          <div className="BusinessObjectClean__sectionTitle">
            {intl.formatMessage({ id: 'tags', defaultMessage: 'Tags' })}
          </div>
          <div className="BusinessObjectClean__sectionContent">
            <SocialTagCategories tagCategoriesList={tagCategoriesList} wobject={wobject} />
          </div>
        </div>
      )}

      {!isEmpty(wobject) && (
        <div className="BusinessObjectClean__section">
          <SocialProductReviews wobject={wobject} />
        </div>
      )}
    </div>
  );
};

CleanBusinessObjectView.propTypes = {
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
  showGallery: PropTypes.bool,
  phones: PropTypes.arrayOf(PropTypes.shape()),
  website: PropTypes.arrayOf(PropTypes.shape()),
  email: PropTypes.string,
  mapObjPermlink: PropTypes.string,
  map: PropTypes.shape(),
  address: PropTypes.string,
  workTime: PropTypes.string,
  menuItem: PropTypes.arrayOf(PropTypes.shape()),
  customVisibility: PropTypes.arrayOf(PropTypes.string),
  featured: PropTypes.arrayOf(PropTypes.shape()),
  references: PropTypes.arrayOf(PropTypes.arrayOf()),
  experts: PropTypes.arrayOf(PropTypes.shape()),
  nearbyObjects: PropTypes.shape(),
  tagCategoriesList: PropTypes.arrayOf(PropTypes.shape()),
  history: PropTypes.shape().isRequired,
  setLinkSafety: PropTypes.func,
  reward: PropTypes.arrayOf(PropTypes.shape()),
  pictures: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
  companyIdBody: PropTypes.arrayOf(PropTypes.shape()),
  price: PropTypes.string,
  linkField: PropTypes.shape(),
  walletAddress: PropTypes.arrayOf(PropTypes.shape()),
  linkUrl: PropTypes.string,
  linkUrlHref: PropTypes.string,
};

export default CleanBusinessObjectView;
