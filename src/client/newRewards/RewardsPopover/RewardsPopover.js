import React, { useState, useCallback } from 'react';
import { Icon, Input, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce, noop } from 'lodash';
import { Link } from 'react-router-dom';

import Popover from '../../components/Popover';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import {
  decreaseReward,
  realiseRewards,
  rejectAuthorReview,
} from '../../../store/newRewards/newRewardsActions';
import Report from '../../rewards/Report/Report';

const RewardsPopover = ({ proposition, getProposition, type }) => {
  const [isVisiblePopover, setIsVisiblePopover] = useState(false);
  const [amount, setAmount] = useState(0);
  const [openDecrease, setOpenDecrease] = useState(false);
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  const dispatch = useDispatch();
  const rewiewType = type === 'reserved' ? 'reserved' : proposition.reviewStatus;

  const getPopoverItems = () => {
    const itemArray = [
      <PopoverMenuItem key={'view_reservation'}>
        <Link to={`/@${proposition?.userName}/${proposition?.reservationPermlink}`}>
          View reservation
        </Link>
      </PopoverMenuItem>,
    ];
    const decrease = (
      <PopoverMenuItem key={'decrease'}>
        <div role="presentation" onClick={openDecreaseModal}>
          Decrease reward
        </div>
      </PopoverMenuItem>
    );
    const openReview = (
      <PopoverMenuItem key={'open_review'}>
        <Link to={`/@${proposition?.userName}/${proposition?.reviewPermlink}`}>Open review</Link>
      </PopoverMenuItem>
    );
    const report = (
      <PopoverMenuItem key={'show_report'}>
        <div onClick={() => setIsModalReportOpen(true)}>Show report</div>
      </PopoverMenuItem>
    );

    switch (rewiewType) {
      case 'reserved':
        return [
          <PopoverMenuItem key={'release'}>
            <div role="presentation" onClick={rejectReward}>
              <Icon type="flag" /> Release reservation
            </div>
          </PopoverMenuItem>,
          ...itemArray,
          decrease,
        ];
      case 'completed':
        return [...itemArray, openReview, decrease, report];
      case 'unassigned':
      case 'expired':
        return [...itemArray];
      default:
        return [
          <PopoverMenuItem key={'release'}>
            <div role="presentation" onClick={realeaseReward}>
              <Icon type="flag" /> Release reservation
            </div>
          </PopoverMenuItem>,
          ...itemArray,
        ];
    }
  };

  const realeaseReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Release reservation',
      content: 'Do you want to release this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(realiseRewards(proposition)).then(() => {
            getProposition().then(() => {
              resolve();
            });
          });
        });
      },
    });
  };

  const rejectReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Release reservation',
      content: 'Do you want to release this reservation?',
      onOk() {
        return new Promise(resolve => {
          dispatch(rejectAuthorReview(proposition)).then(() => {
            getProposition().then(() => {
              resolve();
            });
          });
        });
      },
    });
  };

  const openDecreaseModal = () => {
    setIsVisiblePopover(false);
    setOpenDecrease(true);
  };

  const setAmountDebounce = useCallback(
    debounce(value => {
      setAmount(value);
    }, 300),
    [],
  );

  return (
    <React.Fragment>
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={isVisiblePopover}
        onVisibleChange={() => setIsVisiblePopover(!isVisiblePopover)}
        content={<PopoverMenu>{getPopoverItems()}</PopoverMenu>}
      >
        <i className="Buttons__post-menu iconfont icon-more" />
      </Popover>
      {openDecrease && (
        <Modal
          visible={openDecrease}
          onCancel={() => {
            setOpenDecrease(false);
            setAmount(0);
          }}
          onOk={() => {
            setOpenDecrease(false);
            dispatch(decreaseReward(proposition, amount));
          }}
        >
          <b>Amount:</b>
          <Input
            placeholder={'Enter amount'}
            type={'number'}
            onInput={e => setAmountDebounce(e.target.value)}
          />
        </Modal>
      )}
      <Report
        isModalReportOpen={isModalReportOpen}
        toggleModal={() => setIsModalReportOpen(false)}
        sponsor={proposition}
        reservPermlink={proposition?.reservationPermlink}
      />
    </React.Fragment>
  );
};

RewardsPopover.propTypes = {
  proposition: PropTypes.shape({
    reservationPermlink: PropTypes.string,
    userName: PropTypes.string,
    reviewStatus: PropTypes.string,
    reviewPermlink: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
  getProposition: PropTypes.func,
};

RewardsPopover.defaultProps = {
  getProposition: noop,
};

export default RewardsPopover;
