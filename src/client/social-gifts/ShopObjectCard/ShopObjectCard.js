import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get, isEmpty, uniq } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ObjectAvatar from '../../components/ObjectAvatar';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import HeartButton from '../../widgets/HeartButton';

import './ShopObjectCard.less';

const ShopObjectCard = ({ wObject }) => {
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const wobjName = getObjectName(wObject);
  const shopObjectCardClassList = classNames('ShopObjectCard', {
    'ShopObjectCard--rewards': !wObject.proposition,
  });

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);

    setTags(uniq([wObject.object_type, ...objectTags]));
  }, [wObject.author_permlink]);

  return (
    <div className={shopObjectCardClassList}>
      <div className="ShopObjectCard__avatarWrap">
        <ObjectAvatar size={150} item={wObject} />
        <HeartButton wobject={wObject} size={'20px'} />
      </div>
      <h4 className="ShopObjectCard__name">{wobjName}</h4>
      <RatingsWrap
        ratings={[wObject.rating[0]]}
        username={username}
        wobjId={wObject.author_permlink}
        wobjName={wobjName}
      />
      <span className="ObjectCardView__tag-text">
        {wObject.price && (
          <span className="ObjectCardView__price" title={wObject.price}>
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
            {wObject.affiliateLinks.map(link => (
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
    author_permlink: PropTypes.string,
    rating: PropTypes.arrayOf(PropTypes.shape()),
    proposition: PropTypes.shape(),
    price: PropTypes.string,
    affiliateLinks: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default ShopObjectCard;
