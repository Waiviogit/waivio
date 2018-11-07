import React from 'react';
import PropTypes from 'prop-types';
import './EditorObject.less';

const EditorObject = ({ wObj }) => (
  <div className="editor-object">
    <img className="editor-object__avatar" src={wObj.avatar} alt={wObj.tag} />
    <span className="editor-object__names">
      <span className="editor-object__names main">{`${wObj.tag} `}</span>
      {Boolean(wObj.names.length) && (
        <span className="editor-object__names other">
          ({wObj.names.reduce((acc, curr) => `${acc}${curr.value}, `, '').slice(0, -2)})
        </span>
      )}
    </span>
  </div>
);

EditorObject.propTypes = {
  wObj: PropTypes.shape().isRequired,
};

export default EditorObject;
