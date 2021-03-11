import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import ObjectCardView from '../../objectCard/ObjectCardView';

const PropositionMainObjectCard = ({
  intl,
  wobject,
  currentProposition,
  goToProducts,
  rewardPrise,
  proposSize,
}) => (
  <React.Fragment>
    <ObjectCardView wObject={wobject} passedParent={currentProposition} />
    <div className="Campaign__button" role="presentation" onClick={goToProducts}>
      <Button type="primary" size="large">
        <span>
          {proposSize <= 1
            ? intl.formatMessage({
                id: 'rewards_details_earn',
                defaultMessage: 'Earn',
              })
            : intl.formatMessage({
                id: 'rewards_details_earn_up_to',
                defaultMessage: 'Earn up to',
              })}
        </span>
        <span>
          <span className="fw6 ml1">{rewardPrise}</span>
          <Icon type="right" />
        </span>
      </Button>
    </div>
  </React.Fragment>
);

PropositionMainObjectCard.propTypes = {
  intl: PropTypes.shape(),
  wobject: PropTypes.shape(),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  goToProducts: PropTypes.func,
  rewardPrise: PropTypes.string,
  proposSize: PropTypes.number,
};

PropositionMainObjectCard.defaultProps = {
  intl: {},
  wobject: {},
  currentProposition: [],
  goToProducts: () => {},
  rewardPrise: '',
  proposSize: 0,
};

export default PropositionMainObjectCard;
