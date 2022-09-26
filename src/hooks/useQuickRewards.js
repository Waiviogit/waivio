import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import {
  setSelectedDish,
  setSelectedRestaurant,
  toggleModal,
} from '../store/quickRewards/quickRewardsActions';

const useQuickRewards = () => {
  const dispatch = useDispatch();
  const openModal = useCallback((isNew = false) => dispatch(toggleModal(true, isNew)), [
    toggleModal,
  ]);
  const closeModal = useCallback(() => dispatch(toggleModal(false, false)), [toggleModal]);
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
