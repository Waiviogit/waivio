import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ObjectCardView from '../../objectCard/ObjectCardView';
import USDDisplay from '../../components/Utils/USDDisplay';

import './Campaing.less';

const Campaing = ({ campain }) => {
  const buttonLabel = campain.maxReward === campain.minReward ? 'Earn' : 'Earn to';

  return (
    <div className="Campaing">
      <ObjectCardView wObject={campain.object} withRewards rewardPrice={campain.maxReward} />
      <Link to={`/rewards-new/all/${campain._id}`} className="Campaing__button">
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
    object: PropTypes.shape({}),
    _id: PropTypes.string,
  }).isRequired,
};

export default Campaing;
