import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';
import { toggleModal } from '../../../store/quickRewards/quickRewardsActions';

const SubmitDishPhotosButton = props => {
  if (!props.isAuth) return null;

  const openModal = () => props.toggleModal(true);

  return (
    <a className={props.className} onClick={openModal}>
      <Icon type="camera" /> Submit dish photos
    </a>
  );
};

SubmitDishPhotosButton.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  className: PropTypes.func.isRequired,
};

export default connect(state => ({ isAuth: getIsAuthenticated(state) }), { toggleModal })(
  SubmitDishPhotosButton,
);
