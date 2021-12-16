import React from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';

import useQuickRewards from '../../../../hooks/useQuickRewards';
import withAuthActions from '../../../auth/withAuthActions';
import Popover from '../../../components/Popover';
import PopoverMenu from '../../../components/PopoverMenu/PopoverMenu';
import PopoverMenuItem from '../../../components/PopoverMenu/PopoverMenuItem';

import './WebsiteReservedButtons.less';

const WebsiteReservedButtons = props => {
  const { setDish, setRestaurant, openModal } = useQuickRewards();

  const handlePopoverClick = key =>
    props.onActionInitiated(() => {
      switch (key) {
        default:
          return props.handleReserve();
      }
    });

  const handleClickProposButton = () =>
    props.onActionInitiated(() => {
      setRestaurant(props.restaurant);
      setDish(props.dish);
      openModal();
    });

  return (
    <div className="WebsiteReservedButtons">
      <Button
        type="primary"
        onClick={handleClickProposButton}
        className="WebsiteReservedButtons__button"
      >
        <b>Submit</b> dish photo
      </Button>
      <Popover
        placement="bottomRight"
        trigger="click"
        content={
          <React.Fragment>
            <PopoverMenu onSelect={handlePopoverClick} bold={false}>
              <PopoverMenuItem key="reserve">
                <Icon type="user" /> Reserve the reward for{' '}
                <span style={{ color: 'black' }}>7 days</span>
              </PopoverMenuItem>
            </PopoverMenu>
          </React.Fragment>
        }
      >
        <i className="Buttons__post-menu iconfont icon-more" />
      </Popover>
    </div>
  );
};

WebsiteReservedButtons.propTypes = {
  restaurant: PropTypes.shape().isRequired,
  dish: PropTypes.shape().isRequired,
  onActionInitiated: PropTypes.func.isRequired,
  handleReserve: PropTypes.func.isRequired,
};

export default withAuthActions(WebsiteReservedButtons);
