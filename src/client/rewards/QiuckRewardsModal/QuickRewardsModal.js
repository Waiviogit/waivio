import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import {
  getSelectedDish,
  getSelectedRestaurant,
} from '../../../store/quickRewards/quickRewardsSelectors';
import USDDisplay from '../../components/Utils/USDDisplay';
import ModalFirstScreen from './components/FirstScreen/FirstScreen';
import './QuickRewardsModal.less';
import ModalSecondScreen from './components/SecondScreen/SecondScreen';
import { buildPost } from '../../../store/editorStore/editorActions';
import { createQuickPost } from '../../../store/quickRewards/quickRewardsActions';
import { getObjectName } from '../../helpers/wObjectHelper';

const QuickRewardsModal = props => {
  const [nextPage, setNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topics, setTopic] = useState(['food', 'restaurant']);
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const title = `Review: ${getObjectName(props.selectedRestaurant)}, ${getObjectName(
    props.selectedDish,
  )}`;

  const createImagesLink = () =>
    images.map(img => `\n<center>![image]( ${img.src})</center>\n`).join('');

  const handleCreatePost = () => {
    const compareBody = `\\n[${getObjectName(props.selectedDish)}](https://www.waivio.com${
      props.selectedDish.defaultShowLink
    }) \\n[${getObjectName(props.selectedRestaurant)}](https://www.waivio.com${
      props.selectedRestaurant.defaultShowLink
    }) \\n ${createImagesLink()} ${body}`;

    if (nextPage) {
      setLoading(true);
      props.createQuickPost(title, compareBody, topics);
    } else setNextPage(true);
  };

  return (
    <Modal title="Submit dish photos and earn crypto!" visible={true} footer={null}>
      {nextPage ? (
        <ModalSecondScreen
          topics={topics}
          setTopic={setTopic}
          setBody={setBody}
          images={images}
          setImages={setImages}
        />
      ) : (
        <ModalFirstScreen />
      )}
      <div className="QuickRewardsModal__button-wrap">
        <div className="circle-wrap">
          <div className="circle-item circle-item--active">
            <span className="circle">1</span>
            <span className="circle-title">Reserve</span>
          </div>
          <div className="circle-item">
            <span className="circle">2</span>
            <span className="circle-title">Write & Publish</span>
          </div>
        </div>
        {!isEmpty(get(props.selectedDish, 'propositions')) && (
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
          className="QuickRewardsModal__button"
          disabled={isEmpty(props.selectedDish) || isEmpty(props.selectedRestaurant) || (nextPage && !body)}
          loading={loading}
          onClick={handleCreatePost}
        >
          Next
        </Button>
      </div>
    </Modal>
  );
};

export default connect(
  state => ({
    selectedRestaurant: getSelectedRestaurant(state),
    selectedDish: getSelectedDish(state),
  }),
  {
    createQuickPost,
  },
)(QuickRewardsModal);
