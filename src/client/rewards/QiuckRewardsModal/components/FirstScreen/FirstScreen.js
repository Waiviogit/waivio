import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AutoComplete } from 'antd';
import { isEmpty, get, debounce } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import ObjectCardView from '../../../../objectCard/ObjectCardView';
import ObjectSearchCard from '../../../../components/ObjectSearchCard/ObjectSearchCard';
import { getObjectName, getObjectType } from '../../../../../common/helpers/wObjectHelper';
import {
  getDishRewardsListFromState,
  getEligibleRewardsListFromState,
  getSelectedDish,
  getSelectedRestaurant,
} from '../../../../../store/quickRewards/quickRewardsSelectors';
import {
  getEligibleRewardsList,
  getEligibleRewardsListWithRestaurant,
  getMoreEligibleRewardsListWithRestaurant,
  resetDish,
  resetRestaurant,
  setSelectedDish,
  setSelectedRestaurant,
} from '../../../../../store/quickRewards/quickRewardsActions';
import USDDisplay from '../../../../components/Utils/USDDisplay';
import useWebsiteColor from '../../../../../hooks/useWebsiteColor';
import { isAppleDevice, isMobile } from '../../../../../common/helpers/apiHelpers';

import './FirstScreen.less';

const ModalFirstScreen = props => {
  const [hasMore, setHasMore] = useState(false);
  const [hideRest, setHideRest] = useState(false);
  const limit = 100;
  const skipLimit = props.dishes.length;
  const colors = useWebsiteColor();
  const restaurantSelectorClassList = classNames('FirstScreen__selectBlock', {
    'FirstScreen__selectBlock--width': hideRest && isAppleDevice(),
    'FirstScreen__selectBlock--hide': hideRest && !isAppleDevice(),
  });

  useEffect(() => {
    hasMore && props.getMoreEligibleRewardsListWithRestaurant(props.selectedRestaurant, skipLimit);
  }, [props.dishes.length, hasMore]);

  useEffect(() => {
    if (props.isShow) {
      if (!props.selectedRestaurant) {
        props.getEligibleRewardsList();
      } else {
        props.getEligibleRewardsListWithRestaurant(props.selectedRestaurant, limit);
      }
    }
  }, [props.isShow]);

  const userCardClassList = withReward =>
    classNames('QuickRewardsModal__select-item', {
      'QuickRewardsModal__select-item--withReward': withReward,
    });

  const dishRewards =
    props?.selectedDish?.rewardInUSD ||
    get(props, 'selectedDish.propositions[0].rewardInUSD', null);
  const withRewads = dishRewards && !get(props, 'selectedDish.propositions[0].notEligible', null);
  const earnMessage = camp =>
    camp.campaigns.max_reward !== camp.campaigns.min_reward
      ? props.intl.formatMessage({ id: 'rewards_details_earn_up_to', defaultMessage: 'Earn up to' })
      : props.intl.formatMessage({ id: 'rewards_details_earn', defaultMessage: 'Earn' });

  const handleSelectRestaurant = item => {
    const restaurant = props.eligible.find(camp => camp.author_permlink === item);

    props.setSelectedRestaurant(restaurant);
    props.getEligibleRewardsListWithRestaurant(restaurant, limit).then(r => {
      if (r?.payload?.length === limit) {
        setHasMore(true);
      }
    });
  };

  const handleSelectDish = item => {
    const dish = props.dishes.find(camp => camp.author_permlink === item);

    props.setSelectedDish(dish);
    setHideRest(false);
  };

  const handleDishFilter = (input, dish) =>
    dish.props.name.toLowerCase().includes(input.toLowerCase());

  const handleResetDish = () => {
    props.resetDish();
    props.getEligibleRewardsListWithRestaurant(props.selectedRestaurant, limit).then(r => {
      if (r.payload.length === limit) {
        setHasMore(true);
        props.getMoreEligibleRewardsListWithRestaurant(props.selectedRestaurant, skipLimit);
      }
    });
  };

  const handleResetRestaurant = () => {
    props.resetRestaurant();
    props.getEligibleRewardsList();
  };

  const handleSearchRestaurant = useCallback(
    debounce(search => {
      if (typeof window !== 'undefined' && window.gtag)
        window.gtag('event', 'search_restaurant_in_quick_rewards_modal', { debug_mode: false });
      props.getEligibleRewardsList(search);
    }, 300),
    [],
  );

  const handleSearchDish = useCallback(
    debounce(() => {
      if (typeof window !== 'undefined' && window.gtag)
        window.gtag('event', 'search_dish_in_quick_rewards_modal', { debug_mode: false });
    }, 300),
    [props.selectedRestaurant],
  );

  const handleDishFocus = () => {
    if (isMobile()) {
      const modalWrap = document && document.querySelector('.ant-modal-wrap');

      if (isAppleDevice()) {
        setTimeout(() => {
          modalWrap.scroll(0, 0);
          setHideRest(true);
        }, 100);
      } else {
        modalWrap.scroll(0, 0);
        setHideRest(true);
      }
    }
  };

  return (
    <div className="FirstScreen">
      <div className={restaurantSelectorClassList}>
        <h4 className="FirstScreen__title">
          {props.intl.formatMessage({
            id: 'select_restaurant',
            defaultMessage: 'Select restaurant',
          })}
        </h4>
        {props.selectedRestaurant ? (
          <ObjectCardView
            wObject={props.selectedRestaurant}
            closeButton
            onDelete={handleResetRestaurant}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select"
            placeholder={props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' })}
            onSelect={handleSelectRestaurant}
            onChange={handleSearchRestaurant}
            disabled={isEmpty(props.eligible)}
            open
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
                    {camp.campaigns && !camp.campaigns.notEligible && (
                      <span className="FirstScreen__priceWrap">
                        <span className="FirstScreen__earn">{earnMessage(camp)} </span>
                        <USDDisplay
                          value={camp.campaigns.max_reward}
                          currencyDisplay="symbol"
                          style={{ color: colors.background, 'font-weight': 'bold' }}
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
        <h4 className="FirstScreen__title">
          {props.intl.formatMessage({ id: 'select_dish', defaultMessage: 'Select dish or drink' })}
        </h4>
        {props.selectedDish ? (
          <ObjectCardView
            wObject={props.selectedDish}
            closeButton
            onDelete={handleResetDish}
            withRewards={withRewads}
            rewardPrice={dishRewards}
            passedParent={props.selectedRestaurant}
          />
        ) : (
          <AutoComplete
            className="QuickRewardsModal__select QuickRewardsModal__select-second"
            placeholder={props.intl.formatMessage({ id: 'search', defaultMessage: 'Search' })}
            onSelect={handleSelectDish}
            disabled={!props.selectedRestaurant}
            onChange={handleSearchDish}
            filterOption={handleDishFilter}
            autoFocus={false}
            onFocus={handleDishFocus}
            onBlur={() => setHideRest(false)}
          >
            {props.dishes.map(camp => {
              if (!isEmpty(camp)) {
                const reward = camp?.rewardInUSD || get(camp, 'propositions[0].rewardInUSD', null);
                const notEligible =
                  camp?.notEligible || get(camp, 'propositions[0].notEligible', null);

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
                    {reward && !notEligible && (
                      <span className="FirstScreen__priceWrap">
                        <span className="FirstScreen__earn">
                          {props.intl.formatMessage({ id: 'earn', defaultMessage: 'Earn' })}{' '}
                        </span>
                        <USDDisplay
                          value={reward}
                          currencyDisplay="symbol"
                          style={{ color: colors.background, 'font-weight': 'bold' }}
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
  getMoreEligibleRewardsListWithRestaurant: PropTypes.func.isRequired,
  setSelectedDish: PropTypes.func.isRequired,
  isShow: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(
  connect(
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
      getMoreEligibleRewardsListWithRestaurant,
      setSelectedDish,
      resetRestaurant,
      resetDish,
    },
  )(ModalFirstScreen),
);
