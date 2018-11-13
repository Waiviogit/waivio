import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import './EditorObject.less';

const EditorObject = ({ wObj, handleRemoveObject }) => (
  <div className="editor-object">
    <div className="editor-object__content">
      <img className="editor-object__avatar" src={wObj.avatar} alt={wObj.tag} />
      <span className="editor-object__names">
        <span className="editor-object__names main">{wObj.tag}</span>
        <span className="editor-object__names other">{` (${wObj.name})`}</span>
      </span>
    </div>
    <div className="editor-object__controls">
      <div
        role="button"
        tabIndex={0}
        className="editor-object__controls delete"
        onClick={() => handleRemoveObject(wObj.id)}
      >
        <i className="iconfont icon-trash editor-object__controls delete-icon" />
        <FormattedMessage id="remove" defaultMessage="Remove" />
      </div>
    </div>
  </div>
);

EditorObject.propTypes = {
  wObj: PropTypes.shape().isRequired,
  handleRemoveObject: PropTypes.func.isRequired,
};

export default EditorObject;
