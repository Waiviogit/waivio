import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
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
import StepsItems from '../../widgets/CircleSteps/StepsItems';
import { declineProposition } from '../../../store/userStore/userActions';
import { generatePermlink } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import './QuickRewardsModal.less';

const QuickRewardsModal = props => {
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topics, setTopic] = useState(['food', 'restaurant']);
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const [reservationPermlink, setReservationPermlink] = useState('');
  const stepsConfig = [
    {
      title: 'Find the dish',
      num: 1,
    },
    {
      title: 'Submit photos',
      num: 2,
    },
    {
      title: 'Confirm and earn',
      num: 3,
    },
  ];
  const isPropositionObj = !isEmpty(get(props.selectedDish, 'propositions'));

  const nextButtonClassList = classNames('QuickRewardsModal__button', {
    'QuickRewardsModal__button--withRewards': isPropositionObj,
  });
  const buttonWrapClassList = classNames('QuickRewardsModal__button-wrap', {
    'QuickRewardsModal__button-wrap--firstScreen': pageNumber === 1,
  });
  const minPhotos = get(props, 'selectedDish.propositions[0].requirements.minPhotos', 0);

  const closeModal = () => {
    props.toggleModal(false);

    if (reservationPermlink) {
      handelRejectReservation();
      setReservationPermlink('');
    }

    setPageNumber(1);
  };

  const handleOnClickBack = e => {
    e.currentTarget.blur();
    setPageNumber(1);
    setTopic(['food', 'restaurant']);
    setBody('');
    setImages([]);
  };

  const handleOnClickPublishButton = e => {
    e.currentTarget.blur();
    setLoading(true);
    if (isPropositionObj) {
      if (window.gtag) window.gtag('event', 'reserve_proposition_in_quick_rewards_modal');
      const permlink = `reserve-${generatePermlink()}`;

      props
        .reserveProposition(permlink)
        .then(() => {
          setReservationPermlink(permlink);
          setPageNumber(3);
          setLoading(false);
        })
        .catch(() => {
          message.error('Error');
          setLoading(false);
        });
    } else {
      handleCreatePost();
    }
  };

  const handleCreatePost = () => {
    setLoading(true);

    if (window.gtag) window.gtag('event', 'create_post_in_quick_rewards_modal');
    props.createQuickPost(body, topics, images, reservationPermlink).then(() => setLoading(false));
  };

  const handelRejectReservation = () => {
    const proposition = get(props.selectedDish, 'propositions[0]', {});
    const unreservationPermlink = `reject-${proposition._id}${generatePermlink()}`;

    props.declineProposition({
      companyAuthor: proposition.guideName,
      companyPermlink: proposition.activation_permlink,
      objPermlink: props.selectedDish.author_permlink,
      unreservationPermlink,
      reservationPermlink,
    });
  };

  const getCurrentScreen = (() => {
    const guideInfo = get(props.selectedDish, 'propositions[0].guide');

    switch (pageNumber) {
      case 1:
        return {
          component: <ModalFirstScreen isShow={props.isOpenModal} />,
          buttonName: 'Next',
          buttonHandler: e => {
            e.currentTarget.blur();
            setPageNumber(2);
          },
          disabled: isEmpty(props.selectedDish) || isEmpty(props.selectedRestaurant),
        };
      case 2:
        const secondScreenButtonName = isPropositionObj ? 'Next' : 'Publish';
        const secondScreenButtonHandler = isPropositionObj
          ? handleCreatePost
          : handleOnClickPublishButton;
        const secondScreenDisabled = isPropositionObj && minPhotos && minPhotos > images.length;
        const secondScreenPreviousHandler = reservationPermlink
          ? e => {
              e.currentTarget.blur();
              handelRejectReservation();
              setPageNumber(1);
            }
          : handleOnClickBack;

        return {
          component: (
            <ModalSecondScreen
              topics={topics}
              setTopic={setTopic}
              setBody={setBody}
              images={images}
              setImages={setImages}
              body={body}
            />
          ),
          buttonName: secondScreenButtonName,
          buttonHandler: secondScreenButtonHandler,
          disabled: secondScreenDisabled,
          previousHandler: secondScreenPreviousHandler,
        };
      case 3:
        return {
          component: (
            <SubmitReviewPublish
              primaryObject={props.selectedRestaurant}
              reviewData={{ ...guideInfo, guideName: guideInfo.name }}
            />
          ),
          buttonName: 'Confirm',
          buttonHandler: handleCreatePost,
          disabled: false,
          previousHandler: e => {
            e.currentTarget.blur();
            handelRejectReservation();
            setPageNumber(2);
          },
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
      <StepsItems
        config={stepsConfig}
        activeStep={pageNumber}
        isThirdPageVisible={pageNumber === 1 || (isPropositionObj && pageNumber !== 1)}
      />
      {getCurrentScreen.component}
      {!isPropositionObj && pageNumber !== 1 && (
        <div className="QuickRewardsModal__warning-container">
          <b>
            YOU EARN:<span className="QuickRewardsModal__warning"> NO SPONSORS FOUND</span>
          </b>
        </div>
      )}
      <div className={buttonWrapClassList}>
        {pageNumber !== 1 && (
          <Button className={nextButtonClassList} onClick={getCurrentScreen.previousHandler}>
            Previous
          </Button>
        )}
        {isPropositionObj && pageNumber !== 1 && (
          <b>
            YOU EARN:{' '}
            <USDDisplay
              value={props.selectedDish.propositions[0].reward}
              currencyDisplay="symbol"
              style={{ color: '#f97b38' }}
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
  declineProposition: PropTypes.func.isRequired,
  isOpenModal: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    selectedRestaurant: getSelectedRestaurant(state),
    selectedDish: getSelectedDish(state),
    isOpenModal: getIsOpenModal(state),
    authUser: getAuthenticatedUserName(state),
  }),
  {
    createQuickPost,
    reserveProposition,
    toggleModal,
    declineProposition,
  },
)(QuickRewardsModal);
