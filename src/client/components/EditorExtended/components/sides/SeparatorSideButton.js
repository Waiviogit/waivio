import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { createEmptyNode, createLine } from '../../util/SlateEditor/utils/embed';

const SeparatorSideButton = ({ close, intl }) => {
  const editor = useSlate();

  const onClick = () => {
    Transforms.insertNodes(editor, [createLine(), createEmptyNode(editor)]);
    close();
  };

  return (
    <button
      className="md-sb-button action-btn"
      onClick={onClick}
      title={intl.formatMessage({
        id: 'add_separator',
        defaultMessage: 'Add a separator',
      })}
    >
      <Icon type="minus" className="btn-icon" color="#8798a4" />
      <span className="action-btn__caption">
        {intl.formatMessage({ id: 'post_btn_separator', defaultMessage: 'Line' })}
      </span>
    </button>
  );
};

SeparatorSideButton.propTypes = {
  close: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(SeparatorSideButton);
