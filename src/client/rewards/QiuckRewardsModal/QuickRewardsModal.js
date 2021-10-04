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
import { getObjectName } from '../../helpers/wObjectHelper';

import './QuickRewardsModal.less';

const QuickRewardsModal = props => {
  const [isPublishPage, setIsPublishPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topics, setTopic] = useState(['food', 'restaurant']);
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const circleClassList = status =>
    classNames('circle-item', {
      'circle-item--active':
        (status === 'publish' && isPublishPage) || (status === 'select' && !isPublishPage),
    });
  const isPropositionObj = !isEmpty(get(props.selectedDish, 'propositions'));
  const title = `Review: ${getObjectName(props.selectedRestaurant)}, ${getObjectName(
    props.selectedDish,
  )}`;
  const nextButtonClassList = classNames('QuickRewardsModal__button', {
    'QuickRewardsModal__button--withRewards': isPropositionObj,
  });
  const requirements = get(props, 'selectedDish.propositions[0].requirements.minPhotos', 0);

  const closeModal = () => {
    props.toggleModal(false);
    setIsPublishPage(false);
  };

  const createImagesLink = () =>
    images.map(img => `\n<center>![image]( ${img.src})</center>`).join('');

  const createTopicsLink = () =>
    topics.map(tag => `\n[#${tag}](https://www.waivio.com/object/${tag})`).join('');

  const handleCreatePost = () => {
    const compareBody = `\n[${getObjectName(
      props.selectedRestaurant,
    )}](https://www.waivio.com/object/${props.selectedRestaurant.author_permlink})
    \n[${getObjectName(props.selectedDish)}](https://www.waivio.com/object/${
      props.selectedDish.author_permlink
    }) 
    ${createImagesLink()} ${body} ${createTopicsLink()}`;

    setLoading(true);

    if (isPublishPage) props.createQuickPost(title, compareBody, topics);
    if (isPropositionObj) props.reserveProposition();

    setLoading(false);
    setIsPublishPage(true);
  };

  return (
    <Modal
      title="Submit dish photos and earn crypto!"
      footer={null}
      visible={props.isOpenModal}
      onCancel={closeModal}
      className="QuickRewardsModal"
    >
      {isPublishPage ? (
        <ModalSecondScreen
          topics={topics}
          setTopic={setTopic}
          setBody={setBody}
          images={images}
          setImages={setImages}
        />
      ) : (
        <ModalFirstScreen isShow={props.isOpenModal} />
      )}
      <div className="QuickRewardsModal__button-wrap">
        <div className="circle-wrap">
          <div className={circleClassList('select')}>
            <span className="circle">1</span>
            <span className="circle-title">Reserve</span>
          </div>
          <div className={circleClassList('publish')}>
            <span className="circle">2</span>
            <span className="circle-title">Write & Publish</span>
          </div>
        </div>
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
          disabled={
            isEmpty(props.selectedDish) ||
            isEmpty(props.selectedRestaurant) ||
            (isPublishPage && !body && requirements && requirements !== images.length)
          }
          loading={loading}
          onClick={handleCreatePost}
        >
          {isPublishPage ? 'Publish' : 'Next'}
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
