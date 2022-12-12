import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import ObjectCardView from '../../objectCard/ObjectCardView';
import USDDisplay from '../../components/Utils/USDDisplay';
import useQuickRewards from '../../../hooks/useQuickRewards';
import withAuthActions from '../../auth/withAuthActions';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import useWebsiteColor from '../../../hooks/useWebsiteColor';

import './Campaing.less';

const Campaing = ({ campain, onActionInitiated, hovered }) => {
  const minReward = campain?.minReward || get(campain, ['min_reward'], 0);
  const maxReward = campain?.maxReward || get(campain, ['max_reward'], 0);
  const buttonLabel = maxReward === minReward ? 'Earn' : 'Earn up to';
  const history = useHistory();
  const pathname = history.location.pathname.includes('/rewards/')
    ? location.pathname
    : '/rewards/all';
  const { setRestaurant, openModal } = useQuickRewards();
  const isWaivio = useSelector(getIsWaivio);
  const styles = useWebsiteColor();
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
      <ObjectCardView
        wObject={campain.object}
        withRewards
        rewardPrice={maxReward}
        hovered={hovered}
      />
      <span onClick={goToProducts} style={styles} className="Campaing__button">
        {buttonLabel}{' '}
        <b>
          <USDDisplay value={maxReward} />
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
  hovered: PropTypes.bool,
};

Campaing.defaultProps = {
  hovered: false,
};

export default withAuthActions(Campaing);
