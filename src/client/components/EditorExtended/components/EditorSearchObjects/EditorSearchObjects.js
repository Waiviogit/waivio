import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import EditorSearchAutoComplete from './EditorSearchAutoComplete';
import { addTextToCursor, getIsNodeInPath, setCursorPosition, replaceTextToCursor } from '../../../../helpers/editorHelper';
import { CURSOR_ACTIONS } from "../../util/constants";

import './EditorSearchObjects.less';

const EditorSearchObjects = ({
  editorNode,
  editorState,
  isStartSearchObj,
  closeSearchInput,
  searchCoordinates,
  oldSelectionState,
  searchObjectsResults,
  setEditorExtendedState,
}) => {
  const inputWrapper = React.useRef(null);
  const [isTypeSpace, setIsTypeSpace] = React.useState(false);
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

  React.useEffect(() => {
    if (!isStartSearchObj && isTypeSpace) {
      if (!searchObjectsResults.length) {
        handleCloseSearchInput(searchString, CURSOR_ACTIONS.NO_RESULT);
        setIsTypeSpace(false);
      }
    }
  }, [isStartSearchObj, searchObjectsResults.length]);

  const handleCloseSearchInput = (value, actionType) => {
    // НЕ ПЕРЕСТАВЛЯТЬ МЕСТАМИ ФУНКЦИИ НИЖЕ
    let newEditorState = addTextToCursor(editorState, value); // добавляется текст в едитор из поиска

    newEditorState = setCursorPosition(newEditorState, actionType, oldSelectionState, value) // выставляется курсор на нужное место
    setEditorExtendedState(newEditorState); // устанавливаем эдитор стейт
    closeSearchInput(); // закрывается поиск
  };

  const handleKeyDown = event => {
    if (event.keyCode === 8 && !event.target.selectionStart) { // backspace
      handleCloseSearchInput(event.target.value, CURSOR_ACTIONS.BACKSPACE);
    }

    if (event.keyCode === 32 && (event.target.selectionStart === event.target.value.length)) { // space
      setIsTypeSpace(true);
    }

    if (event.keyCode === 37 && !event.target.selectionStart) { // arrow left
      handleCloseSearchInput(event.target.value, CURSOR_ACTIONS.BACKSPACE);
    }
  };

  const handleBlur = (event, value) => {
    const isNodeInPath = getIsNodeInPath('EditorSearchObjects', event);

    if (!isNodeInPath) {
      handleCloseSearchInput(value, CURSOR_ACTIONS.BLUR);
    }
  };

  // const handleChange = event => {
  //   const value = event.target.value;
  //
  //   replaceTextToCursor(editorState, )
  // };

  return (
    <div
      className="EditorSearchObjects"
      ref={inputWrapper}
      style={{ top: coordinates.top, left: coordinates.left }}
    >
      <EditorSearchAutoComplete
        // onChange={handleChange}
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
  editorState: PropTypes.shape().isRequired,
  isStartSearchObj: PropTypes.bool.isRequired,
  closeSearchInput: PropTypes.func.isRequired,
  searchCoordinates: PropTypes.shape().isRequired,
  oldSelectionState: PropTypes.shape().isRequired,
  setEditorExtendedState: PropTypes.func.isRequired,
  searchObjectsResults: PropTypes.shape().isRequired,
};

export default EditorSearchObjects;
