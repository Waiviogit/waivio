import { size, get, reduce, map, round } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

export const getCurrentOfferPercent = value => `${100 - value}%`;
export const handleOffersReward = value => `$${round(value, 2)}`;
export const handleOffersPercent = value => `${value}%`;
export const handleFeesValue = value => `$${value}`;
export const getCurrentFeesValue = value => value * (value / 100);
export const handleProcessingFees = (staticValue, currentValue) =>
  `$${(staticValue * (staticValue / 100) * currentValue) / 100}`;
export const handleRefName = refName => refName.replace(/^"(.+(?="$))"$/, '$1');
export const handleStatusDaysLeft = days => {
  const currentValue = String(days);

  return currentValue.split('-').join('');
};
export const getPrymaryObjectLink = sponsor =>
  get(sponsor, ['details', 'main_object', 'author_permlink']);
export const getReviewObjectLink = sponsor =>
  get(sponsor, ['details', 'review_object', 'author_permlink']);
export const getPrymaryObjectName = sponsor => get(sponsor, 'details.main_object.name', '');
export const getReviewObjectName = sponsor => get(sponsor, 'details.review_object.name', '');
export const getReservationPermlink = sponsor => get(sponsor, ['details', 'reservation_permlink']);
export const getSponsoredUserWeight = sponsor =>
  ` (${(10000 -
    reduce(sponsor.details.beneficiaries, (amount, benef) => amount + benef.weight, 0)) /
    100}%)`;

export const handleLoadMoreUserStatusCards = ({
  username,
  currentUserCards,
  isLoadingMoreUserCards,
  getMoreUserCards,
  sort,
}) => {
  let skip = 0;
  const limit = 10;
  const userCardsLength = size(currentUserCards);

  if (userCardsLength >= limit) {
    skip = userCardsLength;
  }
  if (!isLoadingMoreUserCards) {
    getMoreUserCards(username, sort, skip, limit);
  }
};

export const getBeneficiaresInfo = sponsor =>
  sponsor.details.beneficiaries
    ? map(get(sponsor, 'details.beneficiaries', []), beneficiar => (
        <React.Fragment key={beneficiar.account}>
          <Link to={`/@${beneficiar.account}`}>{beneficiar.account}</Link>
          <span>{` (${beneficiar.weight / 100}%), `}</span>
        </React.Fragment>
      ))
    : null;

export const widget = username =>
  `<iframe src="https://www.waivio.com/rewards/all/?display=widget!ref=${username}" height="400" width="350" style="border: none;">Can't load Rewards widget.</iframe>`;

export const getCopyTextButtonResult = (setIsCopyButton, username) => {
  const reservoir = document.createElement('textarea');

  reservoir.value = widget(username);
  document.body.appendChild(reservoir);
  reservoir.select();
  document.execCommand('copy');
  document.body.removeChild(reservoir);

  return setIsCopyButton(true);
};
