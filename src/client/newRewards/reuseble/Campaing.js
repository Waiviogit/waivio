import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { get, isNil } from 'lodash';
import { useSelector } from 'react-redux';
import ObjectCardView from '../../objectCard/ObjectCardView';
import USDDisplay from '../../components/Utils/USDDisplay';
import useQuickRewards from '../../../hooks/useQuickRewards';
import withAuthActions from '../../auth/withAuthActions';
import { getIsSocial, getIsWaivio } from '../../../store/appStore/appSelectors';
import useQuery from '../../../hooks/useQuery';
import { parseJSON } from '../../../common/helpers/parseJSON';

import './Campaing.less';

const Campaing = ({
  campain,
  socialMap,
  isRejected,
  onActionInitiated,
  hovered,
  intl,
  handleReportClick,
  isLinkedObj,
  secondary,
}) => {
  const rewardInUSD = !isNil(campain?.rewardInUSD)
    ? campain?.rewardInUSD
    : secondary?.[0]?.rewardInUSD;
  const type = secondary?.[0]?.type;
  const minReward = campain?.minReward || get(campain, ['min_reward'], 0);
  const maxReward = campain?.maxReward || get(campain, ['max_reward'], 0);
  let mainItem = campain.object;

  if (campain.user) {
    const profile = campain.user?.posting_json_metadata
      ? parseJSON(campain.user.posting_json_metadata)?.profile
      : null;

    mainItem = {
      name: campain.user.name,
      object_type: 'user',
      avatar: campain.user.profile_image,
      description: profile?.about,
      author_permlink: campain.user.name,
    };
  }
  const buttonLabel =
    maxReward === minReward
      ? intl.formatMessage({ id: 'earn', defaultMessage: 'Earn' })
      : intl.formatMessage({ id: 'rewards_details_earn_up_to', defaultMessage: 'Earn up to' });
  const history = useHistory();
  const query = useQuery();
  let pathname = history.location.pathname?.includes('/rewards/')
    ? `${history.location.pathname}/eligible`
    : `/rewards/${campain.reach?.[0] || 'global'}/all`;

  if (query.get('showAll')) {
    pathname = `${history.location.pathname}/all`;
  }

  const { setRestaurant, openModal } = useQuickRewards();
  const isWaivio = useSelector(getIsWaivio);
  const isSocial = useSelector(getIsSocial);
  const handleOpenQuickRewards = () =>
    onActionInitiated(() => {
      openModal(true);
      setRestaurant({
        ...mainItem,
        campaigns: { min_reward: minReward, max_reward: maxReward },
        rewardInUSD,
        type,
      });
    });

  const goToProducts = obj => {
    if (isWaivio || isSocial) {
      const link = obj.object_type === 'user' ? `@${obj?.author_permlink}` : obj?.author_permlink;

      history.push(`${pathname}/${link}`);
    } else {
      handleOpenQuickRewards();
    }
  };

  return (
    <div className="Campaing">
      <ObjectCardView
        isLinkedObj={isLinkedObj}
        socialMap={socialMap}
        wObject={mainItem}
        withRewards
        rewardPrice={maxReward}
        hovered={hovered}
        handleReportClick={handleReportClick}
        isRejected={isRejected}
      />
      <span onClick={() => goToProducts(mainItem)} className="Campaing__button">
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
    rewardInUSD: PropTypes.number,
    reach: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    user: PropTypes.shape({
      posting_json_metadata: PropTypes.string,
      name: PropTypes.string,
      profile_image: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
  secondary: PropTypes.shape({ rewardInUSD: PropTypes.number }),
  onActionInitiated: PropTypes.func.isRequired,
  handleReportClick: PropTypes.func,
  hovered: PropTypes.bool,
  socialMap: PropTypes.bool,
  isRejected: PropTypes.bool,
  isLinkedObj: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
};

Campaing.defaultProps = {
  hovered: false,
  isLinkedObj: false,
  isRejected: false,
  socialMap: false,
  handleReportClick: null,
};

export default injectIntl(withAuthActions(Campaing));
