import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Button, Icon } from 'antd';
import ObjectCardView from '../../../objectCard/ObjectCardView';

const PropositionList = ({
  allPropositions,
  wobject,
  currentProposition,
  renderProposition,
  intl,
  goToProducts,
}) => {
  const minReward = get(currentProposition, ['min_reward'], 0);
  const maxReward = get(currentProposition, ['max_reward'], 0);
  const rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
  const rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';

  return (
    <React.Fragment>
      {wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition) ? (
        <div>
          <ObjectCardView wObject={wobject} passedParent={currentProposition} />
          <div className="Campaign__button" role="presentation" onClick={goToProducts}>
            <Button type="primary" size="large">
              {!rewardMax ? (
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
        </div>
      ) : (
        renderProposition(allPropositions)
      )}
    </React.Fragment>
  );
};

PropositionList.propTypes = {
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  allPropositions: PropTypes.arrayOf(PropTypes.shape()),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  renderProposition: PropTypes.func,
  goToProducts: PropTypes.func,
};

PropositionList.defaultProps = {
  allPropositions: [],
  currentProposition: [],
  renderProposition: () => {},
  goToProducts: () => {},
};

export default injectIntl(PropositionList);
