import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';

import ObjectCardView from '../../objectCard/ObjectCardView';
import USDDisplay from '../../components/Utils/USDDisplay';

import './Campaing.less';

const Campaing = ({ campain }) => {
  const buttonLabel = campain.maxReward === campain.minReward ? 'Earn' : 'Earn to';
  const location = useLocation();

  return (
    <div className="Campaing">
      <ObjectCardView wObject={campain.object} withRewards rewardPrice={campain.maxReward} />
      <Link
        to={`${location.pathname}/${campain?.object?.author_permlink}`}
        className="Campaing__button"
      >
        {buttonLabel}{' '}
        <b>
          <USDDisplay value={campain.maxReward} />
        </b>{' '}
        <Icon type="right" />
      </Link>
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
};

export default Campaing;
