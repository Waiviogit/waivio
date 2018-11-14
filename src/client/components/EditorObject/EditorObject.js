import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import './EditorObject.less';

const EditorObject = ({ wObject, handleRemoveObject }) => (
  <div className="editor-object">
    <div className="editor-object__content">
      <img className="editor-object__avatar" src={wObject.avatar} alt={wObject.tag} />
      <span className="editor-object__names">
        <span className="editor-object__names main">{wObject.tag}</span>
        <span className="editor-object__names other">{` (${wObject.name})`}</span>
      </span>
    </div>
    <div className="editor-object__controls">
      <div
        role="button"
        tabIndex={0}
        className="editor-object__controls delete"
        onClick={() => handleRemoveObject(wObject.id)}
      >
        <i className="iconfont icon-trash editor-object__controls delete-icon" />
        <FormattedMessage id="remove" defaultMessage="Remove" />
      </div>
    </div>
  </div>
);

EditorObject.propTypes = {
  wObject: PropTypes.shape().isRequired,
  handleRemoveObject: PropTypes.func.isRequired,
};

export default EditorObject;
