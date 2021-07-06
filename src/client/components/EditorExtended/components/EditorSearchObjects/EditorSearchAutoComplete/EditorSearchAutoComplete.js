import * as React from 'react';
import { get } from 'lodash';
import PropTypes from "prop-types";

import './EditorSearchAutoComplete.less';

const EditorSearchAutoComplete = ({ onKeyDown, ref }) => {
  const [searchString, setSearchString] = React.useState('');

  React.useEffect(() => {
    if (get(ref, 'current')) ref.current.focus();
  }, [get(ref, 'current')]);

  const handleChange = event => {
    const value = event.target.value;

    setSearchString(value);
  };

  const handleOnKeyDown = () => setSearchString(searchString);

  return (
    <div className="editor_search">
      <input
        ref={ref}
        type="text"
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
  onKeyDown: PropTypes.func,
  ref: PropTypes.shape().isRequired,
}

EditorSearchAutoComplete.defaultProps = {
  onKeyDown: () => {}
}

export default EditorSearchAutoComplete;
