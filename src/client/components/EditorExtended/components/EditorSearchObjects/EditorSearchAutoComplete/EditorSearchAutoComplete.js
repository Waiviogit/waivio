import * as React from 'react';

import './EditorSearchAutoComplete.less';

const EditorSearchAutoComplete = () => {
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

export default EditorSearchAutoComplete;
