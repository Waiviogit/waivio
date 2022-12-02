import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import './Loading.less';
import useWebsiteColor from '../../../hooks/useWebsiteColor';

const Loading = ({ center }) => {
  const colors = useWebsiteColor();

  return (
    <div
      style={{ '--website-color': `${colors.balance}` }}
      className={classNames('Loading', { 'Loading--center': center })}
    >
      <Icon className="Loading__icon" type="loading" />
    </div>
  );
};

Loading.propTypes = {
  center: PropTypes.bool,
};

Loading.defaultProps = {
  center: true,
};

export default Loading;
