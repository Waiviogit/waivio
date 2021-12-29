import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { AutoComplete } from 'antd';
import { isEmpty, get, debounce } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
import USDDisplay from '../../../../components/Utils/USDDisplay';

import './FirstScreen.less';

const ModalFirstScreen = props => {
  useEffect(() => {
    if (props.isShow) {
      if (!props.selectedRestaurant) {
        props.getEligibleRewardsList();
      } else {
        props.getEligibleRewardsListWithRestaurant(props.selectedRestaurant);
      }
    }
  }, [props.isShow]);

  const userCardClassList = withReward =>
    classNames('QuickRewardsModal__select-item', {
      'QuickRewardsModal__select-item--withReward': withReward,
    });

  const dishRewards = get(props, 'selectedDish.propositions[0].reward', null);
  const earnMessage = camp =>
    camp.campaigns.max_reward !== camp.campaigns.min_reward ? 'Earn up to' : 'Earn';

  const handleSelectRestaurant = item => {
    const restaurant = props.eligible.find(camp => camp.author_permlink === item);

    props.setSelectedRestaurant(restaurant);
    props.getEligibleRewardsListWithRestaurant(restaurant);
  };

  const handleSelectDish = item => {
    const restaurant = props.dishes.find(camp => camp.author_permlink === item);

    props.setSelectedDish(restaurant);
  };

  const handleDishFilter = (input, dish) =>
    dish.props.name.toLowerCase().includes(input.toLowerCase());

  const handleResetDish = () => {
    props.resetDish();
    props.getEligibleRewardsListWithRestaurant(props.selectedRestaurant);
  };

  const handleResetRestaurant = () => {
    props.resetRestaurant();
    props.getEligibleRewardsList();
  };

  const handleSearchRestaurant = useCallback(
    debounce(search => {
      if (window.gtag) window.gtag('event', 'search_restaurant_in_quick_rewards_modal');
      props.getEligibleRewardsList(search);
    }, 300),
    [],
  );

  const handleSearchDish = useCallback(
    debounce(() => {
      if (window.gtag) window.gtag('event', 'search_dish_in_quick_rewards_modal');
    }, 300),
    [props.selectedRestaurant],
  );

  return (
    <div className="FirstScreen">
      <div className="FirstScreen__selectBlock">
        <h4 className="FirstScreen__title">Select restaurant</h4>
        {props.selectedRestaurant ? (
          <ObjectCardView
            wObject={props.selectedRestaurant}
            closeButton
            onDelete={handleResetRestaurant}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select"
            placeholder="Search"
            onSelect={handleSelectRestaurant}
            onChange={handleSearchRestaurant}
            disabled={isEmpty(props.eligible)}
          >
            {props.eligible.map(camp => {
              if (!isEmpty(camp)) {
                return (
                  <AutoComplete.Option
                    key={camp.author_permlink}
                    className={userCardClassList(camp.campaigns)}
                  >
                    <ObjectSearchCard
                      object={camp}
                      name={getObjectName(camp)}
                      type={getObjectType(camp)}
                      isNeedType
                    />
                    {camp.campaigns && (
                      <span className="FirstScreen__priceWrap">
                        <span className="FirstScreen__earn">{earnMessage(camp)} </span>
                        <USDDisplay
                          value={camp.campaigns.max_reward}
                          currencyDisplay="symbol"
                          style={{ color: '#f98542', 'font-weight': 'bold' }}
                        />
                      </span>
                    )}
                  </AutoComplete.Option>
                );
              }

              return null;
            })}
          </AutoComplete>
        )}
      </div>
      <div className="FirstScreen__selectBlock">
        <h4 className="FirstScreen__title">Select dish</h4>
        {props.selectedDish ? (
          <ObjectCardView
            wObject={props.selectedDish}
            closeButton
            onDelete={handleResetDish}
            withRewards={dishRewards}
            rewardPrice={dishRewards}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select"
            placeholder="Search"
            onSelect={handleSelectDish}
            disabled={!props.selectedRestaurant}
            onChange={handleSearchDish}
            filterOption={handleDishFilter}
          >
            {props.dishes.map(camp => {
              if (!isEmpty(camp)) {
                const reward = get(camp, 'propositions[0].reward', null);

                return (
                  <AutoComplete.Option
                    key={camp.author_permlink}
                    className={userCardClassList(reward)}
                    disabled={isEmpty(props.dishes)}
                    name={getObjectName(camp)}
                  >
                    <ObjectSearchCard
                      object={camp}
                      name={getObjectName(camp)}
                      type={getObjectType(camp)}
                      isNeedType
                      closeButton
                    />
                    {reward && (
                      <span className="FirstScreen__priceWrap">
                        <span className="FirstScreen__earn">Earn </span>
                        <USDDisplay
                          value={reward}
                          currencyDisplay="symbol"
                          style={{ color: '#f98542', 'font-weight': 'bold' }}
                        />
                      </span>
                    )}
                  </AutoComplete.Option>
                );
              }

              return null;
            })}
          </AutoComplete>
        )}
      </div>
    </div>
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
  isShow: PropTypes.func.isRequired,
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
