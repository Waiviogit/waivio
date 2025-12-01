import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import { isEmpty, truncate } from 'lodash';
import HeartButton from '../../../widgets/HeartButton';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import AffiliatLink from '../../../widgets/AffiliatLinks/AffiliatLink';
import InstacartWidget from '../../../widgets/InstacartWidget';
import {
  isNewInstacartProgram,
  isOldInstacartProgram,
} from '../../../../common/helpers/wObjectHelper';

import '../ShopObjectCard.clean.less';

const CleanShopObjectCardView = ({
  wObject,
  isSocialProduct,
  isAuthenticated,
  url,
  altText,
  objLink,
  wobjName,
  rating,
  withRewards,
  isSpecialCampaign,
  isGiveawayCampaign,
  specialAmount,
  rewardAmount,
  proposition,
  daysLeft,
  onClick,
}) => (
  <div className="ShopObjectCardClean" onClick={onClick}>
    <a href={objLink} onClick={e => e.preventDefault()} className="ShopObjectCardClean__imageWrap">
      <img className="ShopObjectCardClean__image" src={url} alt={altText} />
      <div
        className={classNames('ShopObjectCardClean__heart', {
          'ShopObjectCardClean__heart--no-border': !isAuthenticated,
        })}
      >
        <HeartButton wobject={wObject} size={'20px'} />
      </div>
    </a>
    <div className="ShopObjectCardClean__content">
      <a
        href={objLink}
        onClick={e => e.preventDefault()}
        title={wObject?.description ? truncate(wObject?.description, { length: 200 }) : wobjName}
        className="ShopObjectCardClean__name"
      >
        {truncate(wobjName, {
          length: isSocialProduct && isMobile() ? 35 : 110,
          separator: '...',
        })}
      </a>

      <div className="ShopObjectCardClean__priceRow">
        <div>
          {!isEmpty(rating) && (
            <div className="ShopObjectCardClean__rating">
              <Icon type="star" theme="filled" />
              <span>{rating.average?.toFixed(1) || rating.rating_value}</span>
            </div>
          )}
          {wObject.price && (
            <span className="ShopObjectCardClean__price" title={wObject.price}>
              {wObject.price}
            </span>
          )}
        </div>
        {!isEmpty(wObject.affiliateLinks) && (
          <div className="ShopObjectCardClean__affiliatLinks">
            {wObject.affiliateLinks
              .sort((a, b) => a?.type?.charCodeAt(0) - b?.type?.charCodeAt(0))
              .map(affLink => {
                if (
                  affLink.type.toLocaleLowerCase() === 'instacart' &&
                  isNewInstacartProgram(affLink)
                )
                  return (
                    <InstacartWidget
                      inCard
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
        )}
      </div>
      {withRewards && (
        <div className="ShopObjectCardClean__rewardText">
          {isSpecialCampaign ? (
            <>
              <USDDisplay value={specialAmount} currencyDisplay="symbol" />
              {isGiveawayCampaign
                ? ` Giveaway${daysLeft !== null ? ` - ${daysLeft} Days Left!` : ''}`
                : ` Contest${daysLeft !== null ? ` - Win in ${daysLeft} Days!` : ''}`}
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
              <USDDisplay value={rewardAmount} currencyDisplay={'symbol'} />
            </>
          )}
        </div>
      )}
    </div>
  </div>
);

CleanShopObjectCardView.propTypes = {
  wObject: PropTypes.shape({
    author_permlink: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    affiliateLinks: PropTypes.arrayOf(PropTypes.shape()),
  }),
  isSocialProduct: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  url: PropTypes.string,
  altText: PropTypes.string,
  objLink: PropTypes.string,
  wobjName: PropTypes.string,
  rating: PropTypes.shape(),
  withRewards: PropTypes.bool,
  isSpecialCampaign: PropTypes.bool,
  isGiveawayCampaign: PropTypes.bool,
  specialAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rewardAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  proposition: PropTypes.shape(),
  daysLeft: PropTypes.number,
  onClick: PropTypes.func,
};

export default CleanShopObjectCardView;
