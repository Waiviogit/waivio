import React, { useCallback } from 'react';
import { Transforms } from 'slate';
import { useSelected, useFocused, ReactEditor, useSlateStatic } from 'slate-react';
import PropTypes from 'prop-types';
import { shouldShowCaption } from '../../../../../../../common/helpers/imageCaption';

import './image.less';

const Image = ({ attributes, element, children }) => {
  const selected = useSelected();
  const focused = useFocused();
  const editor = useSlateStatic();

  const selectImage = useCallback(
    e => {
      e.preventDefault();
      const path = ReactEditor.findPath(editor, element);

      Transforms.select(editor, path);
      ReactEditor.focus(editor);
    },
    [editor, element],
  );

  return (
    <div
      {...attributes}
      className="md-block-image-inner-container"
      role="presentation"
      onMouseDown={selectImage}
      style={{ textAlign: 'center' }}
    >
      <div contentEditable={false}>
        <figure className="md-block-image-figure">
          <img
            alt={element.alt || ''}
            src={element.url}
            data-fallback-src={element.url}
            draggable={false}
            style={{
              boxShadow: selected && focused && '0 0 3px 3px lightgray',
              textAlign: 'center',
              display: 'inline-block',
              marginTop: 0,
            }}
          />
          {shouldShowCaption(element.alt, element.url) ? (
            <figcaption className="md-block-image-caption">{element.alt}</figcaption>
          ) : null}
        </figure>
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
