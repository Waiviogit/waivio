import { useSelected, useFocused, useSlate } from 'slate-react';
import React, { useEffect, useState } from 'react';
import { truncate } from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles.less';

const Link = ({ attributes, element, children }) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlate();
  const { selection } = editor;

  useEffect(() => {
    const handleClickOutside = () => setClicked(false);

    window.addEventListener('mousedown', handleClickOutside);

    return () => window.removeEventListener('mousedown', handleClickOutside);
  });

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const handleClick = e => {
    e.stopPropagation();
    setClicked(true);
  };

  const classNames = classnames({
    'element-link': true,
    'element-link_focused': selected && focused,
  });

  return (
    <a
      className={classNames}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={handleClick}
      href={element.url}
      target="_blank noreferrer"
      {...attributes}
    >
      {children}
      {(hovered || clicked) && selection.anchor.path[0] === selection.focus.path[0] && (
        <div
          className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link"
          contentEditable={false}
          style={{ userSelect: 'none', pointerEvents: 'none' }}
        >
          <a
            href={element.url}
            rel="noopener noreferrer"
            target="_blank"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {truncate(element.url, { length: 80 })}
          </a>
        </div>
      )}
    </a>
  );
};

Link.propTypes = {
  attributes: PropTypes.shape().isRequired,
  element: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;
