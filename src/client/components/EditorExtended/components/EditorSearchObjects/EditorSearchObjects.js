import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import EditorSearchAutoComplete from './EditorSearchAutoComplete';

import './EditorSearchObjects.less';

const EditorSearchObjects = ({ editorNode, searchCoordinates }) => {
  const searchInput = React.useRef(null);
  const [coordinates, setCoordinates] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    // eslint-disable-next-line react/no-find-dom-node
    const parent = ReactDOM.findDOMNode(editorNode);

    const parentBoundary = parent.getBoundingClientRect();

    const top = searchCoordinates.bottom - parentBoundary.top - 14;

    const selectionCenter =
      searchCoordinates.left + searchCoordinates.width / 2 - parentBoundary.left;
    let left = selectionCenter;
    const screenLeft = parentBoundary.left + selectionCenter;

    if (screenLeft < 0) {
      left = -parentBoundary.left;
    }

    setCoordinates({ top, left: left + 25 });
  }, [editorNode]);

  const handleKeyDown = event => {
    if (event.keyCode === 8) {
      searchInput.current.getSelection();
      console.log('backspace');
    }
  };

  return (
    <div className="EditorSearchObjects" style={{ top: coordinates.top, left: coordinates.left }}>
      <EditorSearchAutoComplete
        ref={searchInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

EditorSearchObjects.propTypes = {
  editorNode: PropTypes.shape().isRequired,
  searchCoordinates: PropTypes.shape().isRequired,
};

export default EditorSearchObjects;
