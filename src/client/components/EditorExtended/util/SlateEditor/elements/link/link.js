import { useSelected, useFocused } from 'slate-react';
import React, { useState } from 'react';
import { truncate } from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles.less';

const Link = ({ attributes, element, children }) => {
  const selected = useSelected();
  const focused = useFocused();


  const [hovered, setHovered] = useState(false);

  const classNames = classnames({
    'element-link': true,
    'element-link_focused': selected && focused,
  });

  return (
    <div className={classNames} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <a {...attributes} href={element.url} target="_blank noreferrer">
        {children}
      </a>
      {hovered && (
        <div
          className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link"
          contentEditable={false}
        >
          <a href={element.url} rel="noopener noreferrer" target="_blank">
            {truncate(element.url, { length: 27 })}
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
