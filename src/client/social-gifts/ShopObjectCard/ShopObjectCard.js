import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty, truncate, uniq } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router';

import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import HeartButton from '../../widgets/HeartButton';
import USDDisplay from '../../components/Utils/USDDisplay';
import { getProxyImageURL } from '../../../common/helpers/image';
import DEFAULTS from '../../object/const/defaultValues';
import { getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import './ShopObjectCard.less';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

const ShopObjectCard = ({ wObject, isChecklist, isSocialProduct }) => {
  const username = useSelector(getAuthenticatedUserName);
  const mainObj = useSelector(getObject);
  const [tags, setTags] = useState([]);
  const wobjName = getObjectName(wObject);
  const { name } = useParams();
  const location = useLocation();
  const withRewards = !isEmpty(wObject.propositions);
  const proposition = withRewards ? wObject.propositions[0] : null;
  const shopObjectCardClassList = classNames('ShopObjectCard', {
    'ShopObjectCard--rewards': withRewards,
  });

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);

    setTags(uniq([wObject.object_type, ...objectTags]));
  }, [wObject.author_permlink]);

  let link;
  const hash = location?.hash
    ? `${location?.hash}/${wObject.author_permlink}`
    : `#${wObject.author_permlink}`;

  switch (wObject.object_type) {
    case 'product':
    case 'business':
    case 'restaurant':
    case 'book': {
      const query = location.hash
        ? `${location.hash.replace('#', '')}/${wObject?.author_permlink}`
        : wObject?.author_permlink;

      link = isChecklist
        ? `${wObject?.defaultShowLink}?breadbrumbs=${name || mainObj.author_permlink}/${query}`
        : wObject?.defaultShowLink;
      break;
    }
    case 'page':
    case 'widget':
    case 'newsfeed':
      link = isChecklist
        ? `/checklist/${name || mainObj.author_permlink}${hash}`
        : wObject?.defaultShowLink;
      break;

    default:
      link = wObject.defaultShowLink;
      break;
  }

  const parent = get(wObject, ['parent'], {});
  let url = wObject?.avatar || parent.avatar;
  const desc = wObject?.description;
  const { firstDescrPart: description } = shortenDescription(removeEmptyLines(desc), 350);
  const altText = description || `${wObject.name} image`;

  if (url) url = getProxyImageURL(url, 'preview');
  else url = DEFAULTS.AVATAR;
  const rating = getRatingForSocial(wObject.rating);
  const withoutHeard = ['page'].includes(wObject?.object_type);
  const locale = useSelector(getUsedLocale);
  const isEnLocale = locale === 'en-US';

  return (
    <div className={shopObjectCardClassList}>
      {withRewards && (
        <h3
          className={
            isEnLocale ? 'ShopObjectCard__rewardTitle' : 'ShopObjectCard__rewardTitle--small'
          }
        >
          <FormattedMessage
            id={`share_photo${proposition?.requirements?.minPhotos === 1 ? '' : 's'}_and_earn`}
            defaultMessage={`Share {minPhotos} photo${
              proposition?.requirements?.minPhotos === 1 ? '' : 's'
            } & earn`}
            values={{ minPhotos: proposition?.requirements?.minPhotos }}
          />{' '}
          {isEnLocale ? (
            <USDDisplay value={proposition.rewardInUSD} currencyDisplay={'symbol'} />
          ) : (
            <div>
              {' '}
              <USDDisplay value={proposition.rewardInUSD} currencyDisplay={'symbol'} />
            </div>
          )}
        </h3>
      )}
      <div className="ShopObjectCard__topInfoWrap">
        {!withoutHeard && <HeartButton wobject={wObject} size={'20px'} />}
        <Link to={link} className="ShopObjectCard__avatarWrap">
          <img className="ShopObjectCard__avatarWrap" src={url} alt={altText} />
        </Link>
      </div>
      <Link
        title={
          wObject?.description
            ? truncate(wObject?.description, { length: 200 })
            : getObjectName(wObject)
        }
        to={link}
        className="ShopObjectCard__name"
      >
        {truncate(wobjName, {
          length: isSocialProduct && isMobile() ? 35 : 110,
          separator: '...',
        })}
      </Link>
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
            {index === 0 && !wObject.price ? tag : <span>&nbsp;&middot;{` ${tag}`}</span>}
          </span>
        ))}
      </span>
      {!isEmpty(wObject.affiliateLinks) && (
        <div className="ShopObjectCard__affiliatLinksWrap">
          <div className="ShopObjectCard__affiliatLinks">
            {wObject.affiliateLinks
              .sort((a, b) => a?.type?.charCodeAt(0) - b?.type?.charCodeAt(0))
              .map(affLink => (
                <AffiliatLink key={affLink.link} link={affLink} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

ShopObjectCard.propTypes = {
  isChecklist: PropTypes.bool,
  isSocialProduct: PropTypes.bool,
  wObject: PropTypes.shape({
    object_type: PropTypes.string,
    avatar: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
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
