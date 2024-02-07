import React, { useState } from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

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

          return props
            .handleReserveForPopover()
            .then(() => {
              history.push('/rewards/reserved');
              setLoading(false);
            })
            .catch(() => setLoading(false));
      }
    });

  const handleClickProposButton = () => {
    if (typeof window !== 'undefined' && window?.gtag)
      window.gtag('event', 'click_submit_photos', { debug_mode: false });
    props.onActionInitiated(async () => {
      if (!props.inCard) setLoadingButton(true);
      props.handleReserve(setLoadingButton);
    });
  };

  return (
    <div className="WebsiteReservedButtons">
      <Button
        type="primary"
        onClick={handleClickProposButton}
        className="WebsiteReservedButtons__button"
        disabled={loading || loadingButton || props.disable}
        loading={loadingButton}
      >
        {props.intl.formatMessage({ id: 'submit_photos', defaultMessage: 'Submit photos' })}
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
                  {!props.isSocialProduct && <Icon type="user" />}{' '}
                  {props.intl.formatMessage({
                    id: 'reserve_the_rewards_for',
                    defaultMessage: 'Reserve the reward for',
                  })}{' '}
                  <span>
                    <span style={{ color: 'black' }}>
                      {props.reservedDays}{' '}
                      {props.intl.formatMessage({ id: 'days', defaultMessage: 'days' })}{' '}
                    </span>
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
  isSocialProduct: PropTypes.bool,
  reservedDays: PropTypes.number,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(withAuthActions(ReservedButtons));
