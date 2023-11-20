import React from 'react';
import { useSelected, useFocused } from 'slate-react';
import PropTypes from 'prop-types';

import './image.less';

const Image = ({ attributes, element, children }) => {
  const { url } = element;

  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      {...attributes}
      className="md-block-image-inner-container"
      style={{ boxShadow: selected && focused && '0 0 3px 3px lightgray', textAlign: 'center' }}
      role="presentation"
    >
      <div contentEditable={false}>
        <img alt={element.alt} src={url} />
      </div>
      {children}
    </div>
  );
};

Image.propTypes = {
  attributes: PropTypes.shape().isRequired,
  element: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

export default Image;
