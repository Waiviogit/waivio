import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import './Chat.less';

const Chat = ({ visibility }) => (
  <div
    className={classNames('Chat', {
      'hide-element': visibility,
    })}
  >
    <div className="Chat__conversations-wrap">
      <SearchUsersAutocomplete allowClear={false} style={{ width: '100%' }} />
    </div>
  </div>
);

Chat.propTypes = {
  visibility: PropTypes.bool.isRequired,
};

export default Chat;
