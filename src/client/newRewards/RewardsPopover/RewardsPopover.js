import React, { useState } from 'react';
import { Icon, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import Popover from '../../components/Popover';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import { realiseRewards } from '../../../store/newRewards/newRewardsActions';

const RewardsPopover = ({ proposition }) => {
  const [isVisiblePopover, setIsVisiblePopover] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const realeaseReward = () => {
    setIsVisiblePopover(false);
    Modal.confirm({
      title: 'Release reservation',
      content: 'Do you want to release this reservation?',
      onOk() {
        dispatch(realiseRewards(proposition));
        history.push('/rewards-new/eligible');
      },
    });
  };

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      visible={isVisiblePopover}
      onVisibleChange={() => setIsVisiblePopover(!isVisiblePopover)}
      content={
        <PopoverMenu>
          <PopoverMenuItem>
            <div role="presentation" onClick={realeaseReward}>
              <Icon type="flag" /> Release reservation
            </div>
          </PopoverMenuItem>
        </PopoverMenu>
      }
    >
      <i className="Buttons__post-menu iconfont icon-more" />
    </Popover>
  );
};

RewardsPopover.propTypes = {
  proposition: PropTypes.shape({}).isRequired,
};

export default RewardsPopover;
