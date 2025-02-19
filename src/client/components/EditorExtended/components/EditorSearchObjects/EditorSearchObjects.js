import { get } from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactEditor } from 'slate-react';
import Loading from '../../../Icon/Loading';

import SearchItemObject from './SearchItemObject';

import './EditorSearchObjects.less';

const EditorSearchObjects = ({
  searchCoordinates,
  wordForCountWidth,
  searchObjectsResults,
  selectObjectFromSearch,
  clearEditorSearchObjects,
  handleObjectSelect,
  editor,
  isComment,
  isLoading,
  startToSearching,
}) => {
  const inputWrapper = React.useRef(null);
  const searchBlockItem = React.useRef(null);
  const fakeLeftPositionBlock = React.useRef(null);
  const searchObjectsResultsRef = React.useRef(searchObjectsResults); // Use ref to persist data across renders
  const isLoadingRef = React.useRef(startToSearching); // Use ref to persist data across renders
  const [selectedObj, setSelectedObj] = React.useState(false);
  const [currentObjIndex, setCurrentObjIndex] = React.useState(0);
  const [coordinates, setCoordinates] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown, { capture: true });
      window.addEventListener('keydown', handleKeyEnter, { capture: false });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown, { capture: true });
        window.removeEventListener('keydown', handleKeyEnter, { capture: false });
      }
    };
  }, []);

  React.useEffect(() => {
    searchObjectsResultsRef.current = searchObjectsResults;
    isLoadingRef.current = startToSearching;
  }, [searchObjectsResults, startToSearching]);

  React.useEffect(() => {
    countCoordinates();
    setPositionWhenBlockExist();

    return () => {
      clearEditorSearchObjects(null, editor);
    };
  }, []);

  React.useEffect(() => {
    if (selectedObj) {
      handleSelectObject(searchObjectsResults[currentObjIndex]);
    }
  }, [selectedObj]);

  const handleKeyEnter = event => {
    if (event.key === 'Enter') {
      if (searchObjectsResultsRef.current.length) {
        event.preventDefault();
        setSelectedObj(true);
      } else {
        clearEditorSearchObjects();
        searchObjectsResultsRef.current = [];
      }
    }

    if (
      !searchObjectsResultsRef.current.length &&
      !isLoadingRef.current &&
      event.code === 'Space'
    ) {
      clearEditorSearchObjects();
    }
  };

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
          if (offsetScrollHeight <= scrollTop) {
            inputWrapper.current.scrollTo(0, offsetScrollHeight);
          }

          return newResult;
        }

        return prev;
      });
    }
  };

  const countCoordinates = () => {
    const searchBlockWidth = get(inputWrapper, 'current.offsetWidth', 0);

    fakeLeftPositionBlock.current.innerHTML = wordForCountWidth;
    // eslint-disable-next-line react/no-find-dom-node
    const parent = ReactEditor.toDOMNode(editor, editor);
    const parentBoundary = parent.getBoundingClientRect();
    const top = searchCoordinates.bottom - parentBoundary.top + searchCoordinates.height;
    const selectionCenter =
      searchCoordinates.left + searchCoordinates.width / 2 - parentBoundary.left;
    let left = selectionCenter;
    const screenLeft = parentBoundary.left + selectionCenter;

    if (screenLeft < 0) left = -parentBoundary.left;
    if (wordForCountWidth) left -= fakeLeftPositionBlock.current.offsetWidth;
    if (typeof window !== 'undefined' && left + searchBlockWidth + 35 >= window.innerWidth) {
      left = window.innerWidth - (searchBlockWidth + 50);
    }
    setCoordinates({ top, left: left + 15 });
  };

  const setPositionWhenBlockExist = () => countCoordinates();

  const handleSelectObject = object => {
    if (!object) return;

    if (handleObjectSelect) {
      handleObjectSelect(object);
    } else {
      selectObjectFromSearch(object, editor);
    }
  };

  return (
    <React.Fragment>
      <div
        ref={inputWrapper}
        className={classNames('editor-search-objects', {
          'editor-search-objects__empty': !searchObjectsResults.length && !isLoading,
          'editor-search-objects__not-scroll': searchObjectsResults.length <= 4 || isLoading,
          'editor-search-objects--loading': isLoading,
        })}
        style={{ top: coordinates.top, left: isComment ? 0 : coordinates.left }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          searchObjectsResults.map((obj, index) => (
            <SearchItemObject
              obj={obj}
              key={obj.id}
              objectIndex={index}
              searchBlockItem={searchBlockItem}
              objectSelect={() => {
                setSelectedObj(true);
                setCurrentObjIndex(index);
              }}
              currentObjIndex={currentObjIndex}
              setCurrentObjIndex={setCurrentObjIndex}
            />
          ))
        )}
      </div>
      <div ref={fakeLeftPositionBlock} className="fake-position-left" />
    </React.Fragment>
  );
};

EditorSearchObjects.propTypes = {
  wordForCountWidth: PropTypes.string,
  isComment: PropTypes.bool,
  startToSearching: PropTypes.bool,
  isLoading: PropTypes.bool,
  searchObjectsResults: PropTypes.shape(),
  searchCoordinates: PropTypes.shape().isRequired,
  selectObjectFromSearch: PropTypes.func.isRequired,
  handleObjectSelect: PropTypes.func,
  clearEditorSearchObjects: PropTypes.func.isRequired,
  editor: PropTypes.shape().isRequired,
};

EditorSearchObjects.defaultProps = {
  wordForCountWidth: '',
  searchObjectsResults: [],
  handleObjectSelect: null,
  isComment: false,
};

export default EditorSearchObjects;
