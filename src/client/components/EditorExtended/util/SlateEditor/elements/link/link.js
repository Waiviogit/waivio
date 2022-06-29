import { useSelected, useFocused } from 'slate-react';
import React from 'react';
import { truncate } from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './styles.less';

const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const Link = ({ attributes, element, children }) => {
  const selected = useSelected();
  const focused = useFocused();

  const classNames = classnames({
    'element-link': true,
    'element-link_focused': selected && focused,
  });

  return (
    <div className={classNames}>
      <a {...attributes} href={element.url} target="_blank noreferrer">
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </a>
      {selected && focused && (
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
