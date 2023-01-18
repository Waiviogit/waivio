import React, { useState } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import withAuthActions from '../../../auth/withAuthActions';
import Popover from '../../../components/Popover';
import PopoverMenu from '../../../components/PopoverMenu/PopoverMenu';
import PopoverMenuItem from '../../../components/PopoverMenu/PopoverMenuItem';

import './WebsiteReservedButtons.less';

const ReservedButtons = props => {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const history = useHistory();

  const handlePopoverClick = key =>
    props.onActionInitiated(() => {
      switch (key) {
        default:
          setLoading(true);

          return props.handleReserveForPopover().then(() => {
            history.push('/rewards/reserved');
            setLoading(false);
          });
      }
    });

  const handleClickProposButton = () =>
    props.onActionInitiated(async () => {
      if (!props.inCard) setLoadingButton(true);
      props.handleReserve();
    });

  return (
    <div className="WebsiteReservedButtons">
      <Button
        type="primary"
        onClick={handleClickProposButton}
        className="WebsiteReservedButtons__button"
        disabled={loading || loadingButton || props.disable}
        loading={loadingButton}
      >
        <b>Submit</b> dish photos
      </Button>
      {!props.reserved && (
        <Popover
          placement="bottomRight"
          trigger="click"
          visible={visiblePopover}
          onVisibleChange={visible => setVisiblePopover(visible)}
          content={
            <React.Fragment>
              <PopoverMenu onSelect={handlePopoverClick} bold={false}>
                <PopoverMenuItem key="reserve" disabled={props.disable}>
                  <Icon type="user" /> Reserve the reward for{' '}
                  <span>
                    <span style={{ color: 'black' }}>7 days </span>
                    {loading && <Icon type="loading" />}
                  </span>
                </PopoverMenuItem>
              </PopoverMenu>
            </React.Fragment>
          }
        >
          <i className="Buttons__post-menu iconfont icon-more" />
        </Popover>
      )}
    </div>
  );
};

ReservedButtons.propTypes = {
  onActionInitiated: PropTypes.func.isRequired,
  handleReserve: PropTypes.func.isRequired,
  handleReserveForPopover: PropTypes.func.isRequired,
  disable: PropTypes.bool,
  reserved: PropTypes.bool,
  inCard: PropTypes.bool,
};

export default withAuthActions(ReservedButtons);
