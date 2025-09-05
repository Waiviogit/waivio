import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, has, isEmpty, truncate, uniq } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useParams, useHistory } from 'react-router';

import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  createQueryBreadcrumbs,
  getObjectName,
  isNewInstacartProgram,
  isOldInstacartProgram,
} from '../../../common/helpers/wObjectHelper';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import HeartButton from '../../widgets/HeartButton';
import USDDisplay from '../../components/Utils/USDDisplay';
import { getProxyImageURL } from '../../../common/helpers/image';
import DEFAULTS from '../../object/const/defaultValues';
import { getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import { getUsedLocale } from '../../../store/appStore/appSelectors';

import './ShopObjectCard.less';
import { getTagName } from '../../../common/helpers/tagsNamesList';
import useQuery from '../../../hooks/useQuery';
import InstacartWidget from '../../widgets/InstacartWidget';

const ShopObjectCard = ({ wObject, isChecklist, isSocialProduct }) => {
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const wobjName = getObjectName(wObject);
  const { name } = useParams();
  const history = useHistory();
  const withRewards = !isEmpty(wObject?.propositions) || has(wObject, 'campaigns');
  const proposition = withRewards ? wObject?.propositions?.[0] || wObject?.campaigns : null;
  const rewardAmount = proposition?.rewardInUSD || proposition?.max_reward;
  const shopObjectCardClassList = classNames('ShopObjectCard', {
    'ShopObjectCard--rewards': withRewards,
  });
  const query = useQuery();
  let breadbrumbsFromQuery = query?.get('breadcrumbs');

  breadbrumbsFromQuery = breadbrumbsFromQuery ? breadbrumbsFromQuery.split('/') : null;
  const breadbrumbs = `?breadcrumbs=${createQueryBreadcrumbs(
    wObject.author_permlink,
    breadbrumbsFromQuery,
    name,
  )}`;

  useEffect(() => {
    const objectTags = get(wObject, 'topTags', []);

    setTags(uniq([wObject.object_type, ...objectTags]));
  }, [wObject.author_permlink]);

  let link;

  switch (wObject.object_type) {
    case 'product':
    case 'recipe':
    case 'business':
    case 'place':
    case 'link':
    case 'restaurant':
    case 'page':
    case 'widget':
    case 'newsfeed':
    case 'book': {
      const defaultLink = wObject.defaultShowLink?.endsWith('/about')
        ? wObject.defaultShowLink.slice(0, -6)
        : wObject.defaultShowLink;

      link = isChecklist ? `${defaultLink}${breadbrumbs}` : `/object/${wObject?.author_permlink}`;
      break;
    }
    case 'shop':
      link = `/object-shop/${wObject?.author_permlink}`;
      break;
    default:
      link = `/object/${wObject?.author_permlink}`;
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
  const locale = useSelector(getUsedLocale);
  const isEnLocale = locale === 'en-US';
  const objLink = `/object/${wObject.author_permlink}`;
  const onClick = useCallback(
    e => {
      const isInstacartButton = e.target?.className?.includes('instacart');

      if (!isInstacartButton) {
        history.push(link);
      }
    },
    [link, history],
  );

  return (
    <div onClick={onClick} className={shopObjectCardClassList}>
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
            <USDDisplay value={rewardAmount} currencyDisplay={'symbol'} />
          ) : (
            <div>
              {' '}
              <USDDisplay value={rewardAmount} currencyDisplay={'symbol'} />
            </div>
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
        title={
          wObject?.description
            ? truncate(wObject?.description, { length: 200 })
            : getObjectName(wObject)
        }
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
    campaigns: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

export default ShopObjectCard;
