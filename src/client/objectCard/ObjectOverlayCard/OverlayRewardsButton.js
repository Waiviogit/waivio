import { Link } from 'react-router-dom';
import React from 'react';
import { Icon } from 'antd';
import { get, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { getCurrentCurrency } from '../../store/appStore/appSelectors';

const OverlayRewardsButton = props => {
  const ObjectOverlayCardEarnClassList = classNames('ObjectOverlayCard__earn', {
    'ObjectOverlayCard__earn--proposition': props.isPropos,
  });
  const currencyInfo = useSelector(getCurrentCurrency);
  const proposition = get(props.wObject, 'propositions[0]', {});
  const campaign = get(props.wObject, 'campaigns', {});
  const reward = props.isPropos ? proposition.reward : campaign.max_reward;
  const linkTo = props.isPropos
    ? `/rewards/all/${proposition.requiredObject}`
    : `/rewards/all/${props.wObject.author_permlink}`;
  const hasSeveralMeanings =
    !isEmpty(campaign.campaigns) && campaign.max_reward === campaign.min_reward;

  return (
    <Link
      data-anchor={props.wObject.author_permlink}
      className={ObjectOverlayCardEarnClassList}
      to={linkTo}
    >
      {!hasSeveralMeanings
        ? props.intl.formatMessage({
            id: 'rewards_details_earn',
            defaultMessage: 'Earn',
          })
        : props.intl.formatMessage({
            id: 'rewards_details_earn_up_to',
            defaultMessage: 'Earn up to',
          })}{' '}
      <b data-anchor={props.wObject.author_permlink}>
        {reward * currencyInfo.rate} {currencyInfo.type} {!props.isPropos && <Icon type="right" />}
      </b>
    </Link>
  );
};

OverlayRewardsButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  wObject: PropTypes.shape({
    author_permlink: PropTypes.string,
    propositions: PropTypes.arrayOf(),
    campaigns: PropTypes.shape({
      max_reward: PropTypes.number,
      min_reward: PropTypes.number,
    }),
  }).isRequired,
  isPropos: PropTypes.bool.isRequired,
};

export default OverlayRewardsButton;
