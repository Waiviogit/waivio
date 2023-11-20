import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './Confirmation.less';

const Confirmation = ({ onConfirm, onCancel, type }) => (
  <div className="Confirmation">
    <a role="presentation" onClick={onConfirm}>
      <i className="iconfont icon-success" />
      <FormattedMessage id={type} defaultMessage={type} />
    </a>
    <a role="presentation" onClick={onCancel}>
      <i className="iconfont icon-delete" />
      <FormattedMessage id="cancel" defaultMessage="Cancel" />
    </a>
  </div>
);

Confirmation.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  type: PropTypes.string,
};

Confirmation.defaultProps = {
  onConfirm: () => {},
  onCancel: () => {},
  type: 'confirm',
};

export default Confirmation;
