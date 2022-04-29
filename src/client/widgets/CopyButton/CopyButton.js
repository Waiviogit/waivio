import React from 'react';
import { ReactSVG } from 'react-svg';
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CopyIcon from '@icons/copy.svg';

import './CopyButton.less';

const CopyButton = props => {
  const inputClassList = classNames('CopyButton__text', {
    [props.className]: props.className,
  });
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
      <span className={inputClassList}>{props.text}</span>
      <ReactSVG
        className="CopyButton__icon"
        wrapper="span"
        src={CopyIcon}
        onClick={handleClipboard}
      />
    </div>
  );
};

CopyButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};
export default injectIntl(CopyButton);
