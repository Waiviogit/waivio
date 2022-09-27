import React from 'react';
import { Icon } from 'antd';
import { get, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { getCurrentCurrency } from '../../../../../store/appStore/appSelectors';
import USDDisplay from '../../../Utils/USDDisplay';
import useQuickRewards from '../../../../../hooks/useQuickRewards';
import withAuthActions from '../../../../auth/withAuthActions';
import { getObject } from '../../../../../waivioApi/ApiClient';

const OverlayRewardsButton = props => {
  const ObjectOverlayCardEarnClassList = classNames('ObjectOverlayCard__earn', {
    'ObjectOverlayCard__earn--proposition': props.isPropos,
  });

  const { setDish, setRestaurant, openModal } = useQuickRewards();
  const currencyInfo = useSelector(getCurrentCurrency);
  const proposition =
    props.wObject?.propositions?.find(propos => propos?.newCampaigns) ||
    get(props.wObject, 'propositions[0]', {});
  const campaign = get(props.wObject, 'campaigns', {});
  const reward = props.isPropos
    ? proposition.rewardInUSD || proposition.reward
    : campaign.max_reward;
  const handleClickProposButton = async () => {
    if (proposition?.newCampaigns) {
      const requiredObject = await getObject(proposition?.requiredObject);

      setRestaurant({ ...requiredObject, campaigns: { newCampaigns: true } });
      setDish({ ...proposition, object: props.wObject });
    } else {
      setRestaurant(proposition.required_object);
      setDish(props.wObject);
    }

    openModal();
  };

  const handleClickCampaignButton = () => {
    setRestaurant(props.wObject);
    openModal();
  };

  const handleButtonClick = () =>
    props.onActionInitiated(() =>
      props.isPropos ? handleClickProposButton() : handleClickCampaignButton(),
    );

  const hasSeveralMeanings =
    !isEmpty(campaign.campaigns) && campaign.max_reward === campaign.min_reward;

  return (
    <button className={ObjectOverlayCardEarnClassList} onClick={handleButtonClick}>
      {!hasSeveralMeanings
        ? props.intl.formatMessage({
            id: 'rewards_details_earn',
            defaultMessage: 'Earn',
          })
        : props.intl.formatMessage({
            id: 'rewards_details_earn_up_to',
            defaultMessage: 'Earn up to',
          })}{' '}
      <b>
        <USDDisplay value={reward} currencyDisplay="symbol" />{' '}
        <span className="ObjectOverlayCard__currency">{currencyInfo.type}</span>{' '}
        {!props.isPropos && <Icon type="right" />}
      </b>
    </button>
  );
};

OverlayRewardsButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  wObject: PropTypes.shape({
    author_permlink: PropTypes.string,
    propositions: PropTypes.arrayOf(PropTypes.shape()),
    campaigns: PropTypes.shape({
      max_reward: PropTypes.number,
      min_reward: PropTypes.number,
    }),
  }).isRequired,
  isPropos: PropTypes.bool.isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

export default withAuthActions(OverlayRewardsButton);
