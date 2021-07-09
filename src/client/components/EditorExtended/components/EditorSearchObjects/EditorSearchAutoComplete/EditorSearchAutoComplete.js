import * as React from 'react';
import PropTypes from 'prop-types';
import { debounce } from "lodash";

import SearchOneObject from "../SearchOneObject";

import './EditorSearchAutoComplete.less';

const EditorSearchAutoComplete = ({
  onBlur,
  onKeyDown,
  handleBlur,
  searchString,
  onChange,
  searchObjects,
  setSearchString,
  selectObjectSearch,
  searchObjectsResults,
}) => {
  const searchInput = React.useRef(null);

  React.useEffect(() => {
    searchInput.current.focus();
    document.addEventListener('click', blurInput);

    return () => {
      document.removeEventListener('click', blurInput);
    };
  }, []);

  const blurInput = event => {
    handleBlur(event, searchInput.current.value)
  };

  const debouncedSearch = debounce(searchStr => searchObjects(searchStr), 100);

  const handleChange = event => {
    const value = event.target.value;

    onChange(event);
    setSearchString(value);
    debouncedSearch(value);
  };

  const handleSelectObject = object => {
    selectObjectSearch(object);
  };

  return (
    <div className="editor_search">
      <input
        ref={searchInput}
        type="text"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        value={searchString}
        onChange={handleChange}
        className="editor_search__input"
      />
      <div>
        {searchObjectsResults.map(obj => <SearchOneObject obj={obj} objectSelect={handleSelectObject} key={obj.id} />)}
      </div>
    </div>
  );
};

EditorSearchAutoComplete.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  handleBlur: PropTypes.func.isRequired,
  searchObjects: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  selectObjectSearch: PropTypes.func.isRequired,
  searchObjectsResults: PropTypes.arrayOf(PropTypes.object),
};

EditorSearchAutoComplete.defaultProps = {
  onBlur: () => {},
  onChange: () => {},
  onKeyDown: () => {},
  isSearchObject: false,
  searchObjectsResults: [],
};

export default EditorSearchAutoComplete;
