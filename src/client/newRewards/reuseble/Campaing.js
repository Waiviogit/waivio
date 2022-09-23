import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import ObjectCardView from '../../objectCard/ObjectCardView';
import USDDisplay from '../../components/Utils/USDDisplay';
import useQuickRewards from '../../../hooks/useQuickRewards';
import withAuthActions from '../../auth/withAuthActions';
import { getIsWaivio } from '../../../store/appStore/appSelectors';

import './Campaing.less';

const Campaing = ({ campain, onActionInitiated }) => {
  const buttonLabel = campain.maxReward === campain.minReward ? 'Earn' : 'Earn up to';
  const location = useLocation();
  const pathname = location.pathname.includes('reward') ? location.pathname : '/rewards-new/all';
  const { setRestaurant, openModal } = useQuickRewards();
  const minReward = get(campain, ['min_reward'], 0);
  const maxReward = get(campain, ['max_reward'], 0);
  const isWaivio = useSelector(getIsWaivio);

  const handleOpenQuickRewards = () =>
    onActionInitiated(() => {
      openModal(true);
      setRestaurant({
        ...campain.object,
        campaigns: { min_reward: minReward, max_reward: maxReward },
      });
    });

  const goToProducts = () => {
    if (isWaivio) history.push(`${pathname}/${campain?.object?.author_permlink}`);
    else {
      handleOpenQuickRewards();
    }
  };

  return (
    <div className="Campaing">
      <ObjectCardView wObject={campain.object} withRewards rewardPrice={campain.maxReward} />
      <span onClick={goToProducts} className="Campaing__button">
        {buttonLabel}{' '}
        <b>
          <USDDisplay value={campain.maxReward} />
        </b>{' '}
        <Icon type="right" />
      </span>
    </div>
  );
};

Campaing.propTypes = {
  campain: PropTypes.shape({
    maxReward: PropTypes.number,
    minReward: PropTypes.number,
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

export default withAuthActions(Campaing);
