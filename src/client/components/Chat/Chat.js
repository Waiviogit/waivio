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
  };

  componentDidMount() {
    const initData = {
      cmd: 'init',
      args: {
        username: `${this.props.userName}`,
      },
    };

    const initResponseData = {
      cmd: 'auth_connection',
      args: {
        user_name: `${this.props.userName}`,
        block_number: 1,
        transaction_id: '',
      },
    };

    window.addEventListener('message', event => {
      const chatResponseData = JSON.parse(event.data);
      switch (chatResponseData.cmd) {
        case 'connected':
          this.sendChatRequestData(initData);
          break;
        case 'init_response':
          this.props
            .setSessionId(chatResponseData.args.session_id)
            // eslint-disable-next-line react/no-did-mount-set-state
            .then(data => {
              initResponseData.args.transaction_id = data.value.result.id;
              initResponseData.args.block_number = data.value.result.block_num;
            })
            .then(() => this.sendChatRequestData(initResponseData));
          break;
        case 'auth_connection_response':
          console.log(chatResponseData.args.status);
          break;
        case 'new_event':
          console.log('new_event');
          break;
        default:
      }
    });
    // eslint-disable-next-line react/no-did-mount-set-state
  }

  sendChatRequestData = data => {
    this.ifr.onload = () => {
      this.ifr.contentWindow.postMessage(JSON.stringify(data));
    };
  };

  render() {
    return (
      <div
        className={classNames('Chat', {
          'hide-element': !this.props.visibility,
        })}
      >
        <div className="Chat__wrap">
          <iframe
            src="https://stchat.cf/"
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
