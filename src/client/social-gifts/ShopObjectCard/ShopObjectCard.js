import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get, isEmpty, truncate, uniq } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import ObjectAvatar from '../../components/ObjectAvatar';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import HeartButton from '../../widgets/HeartButton';
import USDDisplay from '../../components/Utils/USDDisplay';
import { isMobile } from '../../../common/helpers/apiHelpers';

import './ShopObjectCard.less';

const ShopObjectCard = ({ wObject }) => {
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const wobjName = getObjectName(wObject);
  const withRewards = !isEmpty(wObject.propositions);
  const proposition = withRewards ? wObject.propositions[0] : null;
  const linkToObject = ['book', 'product'].includes(wObject.object_type)
    ? `/object/${wObject.object_type}/${wObject.author_permlink}`
    : wObject.defaultShowLink;
  const shopObjectCardClassList = classNames('ShopObjectCard', {
    'ShopObjectCard--rewards': withRewards,
  });

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);

    setTags(uniq([wObject.object_type, ...objectTags]));
  }, [wObject.author_permlink]);

  return (
    <div className={shopObjectCardClassList}>
      {withRewards && (
        <h3 className="ShopObjectCard__rewardTitle">
          Share {proposition.requirements.minPhotos} photos & earn{' '}
          <USDDisplay value={proposition.rewardInUSD} currencyDisplay={'symbol'} />
        </h3>
      )}
      <div className="ShopObjectCard__avatarWrap">
        <ObjectAvatar size={isMobile() ? 100 : 150} item={wObject} />
        <HeartButton wobject={wObject} size={'20px'} />
      </div>
      <Link to={linkToObject} className="ShopObjectCard__name">
        {truncate(wobjName, {
          length: 110,
          separator: '...',
        })}
      </Link>
      {!isEmpty(wObject.rating) && (
        <RatingsWrap
          ratings={[wObject.rating[0]]}
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
            {index === 0 && !wObject.price ? tag : <span>&nbsp;&middot;{` ${tag}`}</span>}
          </span>
        ))}
      </span>
      {!isEmpty(wObject.affiliateLinks) && (
        <div className="ShopObjectCard__affiliatLinksWrap">
          <div className="ShopObjectCard__affiliatLinks">
            {wObject.affiliateLinks
              .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0))
              .map(link => (
                <AffiliatLink key={link.link} link={link} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

ShopObjectCard.propTypes = {
  wObject: PropTypes.shape({
    object_type: PropTypes.string,
    defaultShowLink: PropTypes.string,
    author_permlink: PropTypes.string,
    rating: PropTypes.arrayOf(PropTypes.shape()),
    proposition: PropTypes.shape(),
    price: PropTypes.string,
    affiliateLinks: PropTypes.arrayOf(PropTypes.shape()),
    propositions: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default ShopObjectCard;
