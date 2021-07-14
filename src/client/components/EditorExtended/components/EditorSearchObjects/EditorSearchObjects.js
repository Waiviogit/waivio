import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { size } from 'lodash';

import SearchOneObject from './SearchOneObject';

import './EditorSearchObjects.less';

const EditorSearchObjects = ({
  editorNode,
  searchCoordinates,
  wordForCountWidth,
  searchObjectsResults,
  selectObjectFromSearch,
}) => {
  const inputWrapper = React.useRef(null);
  const fakeLeftPositionBlock = React.useRef(null);
  const [coordinates, setCoordinates] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    fakeLeftPositionBlock.current.innerHTML = wordForCountWidth;
    // eslint-disable-next-line react/no-find-dom-node
    const parent = ReactDOM.findDOMNode(editorNode);
    const parentBoundary = parent.getBoundingClientRect();
    const top = searchCoordinates.bottom - parentBoundary.top + 11;
    const selectionCenter =
      searchCoordinates.left + searchCoordinates.width / 2 - parentBoundary.left;
    let left = selectionCenter;
    const screenLeft = parentBoundary.left + selectionCenter;

    if (screenLeft < 0) left = -parentBoundary.left;
    if (wordForCountWidth) left -= fakeLeftPositionBlock.current.offsetWidth;
    setCoordinates({ top, left: left + 15 });
  }, [editorNode]);

  const handleSelectObject = object => selectObjectFromSearch(object);

  return (
    <React.Fragment>
      {!!size(searchObjectsResults) && (
        <div
          ref={inputWrapper}
          className="editor-search-objects"
          style={{ top: coordinates.top, left: coordinates.left }}
        >
          {searchObjectsResults.map(obj => (
            <SearchOneObject obj={obj} objectSelect={handleSelectObject} key={obj.id} />
          ))}
        </div>
      )}
      <div ref={fakeLeftPositionBlock} className="fake-position-left" />
    </React.Fragment>
  );
};

EditorSearchObjects.propTypes = {
  editorNode: PropTypes.shape().isRequired,
  wordForCountWidth: PropTypes.string,
  searchCoordinates: PropTypes.shape().isRequired,
  selectObjectFromSearch: PropTypes.func.isRequired,
  searchObjectsResults: PropTypes.shape().isRequired,
};

EditorSearchObjects.defaultProps = {
  searchStringValue: '',
  wordForCountWidth: '',
};

export default EditorSearchObjects;
