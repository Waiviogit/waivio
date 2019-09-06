import { FormattedMessage } from 'react-intl';
import React from 'react';
import { BROKER } from '../constants/platform';

export const optionsAction = [
  {
    value: 'Buy',
    label: <FormattedMessage id="postQuotation.recommend.buy" defaultMessage="Buy" />,
  },
  {
    value: 'Sell',
    label: <FormattedMessage id="postQuotation.recommend.sell" defaultMessage="Sell" />,
  },
];
export const optionsForecast = [
  {
    value: '900',
    label: <FormattedMessage id="createPost.selectLabel.15m" defaultMessage="15m" />,
  },
  {
    value: '1800',
    label: <FormattedMessage id="createPost.selectLabel.30m" defaultMessage="30m" />,
  },
  { value: '3600', label: <FormattedMessage id="createPost.selectLabel.1h" defaultMessage="1h" /> },
  {
    value: '14400',
    label: <FormattedMessage id="createPost.selectLabel.4h" defaultMessage="4h" />,
  },
  {
    value: '28800',
    label: <FormattedMessage id="createPost.selectLabel.8h" defaultMessage="8h" />,
  },
  {
    value: '86400',
    label: <FormattedMessage id="createPost.selectLabel.24h" defaultMessage="24h" />,
  },
  {
    value: '604800',
    label: <FormattedMessage id="createPost.selectLabel.1week" defaultMessage="1 week" />,
  },
  {
    value: '1555200',
    label: <FormattedMessage id="createPost.selectLabel.18days" defaultMessage="18 days" />,
  },
  {
    value: '1814400',
    label: <FormattedMessage id="createPost.selectLabel.3weeks" defaultMessage="3 weeks" />,
  },
  {
    value: 'Custom',
    label: <FormattedMessage id="createPost.selectLabel.custom" defaultMessage="Custom" />,
  },
];
export const optionsPrivacy = [
  {
    value: 'Public',
    label: <FormattedMessage id="createPost.selectLabel.public" defaultMessage="Public" />,
    image: '/static/images/icons/public_post.svg',
  },
  {
    value: 'Private',
    label: <FormattedMessage id="createPost.selectLabel.private" defaultMessage="Private" />,
    image: '/static/images/icons/private_post.svg',
  },
];

export const optionsPlatform = [
  { value: BROKER.UMARKETS, label: 'Umarkets' },
  { value: BROKER.MAXIMARKETS, label: 'Maximarkets' },
  { value: BROKER.MAXITRADE, label: 'Maxitrade' },
];

export const optionsChartType = [
  { value: 'Line', label: 'Line' },
  { value: 'Candle', label: 'Candle' },
];

export const optionsPrice = [{ value: 'Sell', label: 'Bid' }, { value: 'Buy', label: 'Ask' }];

export const optionsTimeScale = [
  { value: 'MINUTE', label: '1m' },
  { value: 'MINUTE5', label: '5m' },
  { value: 'MINUTE15', label: '15m' },
  { value: 'MINUTE30', label: '30m' },
  { value: 'HOUR', label: '1h' },
  { value: 'HOUR4', label: '4h' },
  { value: 'HOUR8', label: '8h' },
  { value: 'DAY', label: '1d' },
  { value: 'WEEK', label: '1w' },
  { value: 'MONTH', label: '1M' },
];

export const optionsPeriod = [
  {
    value: 'LAST_7_DAYS',
    label: <FormattedMessage id="dealsSelect.last7Days" defaultMessage="Last 7 days" />,
  },
  { value: 'TODAY', label: <FormattedMessage id="dealsSelect.today" defaultMessage="Today" /> },
  {
    value: 'YESTERDAY',
    label: <FormattedMessage id="dealsSelect.yesterday" defaultMessage="Yesterday" />,
  },
  {
    value: 'FROM_MONTH_BEGINNING',
    label: (
      <FormattedMessage
        id="dealsSelect.fromMonthBeginning"
        defaultMessage="Since the start of the month"
      />
    ),
  },
  {
    value: 'LAST_MONTH',
    label: <FormattedMessage id="dealsSelect.lastMonth" defaultMessage="Last Month" />,
  },
  {
    value: 'LAST_30_DAYS',
    label: <FormattedMessage id="dealsSelect.last30Days" defaultMessage="Last 30 days" />,
  },
  {
    value: 'LAST_60_DAYS',
    label: <FormattedMessage id="dealsSelect.last60Days" defaultMessage="Last 60 days" />,
  },
  {
    value: 'LAST_90_DAYS',
    label: <FormattedMessage id="dealsSelect.last90Days" defaultMessage="Last 90 days" />,
  },
  {
    value: 'LAST_3_MONTHS',
    label: <FormattedMessage id="dealsSelect.last3Months" defaultMessage="Last 3 Months" />,
  },
  {
    value: 'LAST_6_MONTHS',
    label: <FormattedMessage id="dealsSelect.last6Months" defaultMessage="Last 6 Months" />,
  },
  // { value: 'ALL_TIME', label: <FormattedMessage id="dealsSelect.allTime" defaultMessage="All time" />}
];
export const optionsFieldsPrivacy = [
  { value: 'all', label: <FormattedMessage id="settingsPrivacySelect.all" defaultMessage="all" /> },
  {
    value: 'followers',
    label: <FormattedMessage id="settingsPrivacySelect.followers" defaultMessage="followers" />,
  },
  {
    value: 'hidden',
    label: <FormattedMessage id="settingsPrivacySelect.hidden" defaultMessage="hidden" />,
  },
];
