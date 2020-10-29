import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import ObjectCardView from '../../objectCard/ObjectCardView';

const PropositionMainObjectCard = ({
  intl,
  wobject,
  currentProposition,
  goToProducts,
  maxReward,
  minReward,
  rewardPrise,
  rewardMax,
}) => (
  <React.Fragment>
    <ObjectCardView wObject={wobject} passedParent={currentProposition} />
    <div className="Campaign__button" role="presentation" onClick={goToProducts}>
      <Button type="primary" size="large">
        {maxReward === minReward ? (
          <React.Fragment>
            <span>
              {intl.formatMessage({
                id: 'rewards_details_earn',
                defaultMessage: 'Earn',
              })}
            </span>
            <span>
              <span className="fw6 ml1">{rewardPrise}</span>
              <Icon type="right" />
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>
              {intl.formatMessage({
                id: 'rewards_details_earn_up_to',
                defaultMessage: 'Earn up to',
              })}
            </span>
            <span>
              <span className="fw6 ml1">{`${rewardMax}`}</span>
              <Icon type="right" />
            </span>
          </React.Fragment>
        )}
      </Button>
    </div>
  </React.Fragment>
);

PropositionMainObjectCard.propTypes = {
  intl: PropTypes.shape(),
  wobject: PropTypes.shape(),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  goToProducts: PropTypes.func,
  maxReward: PropTypes.number,
  minReward: PropTypes.number,
  rewardPrise: PropTypes.string,
  rewardMax: PropTypes.string,
};

PropositionMainObjectCard.defaultProps = {
  intl: {},
  wobject: {},
  currentProposition: [],
  goToProducts: () => {},
  maxReward: null,
  minReward: null,
  rewardPrise: '',
  rewardMax: '',
};

export default PropositionMainObjectCard;
