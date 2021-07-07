import * as React from 'react';
import PropTypes from 'prop-types';

import './EditorSearchAutoComplete.less';

const EditorSearchAutoComplete = ({ onKeyDown, onBlur }) => {
  const searchInput = React.useRef(null);
  const [searchString, setSearchString] = React.useState('');

  React.useEffect(() => {
    searchInput.current.focus();
  }, []);

  const handleChange = event => {
    const value = event.target.value;

    setSearchString(value);
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
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    </div>
  );
};

EditorSearchAutoComplete.propTypes = {
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
};

EditorSearchAutoComplete.defaultProps = {
  onBlur: () => {},
  onKeyDown: () => {},
};

export default EditorSearchAutoComplete;
