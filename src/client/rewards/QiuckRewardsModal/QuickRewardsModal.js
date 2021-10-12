import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  getIsOpenModal,
  getSelectedDish,
  getSelectedRestaurant,
} from '../../../store/quickRewards/quickRewardsSelectors';
import USDDisplay from '../../components/Utils/USDDisplay';
import ModalFirstScreen from './components/FirstScreen/FirstScreen';
import ModalSecondScreen from './components/SecondScreen/SecondScreen';
import {
  createQuickPost,
  reserveProposition,
  toggleModal,
} from '../../../store/quickRewards/quickRewardsActions';
import SubmitReviewPublish from '../../post/CheckReviewModal/SubmitReviewPublish';

import './QuickRewardsModal.less';

const QuickRewardsModal = props => {
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topics, setTopic] = useState(['food', 'restaurant']);
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);

  const isPropositionObj = !isEmpty(get(props.selectedDish, 'propositions'));
  const nextButtonClassList = classNames('QuickRewardsModal__button', {
    'QuickRewardsModal__button--withRewards': isPropositionObj,
  });
  const requirements = get(props, 'selectedDish.propositions[0].requirements.minPhotos', 0);

  const closeModal = () => {
    props.toggleModal(false);
    setPageNumber(1);
  };

  const handleOnClickBack = () => setPageNumber(1);

  const handleOnClickPublishButton = () => {
    setLoading(true);
    if (isPropositionObj) {
      if (window.gtag) window.gtag('event', 'reserve_proposition_in_quick_rewards_modal');
      props.reserveProposition();
      setPageNumber(3);
    } else {
      handleCreatePost();
    }
    setLoading(false);
  };

  const handleCreatePost = () => {
    setLoading(true);

    if (window.gtag) window.gtag('event', 'create_post_in_quick_rewards_modal');
    props.createQuickPost(topics, images).then(() => setLoading(false));
  };

  const getCurrentScreen = (() => {
    switch (pageNumber) {
      case 1:
        return {
          component: <ModalFirstScreen isShow={props.isOpenModal} />,
          buttonName: 'Next',
          buttonHandler: () => setPageNumber(2),
          disabled: isEmpty(props.selectedDish) || isEmpty(props.selectedRestaurant),
        };
      case 2:
        return {
          component: (
            <ModalSecondScreen
              topics={topics}
              setTopic={setTopic}
              setBody={setBody}
              images={images}
              setImages={setImages}
            />
          ),
          buttonName: 'Publish',
          buttonHandler: handleOnClickPublishButton,
          disabled: !body || (requirements && requirements !== images.length),
        };
      case 3:
        return {
          component: (
            <SubmitReviewPublish
              primaryObject={props.selectedRestaurant}
              reviewData={props.selectedDish.propositions[0].guide}
            />
          ),
          buttonName: 'Submit',
          buttonHandler: handleCreatePost,
          disabled: false,
        };

      default:
        return null;
    }
  })();

  return (
    <Modal
      title="Submit dish photos and earn crypto!"
      footer={null}
      visible={props.isOpenModal}
      onCancel={closeModal}
      className="QuickRewardsModal"
    >
      {getCurrentScreen.component}
      <div className="QuickRewardsModal__button-wrap">
        {pageNumber === 2 && (
          <Button type="primary" className={nextButtonClassList} onClick={handleOnClickBack}>
            Back
          </Button>
        )}
        {isPropositionObj && (
          <b>
            YOU EARN:{' '}
            <USDDisplay
              value={props.selectedDish.propositions[0].reward}
              currencyDisplay="symbol"
            />
          </b>
        )}
        <Button
          type="primary"
          className={nextButtonClassList}
          disabled={getCurrentScreen.disabled}
          loading={loading}
          onClick={getCurrentScreen.buttonHandler}
        >
          {getCurrentScreen.buttonName}
        </Button>
      </div>
    </Modal>
  );
};

QuickRewardsModal.propTypes = {
  selectedDish: PropTypes.shape().isRequired,
  selectedRestaurant: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  createQuickPost: PropTypes.func.isRequired,
  reserveProposition: PropTypes.func.isRequired,
  isOpenModal: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    selectedRestaurant: getSelectedRestaurant(state),
    selectedDish: getSelectedDish(state),
    isOpenModal: getIsOpenModal(state),
  }),
  {
    createQuickPost,
    reserveProposition,
    toggleModal,
  },
)(QuickRewardsModal);
