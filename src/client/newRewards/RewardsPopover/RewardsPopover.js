import React, { useState } from 'react';
import { Icon, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import Popover from '../../components/Popover';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import { realiseRewards, rejectAuthorReview } from '../../../store/newRewards/newRewardsActions';

const RewardsPopover = ({ proposition, getProposition, type }) => {
  const [isVisiblePopover, setIsVisiblePopover] = useState(false);
  const dispatch = useDispatch();

  const getPopoverItems = () => {
    switch (type) {
      case 'reservations':
        return (
          <PopoverMenuItem>
            <div role="presentation" onClick={rejectReward}>
              <Icon type="flag" /> Release reservation
            </div>
          </PopoverMenuItem>
        );
      default:
        return (
          <PopoverMenuItem>
            <div role="presentation" onClick={realeaseReward}>
              <Icon type="flag" /> Release reservation
            </div>
          </PopoverMenuItem>
        );
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

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={isVisiblePopover}
      onVisibleChange={() => setIsVisiblePopover(!isVisiblePopover)}
      content={<PopoverMenu>{getPopoverItems()}</PopoverMenu>}
    >
      <i className="Buttons__post-menu iconfont icon-more" />
    </Popover>
  );
};

RewardsPopover.propTypes = {
  proposition: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
  getProposition: PropTypes.func,
};

RewardsPopover.defaultProps = {
  getProposition: noop,
};

export default RewardsPopover;
