import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getAuthenticatedUserName } from '../../reducers';
import { setSessionId } from './chatActions';
import './Chat.less';

@connect(
  state => ({
    userName: getAuthenticatedUserName(state),
  }),
  {
    setSessionId,
  },
)
class Chat extends React.Component {
  static propTypes = {
    visibility: PropTypes.bool.isRequired,
    setSessionId: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    connectionStart: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { userName } = this.props;
    const initData = {
      cmd: 'init',
      args: {
        username: `${userName}`,
      },
    };

    const initResponseData = {
      cmd: 'auth_connection',
      args: {
        user_name: `${userName}`,
        block_number: 1,
        transaction_id: '',
      },
    };

    window.addEventListener('message', event => {
      if (event && event.data && event.origin === 'https://stchat.cf') {
        switch (event.data.cmd) {
          case 'connected':
            this.sendChatRequestData(initData);
            break;
          case 'init_response':
            this.props
              .setSessionId(event.data.args.session_id)
              .then(data => {
                initResponseData.args.transaction_id = data.value.result.id;
                initResponseData.args.block_number = data.value.result.block_num;
              })
              .then(() => this.sendChatRequestData(initResponseData));
            break;
          case 'auth_connection_response':
            console.log(event.data.args.status);
            break;
          case 'new_event':
            console.log('new_event');
            break;
          default:
        }
      }
    });
  }

  sendChatRequestData = data => {
    this.ifr.contentWindow.postMessage(data, 'https://stchat.cf');
  };

  render() {
    const { visibility, connectionStart } = this.props;
    return (
      <div
        className={classNames('Chat', {
          'hide-element': !visibility,
        })}
      >
        <div className="Chat__wrap">
          {connectionStart ? (
            <iframe
              src="https://stchat.cf/app.html"
              /* eslint no-return-assign: "error" */
              ref={f => (this.ifr = f)}
              title="frame"
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Chat;
