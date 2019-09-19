import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import './Chat.less';
import { jsonParse } from '../../helpers/formatter';

class Chat extends React.Component {
  static propTypes = {
    visibility: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const data = { source: 'chat', message: 'hello from chat' };
    window.addEventListener('message', event => {
      if (typeof event.data === 'string' && jsonParse(event.data).source === 'manage') {
        console.log('DATA_CHAT', jsonParse(event.data).message);
      }
    });
    this.ifr.onload = () => {
      this.ifr.contentWindow.postMessage(JSON.stringify(data));
      console.log('Печеньки манага', this.ifr.contentWindow.document.cookie);
    };
  }

  render() {
    return (
      <div
        className={classNames('Chat', {
          'hide-element': this.props.visibility,
        })}
      >
        <div className="Chat__conversations-wrap">
          <SearchUsersAutocomplete allowClear={false} style={{ width: '100%' }} />
        </div>
        <div className="Chat__messages-wrap">
          <iframe
            src="/rewards/manage"
            /* eslint no-return-assign: "error" */
            ref={f => (this.ifr = f)}
            title="frame"
          />
        </div>
      </div>
    );
  }
}

export default Chat;
