import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { setSessionId } from './chatActions';
import './Chat.less';

@connect(
  null,
  {
    setSessionId,
  },
)
class Chat extends React.Component {
  static propTypes = {
    visibility: PropTypes.bool.isRequired,
    setSessionId: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
  };

  state = {
    connectionStart: false,
  };

  componentDidMount() {
    const { userName } = this.props;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ connectionStart: true });
    const initResponseData = {
      cmd: 'auth_connection',
      args: {
        user_name: userName,
      },
    };

    window.addEventListener('message', event => {
      if (event && event.data && event.origin === 'https://stchat.cf') {
        switch (event.data.cmd) {
          case 'connected':
            this.sendChatRequestData({
              cmd: 'init',
              args: {
                username: userName,
              },
            });
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
          case 'start_chat_response':
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
    const { visibility } = this.props;
    const { connectionStart } = this.state;
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
