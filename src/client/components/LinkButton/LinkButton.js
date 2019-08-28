import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withRouter } from 'react-router';
import './LinkButton.less';

const LinkButton = props => {
  const { history, to, className, size, onClick, ...rest } = props;
  return (
    <Button
      block
      className={`LinkButton ${className}`}
      size={size}
      onClick={event => {
        if (onClick && typeof onClick === 'function') onClick(event);
        history.push(to);
      }}
      {...rest}
    />
  );
};

LinkButton.propTypes = {
  history: PropTypes.shape().isRequired,
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large', 'default']),
  onClick: PropTypes.func,
};
LinkButton.defaultProps = {
  className: '',
  size: 'default',
  onClick: () => {},
};

export default withRouter(LinkButton);
