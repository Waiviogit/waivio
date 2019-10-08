import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withRouter } from 'react-router';
import './LinkButton.less';

const LinkButton = props => {
  const { block, history, to, className, size, type, onClick, children } = props;
  return (
    <Button
      block={block}
      className={`${type === 'default' ? 'LinkButton' : ''} ${className}`}
      size={size}
      type={type}
      onClick={event => {
        if (onClick && typeof onClick === 'function') onClick(event);
        history.push(to);
      }}
    >
      {children}
    </Button>
  );
};

LinkButton.propTypes = {
  history: PropTypes.shape().isRequired,
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  block: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large', 'default']),
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'link', 'default']),
  onClick: PropTypes.func,
};
LinkButton.defaultProps = {
  block: true,
  className: '',
  size: 'default',
  type: 'default',
  onClick: () => {},
};

export default withRouter(LinkButton);
