import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty, truncate } from 'lodash';
import RatingsWrap from '../../../objectCard/RatingsWrap/RatingsWrap';
import AffiliatLink from '../../../widgets/AffiliatLinks/AffiliatLink';
import HeartButton from '../../../widgets/HeartButton';
import USDDisplay from '../../../components/Utils/USDDisplay';
import {
  isNewInstacartProgram,
  isOldInstacartProgram,
} from '../../../../common/helpers/wObjectHelper';
import { getTagName } from '../../../../common/helpers/tagsNamesList';
import { isMobile } from '../../../../common/helpers/apiHelpers';

import InstacartWidget from '../../../widgets/InstacartWidget';

const ClassicShopObjectCardView = ({
  wObject,
  isSocialProduct,
  username,
  url,
  altText,
  objLink,
  wobjName,
  rating,
  tags,
  withRewards,
  isEnLocale,
  shopObjectCardClassList,
  proposition,
  isSpecialCampaign,
  isGiveawayCampaign,
  daysLeft,
  specialAmount,
  rewardAmount,
  getCampaignText,
  onClick,
}) => (
  <div className={shopObjectCardClassList} onClick={onClick}>
    {withRewards && (
      <h3
        className={
          isEnLocale ? 'ShopObjectCard__rewardTitle' : 'ShopObjectCard__rewardTitle--small'
        }
      >
        {isSpecialCampaign ? (
          <>
            <USDDisplay value={specialAmount} currencyDisplay="symbol" />{' '}
            {isGiveawayCampaign ? 'Giveaway' : 'Contest'}
            {daysLeft !== null && getCampaignText(isGiveawayCampaign, daysLeft)}
          </>
        ) : (
          <>
            <FormattedMessage
              id={`share_photo${proposition?.requirements?.minPhotos === 1 ? '' : 's'}_and_earn`}
              defaultMessage={`Share {minPhotos} photo${
                proposition?.requirements?.minPhotos === 1 ? '' : 's'
              } & earn`}
              values={{ minPhotos: proposition?.requirements?.minPhotos }}
            />{' '}
            {isEnLocale ? (
              <USDDisplay value={rewardAmount} currencyDisplay={'symbol'} />
            ) : (
              <div>
                {' '}
                <USDDisplay value={rewardAmount} currencyDisplay={'symbol'} />
              </div>
            )}
          </>
        )}
      </h3>
    )}
    <div className="ShopObjectCard__topInfoWrap">
      <HeartButton wobject={wObject} size={'20px'} />
      <a href={objLink} onClick={e => e.preventDefault()} className="ShopObjectCard__avatarWrap">
        <img className="ShopObjectCard__avatarWrap" src={url} alt={altText} />
      </a>
    </div>
    <a
      href={objLink}
      onClick={e => e.preventDefault()}
      title={wObject?.description ? truncate(wObject?.description, { length: 200 }) : wobjName}
      className="ShopObjectCard__name"
    >
      {truncate(wobjName, {
        length: isSocialProduct && isMobile() ? 35 : 110,
        separator: '...',
      })}
    </a>
    {!isEmpty(rating) && (
      <RatingsWrap
        ratings={[rating]}
        username={username}
        wobjId={wObject.author_permlink}
        wobjName={wobjName}
      />
    )}
    <span className="ObjectCardView__tag-text">
      {wObject.price && (
        <span className="ShopObjectCard__price" title={wObject.price}>
          {wObject.price}
        </span>
      )}
      {tags.map((tag, index) => (
        <span key={tag}>
          {index === 0 && !wObject.price ? (
            getTagName(tag)
          ) : (
            <span>&nbsp;&middot;{` ${getTagName(tag)}`}</span>
          )}
        </span>
      ))}
    </span>
    {!isEmpty(wObject.affiliateLinks) && (
      <div className="ShopObjectCard__affiliatLinksWrap">
        <div className="ShopObjectCard__affiliatLinks">
          {wObject.affiliateLinks
            .sort((a, b) => a?.type?.charCodeAt(0) - b?.type?.charCodeAt(0))
            .map(affLink => {
              if (
                affLink.type.toLocaleLowerCase() === 'instacart' &&
                isNewInstacartProgram(affLink)
              )
                return (
                  <InstacartWidget
                    key={affLink.link}
                    instacartAff={affLink}
                    wobjPerm={wObject?.author_permlink}
                  />
                );
              if (
                affLink.type.toLocaleLowerCase() === 'instacart' &&
                isOldInstacartProgram(affLink)
              )
                return null;

              return <AffiliatLink key={affLink.link} link={affLink} />;
            })}
        </div>
      </div>
    )}
  </div>
);

ClassicShopObjectCardView.propTypes = {
  wObject: PropTypes.shape({
    author_permlink: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    affiliateLinks: PropTypes.arrayOf(PropTypes.shape()),
  }),
  isSocialProduct: PropTypes.bool,
  username: PropTypes.string,
  url: PropTypes.string,
  altText: PropTypes.string,
  objLink: PropTypes.string,
  wobjName: PropTypes.string,
  rating: PropTypes.shape(),
  tags: PropTypes.arrayOf(PropTypes.string),
  withRewards: PropTypes.bool,
  isEnLocale: PropTypes.bool,
  shopObjectCardClassList: PropTypes.string,
  proposition: PropTypes.shape(),
  isSpecialCampaign: PropTypes.bool,
  isGiveawayCampaign: PropTypes.bool,
  daysLeft: PropTypes.number,
  specialAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rewardAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getCampaignText: PropTypes.func,
  onClick: PropTypes.func,
};

export default ClassicShopObjectCardView;
