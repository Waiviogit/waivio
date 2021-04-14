import React from 'react';
import { ReactSVG } from 'react-svg';
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import './CopyButton.less';

const CopyButton = props => {
  const handleClipboard = () => {
    const clipboard = navigator.clipboard;

    clipboard.writeText(props.text).then(() =>
      message.success(
        props.intl.formatMessage({
          id: 'save_in_buffer',
          defaultMessage: 'Save in buffer',
        }),
      ),
    );
  };

  return (
    <div className="CopyButton">
      <span className="CopyButton__text">{props.text}</span>
      <ReactSVG
        className="CopyButton__icon"
        wrapper="span"
        src="/images/icons/copy.svg"
        onClick={handleClipboard}
      />
    </div>
  );
};

CopyButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  text: PropTypes.string.isRequired,
};
export default injectIntl(CopyButton);
