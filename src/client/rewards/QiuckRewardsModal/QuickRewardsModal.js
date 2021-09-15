import React, {useEffect, useState} from 'react';
import { Modal, AutoComplete, Button } from 'antd';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import {
  resetDish,
  resetRestaurant,
  setSelectedDish,
  setSelectedRestaurant,
} from '../../../store/quickRewards/quickRewardsActions';
import {
  getSelectedDish,
  getSelectedRestaurant,
} from '../../../store/quickRewards/quickRewardsSelectors';
import USDDisplay from '../../components/Utils/USDDisplay';
import ModalFirstScreen from "./components/FirstScreen/FirstScreen";
import './QuickRewardsModal.less';
import ModalSecondScreen from "./components/SecondScreen";

const QuickRewardsModal = props => {
  const [nextPage, setNextPage] = useState(false);

  return (
    <Modal title="Submit dish photos and earn crypto!" visible={false} footer={null}>
      {nextPage ?  <ModalSecondScreen/> : <ModalFirstScreen/>}
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
        {!isEmpty(props.selectedDish) && (
          <b>
            YOU EARN: <USDDisplay value={props.selectedDish.reward} currencyDisplay="symbol"/>
          </b>
        )}
        <Button
          type="primary"
          className="QuickRewardsModal__button"
          disabled={isEmpty(props.selectedDish) || isEmpty(props.selectedRestaurant)}
          onClick={() => setNextPage(true)}
        >
          Next
        </Button>
      </div>
    </Modal>
  )
};

export default connect(
  state => ({
    selectedRestaurant: getSelectedRestaurant(state),
    selectedDish: getSelectedDish(state),
  })
)(QuickRewardsModal);
