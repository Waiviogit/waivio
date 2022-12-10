import React, { useState } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import Loading from '../../../components/Icon/Loading';
import useQuickRewards from '../../../../hooks/useQuickRewards';
import withAuthActions from '../../../auth/withAuthActions';
import Popover from '../../../components/Popover';
import PopoverMenu from '../../../components/PopoverMenu/PopoverMenu';
import PopoverMenuItem from '../../../components/PopoverMenu/PopoverMenuItem';
import { getObject } from '../../../../waivioApi/ApiClient';

import './WebsiteReservedButtons.less';

const WebsiteReservedButtons = props => {
  const { setDish, setRestaurant, openModal } = useQuickRewards();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handlePopoverClick = key =>
    props.onActionInitiated(() => {
      switch (key) {
        default:
          setLoading(true);

          return props.handleReserve().then(() => {
            history.push('/rewards/reserved');
            setLoading(false);
          });
      }
    });

  const handleClickProposButton = () =>
    props.onActionInitiated(async () => {
      if (props.isNewReward) {
        const requiredObject = await getObject(
          props.dish?.requiredObject?.author_permlink ||
            props.dish?.requiredObject ||
            props.dish?.parent,
        );

        setRestaurant(requiredObject);
      } else {
        setRestaurant(props.restaurant);
      }

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
        <b>Submit</b> dish photos
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
                {loading && <Loading />}
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
  isNewReward: PropTypes.bool.isRequired,
};

export default withAuthActions(WebsiteReservedButtons);
