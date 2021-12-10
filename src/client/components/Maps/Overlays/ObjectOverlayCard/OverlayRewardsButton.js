import React from 'react';
import { useHistory } from 'react-router';
import { Icon } from 'antd';
import { get, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, useSelector } from 'react-redux';
import { getCurrentCurrency } from '../../../../../store/appStore/appSelectors';
import USDDisplay from '../../../Utils/USDDisplay';
import {
  setSelectedDish,
  setSelectedRestaurant,
  toggleModal,
} from '../../../../../store/quickRewards/quickRewardsActions';

const OverlayRewardsButton = props => {
  const ObjectOverlayCardEarnClassList = classNames('ObjectOverlayCard__earn', {
    'ObjectOverlayCard__earn--proposition': props.isPropos,
  });
  const currencyInfo = useSelector(getCurrentCurrency);
  const proposition = get(props.wObject, 'propositions[0]', {});
  const campaign = get(props.wObject, 'campaigns', {});
  const reward = props.isPropos ? proposition.reward : campaign.max_reward;
  const history = useHistory();
  const handleClickProposButton = () => {
    props.setSelectedRestaurant(proposition.required_object);
    props.setSelectedDish(props.wObject);
    props.toggleModal(true);
  };

  const handleClickCampaignButton = () => {
    history.push(`/rewards/all/${props.wObject.author_permlink}`);
  };
  const handleButtonClick = () =>
    props.isPropos ? handleClickProposButton() : handleClickCampaignButton();

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
  setSelectedRestaurant: PropTypes.func.isRequired,
  setSelectedDish: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default connect(null, { setSelectedDish, setSelectedRestaurant, toggleModal })(
  OverlayRewardsButton,
);
