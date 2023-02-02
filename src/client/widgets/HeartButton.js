import React, { useState } from 'react';
import { Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
// import PropTypes from "prop-types";
import classnames from 'classnames';

const HeartButton = () => {
  const [activeHeart, setActiveHeart] = useState(false);
  const tooltipTitle = activeHeart ? (
    <FormattedMessage id="remove_from_my_shop" defaultMessage="Remove from my shop" />
  ) : (
    <FormattedMessage id="add_to_my_shop" defaultMessage="Add to my shop" />
  );

  const onHeartClick = () => {
    setActiveHeart(!activeHeart);
  };
  const heartClasses = classnames({ HeartButton__active: activeHeart, HeartButton: !activeHeart });

  return (
    <Tooltip
      placement="topLeft"
      title={tooltipTitle}
      overlayClassName="HeartButtonContainer"
      overlayStyle={{ top: '10px' }}
    >
      <button className={heartClasses} onClick={onHeartClick}>
        <Icon type="heart" theme="filled" />
      </button>
    </Tooltip>
  );
};

HeartButton.propTypes = {
  // wobject: PropTypes.shape().isRequired
};

export default HeartButton;
