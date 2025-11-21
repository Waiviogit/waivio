import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, truncate } from 'lodash';
import { Icon } from 'antd';
import HeartButton from '../../../widgets/HeartButton';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { averageRate } from '../../../components/Sidebar/Rate/rateHelper';

import '../ShopObjectCard.clean.less';

const CleanShopObjectCardView = ({
  wObject,
  isSocialProduct,
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
  onClick,
}) => (
  <div className="ShopObjectCardClean" onClick={onClick}>
    <a href={objLink} onClick={e => e.preventDefault()} className="ShopObjectCardClean__imageWrap">
      <img className="ShopObjectCardClean__image" src={url} alt={altText} />
      {withRewards && (
        <div className="ShopObjectCardClean__rewardBadge">
          {isSpecialCampaign ? (
            <>
              <USDDisplay value={specialAmount} currencyDisplay="symbol" />
              {isGiveawayCampaign ? ' Giveaway' : ' Contest'}
            </>
          ) : (
            <>
              <USDDisplay value={rewardAmount} currencyDisplay={'symbol'} />
              <span className="ShopObjectCardClean__rewardText">Reward</span>
            </>
          )}
        </div>
      )}
      <div className="ShopObjectCardClean__heart">
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
      {!isEmpty(rating) && (
        <div className="ShopObjectCardClean__rating">
          <Icon type="star" theme="filled" className="ShopObjectCardClean__ratingStar" />
          <span className="ShopObjectCardClean__ratingValue">{averageRate(rating).toFixed(1)}</span>
        </div>
      )}
      <div className="ShopObjectCardClean__meta">
        {wObject.price && (
          <span className="ShopObjectCardClean__price" title={wObject.price}>
            {wObject.price}
          </span>
        )}
      </div>
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
  onClick: PropTypes.func,
};

export default CleanShopObjectCardView;
