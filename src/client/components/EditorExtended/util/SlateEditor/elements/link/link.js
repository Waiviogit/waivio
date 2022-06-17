import { useSelected, useFocused } from 'slate-react';
import React from 'react';
import { truncate } from 'lodash';
import PropTypes from 'prop-types';

import './styles.less';

const Link = ({ attributes, element, children }) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div className="element-link">
      <a {...attributes} href={element.href} target="_blank noreferrer">
        {children}
      </a>
      {selected && focused && (
        <div
          className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link"
          contentEditable={false}
        >
          <a href={element.href} rel="noopener noreferrer" target="_blank">
            {truncate(element.href)}
          </a>
        </div>
      )}
    </div>
  );
};

Link.propTypes = {
  attributes: PropTypes.shape().isRequired,
  element: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;
