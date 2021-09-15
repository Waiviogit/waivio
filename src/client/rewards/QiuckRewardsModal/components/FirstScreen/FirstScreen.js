import React, {useEffect} from 'react';

import ObjectCardView from '../../../../objectCard/ObjectCardView';
import { AutoComplete } from 'antd';
import { isEmpty } from 'lodash';
import ObjectSearchCard from '../../../../components/ObjectSearchCard/ObjectSearchCard';
import { getObjectName, getObjectType } from '../../../../helpers/wObjectHelper';
import {connect} from "react-redux";
import {
  getDishRewardsListFromState,
  getEligibleRewardsListFromState, getSelectedDish, getSelectedRestaurant
} from "../../../../../store/quickRewards/quickRewardsSelectors";
import {
  getEligibleRewardsList,
  getEligibleRewardsListWithRestaurant, resetDish, resetRestaurant, setSelectedDish,
  setSelectedRestaurant
} from "../../../../../store/quickRewards/quickRewardsActions";

const ModalFirstScreen = props => {
  useEffect(() => {
    props.getEligibleRewardsList();
  }, []);

  const earnMessage = camp =>
    camp.max_reward !== camp.min_reward
      ? `Earn up to ${camp.max_reward}`
      : `Earn ${camp.max_reward}`;

  const handleSelectRestaurant = item => {
    const restaurant = props.eligible.find(camp => camp.required_object.author_permlink === item);

    props.setSelectedRestaurant(restaurant.required_object);
    props.getEligibleRewardsListWithRestaurant(restaurant.required_object);
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
                    key={camp.required_object.author_permlink}
                    className="QuickRewardsModal__select-item"
                  >
                    <ObjectSearchCard
                      object={camp.required_object}
                      name={getObjectName(camp.required_object)}
                      type={getObjectType(camp.required_object)}
                      isNeedType
                    />
                    {earnMessage(camp)}
                  </AutoComplete.Option>
                );
              }
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
            withRewards
            rewardPrice={props.selectedDish.reward}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select"
            placeholder="Search"
            onSelect={handleSelectDish}
          >
            {props.dishes.map(camp => {
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
                      closeButton
                    />
                    Earn {camp.reward}
                  </AutoComplete.Option>
                );
              }
            })}
          </AutoComplete>
        )}
      </div>
    </React.Fragment>
  );
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
