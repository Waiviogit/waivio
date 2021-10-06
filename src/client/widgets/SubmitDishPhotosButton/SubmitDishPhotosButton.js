import { Icon } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleModal } from '../../../store/quickRewards/quickRewardsActions';
import withAuthActions from '../../auth/withAuthActions';

const SubmitDishPhotosButton = props => {
  const openModal = () => {
    props.toggleModal(true);
    if (window.gtag) window.gtag('event', 'on_click_submit_dish_photos');
  };

  const onClick = () => props.onActionInitiated(openModal);

  return (
    <a className={props.className} onClick={onClick}>
      <Icon type="camera" /> Submit dish photos
    </a>
  );
};

SubmitDishPhotosButton.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  className: PropTypes.func.isRequired,
  onActionInitiated: PropTypes.func.isRequired,
};

export default withAuthActions(connect(null, { toggleModal })(SubmitDishPhotosButton));
