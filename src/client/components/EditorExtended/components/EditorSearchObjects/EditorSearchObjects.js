import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { EditorState } from 'draft-js';

import EditorSearchAutoComplete from './EditorSearchAutoComplete';
import { addTextToCursor, getIsNodeInPath } from '../../../../helpers/editorHelper';

import './EditorSearchObjects.less';

const EditorSearchObjects = ({
  editorNode,
  searchCoordinates,
  closeSearchInput,
  oldSelectionState,
  editorState,
  setEditorExtendedState,
}) => {
  const [searchString, setSearchString] = React.useState('');
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

  const handleCloseSearchInput = (value, isNeedSetCursor = true) => {
    // НЕ ПЕРЕСТАВЛЯТЬ МЕСТАМИ ФУНКЦИИ НИЖЕ
    let newEditorState = addTextToCursor(editorState, value); // добавляется текст в едитор из поиска

    if (isNeedSetCursor)
      newEditorState = EditorState.forceSelection(newEditorState, oldSelectionState); // выставляется курсор на старое место
    setEditorExtendedState(newEditorState); // устанавливаем эдитор стейт
    closeSearchInput(); // закрывается поиск
  };

  const handleKeyDown = event => {
    if (event.keyCode === 8 && !event.target.selectionStart) {
      handleCloseSearchInput(event.target.value, true);
    }
  };

  const handleBlur = (event, value) => {
    const isNodeInPath = getIsNodeInPath('EditorSearchObjects', event);

    if (!isNodeInPath) {
      handleCloseSearchInput(value, false);
    }
  };

  return (
    <div className="EditorSearchObjects" style={{ top: coordinates.top, left: coordinates.left }}>
      <EditorSearchAutoComplete
        handleBlur={handleBlur}
        onKeyDown={handleKeyDown}
        searchString={searchString}
        setSearchString={setSearchString}
      />
    </div>
  );
};

EditorSearchObjects.propTypes = {
  editorNode: PropTypes.shape().isRequired,
  searchCoordinates: PropTypes.shape().isRequired,
  editorState: PropTypes.shape().isRequired,
  oldSelectionState: PropTypes.shape().isRequired,
  closeSearchInput: PropTypes.func.isRequired,
  setEditorExtendedState: PropTypes.func.isRequired,
};

export default EditorSearchObjects;
