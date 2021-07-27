import { get } from 'lodash';
import * as React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SearchItemObject from './SearchItemObject';

import './EditorSearchObjects.less';

const EditorSearchObjects = ({
  editorNode,
  searchCoordinates,
  wordForCountWidth,
  searchObjectsResults,
  selectObjectFromSearch,
  clearEditorSearchObjects,
}) => {
  const inputWrapper = React.useRef(null);
  const searchBlockItem = React.useRef(null);
  const fakeLeftPositionBlock = React.useRef(null);
  const [selectedObj, setSelectedObj] = React.useState(false);
  const [currentObjIndex, setCurrentObjIndex] = React.useState(0);
  const [coordinates, setCoordinates] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  React.useEffect(() => {
    countCoordinates();
    setPositionWhenBlockExist();

    return () => {
      clearEditorSearchObjects();
    };
  }, [editorNode]);

  React.useEffect(() => {
    if (selectedObj) {
      handleSelectObject(searchObjectsResults[currentObjIndex]);
    }
  }, [selectedObj]);

  const handleKeyDown = event => {
    const blockItemHeight = 60; // height of one item in search result block
    const heightSearchBlock = get(inputWrapper, 'current.offsetHeight', null);
    const scrollTop = get(inputWrapper, 'current.scrollTop', null);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurrentObjIndex(prev => {
        const newResult = prev + 1;
        const offsetScrollHeight = newResult * blockItemHeight;

        if (offsetScrollHeight + blockItemHeight <= inputWrapper.current.scrollHeight) {
          if (offsetScrollHeight + blockItemHeight >= scrollTop + heightSearchBlock) {
            inputWrapper.current.scrollTo(0, scrollTop + blockItemHeight);
          }

          return newResult;
        }

        return prev;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentObjIndex(prev => {
        const newResult = prev - 1;
        const offsetScrollHeight = newResult * blockItemHeight;

        if (newResult >= 0) {
          if (
            offsetScrollHeight <= scrollTop &&
            offsetScrollHeight >= scrollTop + heightSearchBlock
          ) {
            inputWrapper.current.scrollTo(0, offsetScrollHeight);
          }

          return newResult;
        }

        return prev;
      });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      setSelectedObj(true);
    }
  };

  const countCoordinates = () => {
    const searchBlockWidth = get(inputWrapper, 'current.offsetWidth', 0);

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
    if (left + searchBlockWidth > window.innerWidth) {
      left = window.innerWidth - (searchBlockWidth + 50);
    }
    setCoordinates({ top, left: left + 15 });
  };

  const setPositionWhenBlockExist = () => countCoordinates();

  const handleSelectObject = object => selectObjectFromSearch(object);

  return (
    <React.Fragment>
      <div
        ref={inputWrapper}
        className={classNames('editor-search-objects', {
          'editor-search-objects__empty': !searchObjectsResults.length,
          'editor-search-objects__not-scroll': searchObjectsResults.length <= 4,
        })}
        style={{ top: coordinates.top, left: coordinates.left }}
      >
        {searchObjectsResults.map((obj, index) => (
          <SearchItemObject
            obj={obj}
            key={obj.id}
            objectIndex={index}
            searchBlockItem={searchBlockItem}
            objectSelect={handleSelectObject}
            currentObjIndex={currentObjIndex}
            setCurrentObjIndex={setCurrentObjIndex}
          />
        ))}
      </div>
      <div ref={fakeLeftPositionBlock} className="fake-position-left" />
    </React.Fragment>
  );
};

EditorSearchObjects.propTypes = {
  wordForCountWidth: PropTypes.string,
  searchObjectsResults: PropTypes.shape(),
  editorNode: PropTypes.shape().isRequired,
  searchCoordinates: PropTypes.shape().isRequired,
  selectObjectFromSearch: PropTypes.func.isRequired,
  clearEditorSearchObjects: PropTypes.func.isRequired,
};

EditorSearchObjects.defaultProps = {
  wordForCountWidth: '',
  searchObjectsResults: [],
};

export default EditorSearchObjects;
