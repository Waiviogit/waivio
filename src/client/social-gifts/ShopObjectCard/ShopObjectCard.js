import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { get, has, isEmpty, uniq } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useParams, useHistory } from 'react-router';
import moment from 'moment';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { createQueryBreadcrumbs, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getProxyImageURL } from '../../../common/helpers/image';
import DEFAULTS from '../../object/const/defaultValues';
import { getRatingForSocial } from '../../components/Sidebar/Rate/rateHelper';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import useTemplateProvider from '../../../designTemplates/TemplateProvider';
import useQuery from '../../../hooks/useQuery';

import './ShopObjectCard.less';

const ShopObjectCard = ({ wObject, isChecklist, isSocialProduct }) => {
  const username = useSelector(getAuthenticatedUserName);
  const [tags, setTags] = useState([]);
  const wobjName = getObjectName(wObject);
  const { name } = useParams();
  const history = useHistory();
  const withRewards = !isEmpty(wObject?.propositions) || has(wObject, 'campaigns');
  const proposition = withRewards ? wObject?.propositions?.[0] || wObject?.campaigns : null;
  const rewardAmount = proposition?.rewardInUSD || proposition?.max_reward;
  const campaignTypesList = wObject?.campaigns?.campaignTypes || [];
  const propositionContest = wObject?.propositions?.[0]?.type === 'contests_object';
  const propositionGiveaway = wObject?.propositions?.[0]?.type === 'giveaways_object';
  const isGiveawayCampaign = campaignTypesList.includes('giveaways_object') || propositionGiveaway;
  const isContestCampaign = campaignTypesList.includes('contests_object') || propositionContest;
  const isSpecialCampaign = isGiveawayCampaign || isContestCampaign;
  const daysLeft =
    proposition?.nextEventDate && !isEmpty(proposition?.nextEventDate)
      ? Math.max(
          0,
          moment
            .utc(proposition.nextEventDate)
            .startOf('day')
            .diff(moment().startOf('day'), 'days'),
        )
      : null;

  const getCampaignText = (isGiveaway, days) => {
    if (days === 0) return isGiveaway ? ' - Today!' : ' - Win Today!';
    if (days === 1) return isGiveaway ? ' - 1 Day Left!' : ' - Win in 1 Day!';

    return isGiveaway ? ` - ${days} Days Left!` : ` - Win in ${days} Days!`;
  };

  const specialAmount = isContestCampaign
    ? get(proposition, ['contestRewards', 0, 'rewardInUSD'], rewardAmount)
    : rewardAmount;
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

  const templateComponents = useTemplateProvider();
  const ShopObjectCardView = templateComponents?.ShopObjectCardView;

  if (!ShopObjectCardView) {
    return null;
  }

  return (
    <ShopObjectCardView
      wObject={wObject}
      isChecklist={isChecklist}
      isSocialProduct={isSocialProduct}
      username={username}
      url={url}
      altText={altText}
      objLink={objLink}
      wobjName={wobjName}
      rating={rating}
      tags={tags}
      withRewards={withRewards}
      isEnLocale={isEnLocale}
      shopObjectCardClassList={shopObjectCardClassList}
      proposition={proposition}
      isSpecialCampaign={isSpecialCampaign}
      isGiveawayCampaign={isGiveawayCampaign}
      daysLeft={daysLeft}
      specialAmount={specialAmount}
      rewardAmount={rewardAmount}
      getCampaignText={getCampaignText}
      onClick={onClick}
    />
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
