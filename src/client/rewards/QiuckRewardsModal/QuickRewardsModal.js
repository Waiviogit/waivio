import React, { useEffect } from 'react';
import { Modal, AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  getEligibleRewardsList,
  getEligibleRewardsListWithRestaurant, setSelectedDish,
  setSelectedRestaurant,
} from '../../../store/quickRewards/quickRewardsActions';
import {
  getDishRewardsListFromState,
  getEligibleRewardsListFromState, getSelectedDish, getSelectedRestaurant,
} from '../../../store/quickRewards/quickRewardsSelectors';
import { getObjectName, getObjectType } from '../../helpers/wObjectHelper';
import ObjectSearchCard from '../../components/ObjectSearchCard/ObjectSearchCard';

import './QuickRewardsModal.less';

const QuickRewardsModal = props => {
  useEffect(() => {
    props.getEligibleRewardsList();
  }, []);

  const handleSelectRestaurant = item => {
    const restaurant = props.eligible.find(camp => camp.required_object.author_permlink === item);

    props.setSelectedRestaurant(restaurant.required_object);
    props.getEligibleRewardsListWithRestaurant(restaurant.required_object);
  };

  const handleSelectDish = item => {
    const restaurant = props.eligible.find(camp => camp.required_object.author_permlink === item);

    props.setSelectedDish(restaurant.required_object);
  };

  return (
    <Modal title="Submit dish photos and earn crypto!" visible>
      <div>
        <h4>Choose a restaurant</h4>
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
                  Earn up to 9.99
                </AutoComplete.Option>
              );
            }
          })}
        </AutoComplete>
      </div>
      <div>
        <h4>Choose a dish</h4>
        <AutoComplete className="QuickRewardsModal__select" placeholder="Search" onSelect={handleSelectDish}>
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
                  Earn up to 9.99
                </AutoComplete.Option>
              );
            }
          })}
        </AutoComplete>
      </div>
    </Modal>
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
    setSelectedDish
  },
)(QuickRewardsModal);
