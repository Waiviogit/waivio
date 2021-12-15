import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import {
  setSelectedDish,
  setSelectedRestaurant,
  toggleModal,
} from '../store/quickRewards/quickRewardsActions';

const useQuickRewards = () => {
  const dispatch = useDispatch();
  const openModal = useCallback(() => dispatch(toggleModal(true)), [toggleModal]);
  const closeModal = useCallback(() => dispatch(toggleModal(false)), [toggleModal]);
  const setRestaurant = useCallback(restaurant => dispatch(setSelectedRestaurant(restaurant)), [
    setSelectedRestaurant,
  ]);
  const setDish = useCallback(dish => dispatch(setSelectedDish(dish)), [setSelectedDish]);

  return {
    setRestaurant,
    setDish,
    openModal,
    closeModal,
  };
};

export default useQuickRewards;
