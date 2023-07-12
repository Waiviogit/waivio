import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import ObjectCardView from '../../objectCard/ObjectCardView';
import USDDisplay from '../../components/Utils/USDDisplay';
import useQuickRewards from '../../../hooks/useQuickRewards';
import withAuthActions from '../../auth/withAuthActions';
import { getIsWaivio } from '../../../store/appStore/appSelectors';
import useQuery from '../../../hooks/useQuery';

import './Campaing.less';

const Campaing = ({ campain, isRejected, onActionInitiated, hovered, intl, handleReportClick }) => {
  const minReward = campain?.minReward || get(campain, ['min_reward'], 0);
  const maxReward = campain?.maxReward || get(campain, ['max_reward'], 0);
  const buttonLabel =
    maxReward === minReward
      ? intl.formatMessage({ id: 'earn', defaultMessage: 'Earn' })
      : intl.formatMessage({ id: 'rewards_details_earn_up_to', defaultMessage: 'Earn up to' });
  const history = useHistory();
  const query = useQuery();
  let pathname = history.location.pathname.includes('/rewards/')
    ? `${location.pathname}/eligible`
    : `/rewards/${campain.reach?.[0] || 'global'}/all`;

  if (query.get('showAll')) {
    pathname = `${location.pathname}/all`;
  }

  const { setRestaurant, openModal } = useQuickRewards();
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
      <ObjectCardView
        wObject={campain.object}
        withRewards
        rewardPrice={maxReward}
        hovered={hovered}
        handleReportClick={handleReportClick}
        isRejected={isRejected}
      />
      <span onClick={goToProducts} className="Campaing__button">
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
    reach: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
  onActionInitiated: PropTypes.func.isRequired,
  handleReportClick: PropTypes.func,
  hovered: PropTypes.bool,
  isRejected: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
};

Campaing.defaultProps = {
  hovered: false,
  isRejected: false,
  handleReportClick: null,
};

export default injectIntl(withAuthActions(Campaing));
