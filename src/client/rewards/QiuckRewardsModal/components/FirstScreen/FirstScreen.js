import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AutoComplete } from 'antd';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';

import ObjectCardView from '../../../../objectCard/ObjectCardView';
import ObjectSearchCard from '../../../../components/ObjectSearchCard/ObjectSearchCard';
import { getObjectName, getObjectType } from '../../../../helpers/wObjectHelper';
import {
  getDishRewardsListFromState,
  getEligibleRewardsListFromState,
  getSelectedDish,
  getSelectedRestaurant,
} from '../../../../../store/quickRewards/quickRewardsSelectors';
import {
  getEligibleRewardsList,
  getEligibleRewardsListWithRestaurant,
  resetDish,
  resetRestaurant,
  setSelectedDish,
  setSelectedRestaurant,
} from '../../../../../store/quickRewards/quickRewardsActions';

const ModalFirstScreen = props => {
  useEffect(() => {
    props.getEligibleRewardsList();
  }, []);

  const dishRewards = get(props, 'selectedDish.propositions[0].reward', null);
  const earnMessage = camp =>
    camp.campaigns.max_reward !== camp.campaigns.min_reward
      ? `Earn up to ${camp.campaigns.max_reward}`
      : `Earn ${camp.campaigns.max_reward}`;

  const handleSelectRestaurant = item => {
    const restaurant = props.eligible.find(camp => camp.author_permlink === item);

    props.setSelectedRestaurant(restaurant);
    props.getEligibleRewardsListWithRestaurant(restaurant);
  };

  const handleSelectDish = item => {
    const restaurant = props.dishes.find(camp => camp.author_permlink === item);

    props.setSelectedDish(restaurant);
  };

  return (
    <React.Fragment>
      <div>
        <h4>Choose a restaurant</h4>
        {props.selectedRestaurant ? (
          <ObjectCardView
            wObject={props.selectedRestaurant}
            closeButton
            onDelete={props.resetRestaurant}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select"
            placeholder="Search"
            onSelect={handleSelectRestaurant}
          >
            {props.eligible.map(camp => {
              if (!isEmpty(camp)) {
                return (
                  <AutoComplete.Option
                    key={camp.author_permlink}
                    className="QuickRewardsModal__select-item"
                  >
                    <ObjectSearchCard
                      object={camp}
                      name={getObjectName(camp)}
                      type={getObjectType(camp)}
                      isNeedType
                    />
                    {camp.campaigns && earnMessage(camp)}
                  </AutoComplete.Option>
                );
              }

              return null;
            })}
          </AutoComplete>
        )}
      </div>
      <div>
        <h4>Choose a dish</h4>
        {props.selectedDish ? (
          <ObjectCardView
            wObject={props.selectedDish}
            closeButton
            onDelete={props.resetDish}
            withRewards={dishRewards}
            rewardPrice={dishRewards}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select"
            placeholder="Search"
            onSelect={handleSelectDish}
          >
            {props.dishes.map(camp => {
              if (!isEmpty(camp)) {
                const reward = get(camp, 'propositions[0].reward', null);

                return (
                  <AutoComplete.Option
                    key={camp.author_permlink}
                    className="QuickRewardsModal__select-item"
                  >
                    <ObjectSearchCard
                      object={camp}
                      name={getObjectName(camp)}
                      type={getObjectType(camp)}
                      isNeedType
                      closeButton
                    />
                    {reward && <span>Earn {reward}</span>}
                  </AutoComplete.Option>
                );
              }

              return null;
            })}
          </AutoComplete>
        )}
      </div>
    </React.Fragment>
  );
};

ModalFirstScreen.propTypes = {
  selectedDish: PropTypes.shape().isRequired,
  selectedRestaurant: PropTypes.shape().isRequired,
  dishes: PropTypes.arrayOf().isRequired,
  eligible: PropTypes.arrayOf().isRequired,
  resetDish: PropTypes.func.isRequired,
  getEligibleRewardsList: PropTypes.func.isRequired,
  setSelectedRestaurant: PropTypes.func.isRequired,
  resetRestaurant: PropTypes.func.isRequired,
  getEligibleRewardsListWithRestaurant: PropTypes.func.isRequired,
  setSelectedDish: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    eligible: getEligibleRewardsListFromState(state),
    dishes: getDishRewardsListFromState(state),
    selectedRestaurant: getSelectedRestaurant(state),
    selectedDish: getSelectedDish(state),
  }),
  {
    getEligibleRewardsList,
    setSelectedRestaurant,
    getEligibleRewardsListWithRestaurant,
    setSelectedDish,
    resetRestaurant,
    resetDish,
  },
)(ModalFirstScreen);
