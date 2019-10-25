import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getPostMessageType, getPostMessageData } from '../../reducers';
import { setSessionId } from './chatActions';
import './Chat.less';

@connect(
  state => ({
    postMessageType: getPostMessageType(state),
    postMessageData: getPostMessageData(state),
  }),
  {
    setSessionId,
  },
)
class Chat extends React.Component {
  static propTypes = {
    visibility: PropTypes.bool.isRequired,
    setSessionId: PropTypes.func.isRequired,
    postMessageType: PropTypes.string.isRequired,
    postMessageData: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
  };

  state = {
    connectionStart: false,
  };

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ connectionStart: true });
    window.addEventListener('message', event => {
      if (event && event.data && event.origin === 'https://stchat.cf') {
        switch (event.data.cmd) {
          case 'connected':
            this.sendChatRequestData('connected');
            break;
          case 'init_response':
            this.props
              .setSessionId(event.data.args.session_id)
              .then(data => this.sendChatRequestData('init_response', data));
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

  componentDidUpdate(prevProps) {
    if (prevProps.postMessageType !== this.props.postMessageType) {
      this.sendChatRequestData(this.props.postMessageType);
    }
  }

  sendChatRequestData = (messageType, data) => {
    const requestData = {
      cmd: 'init',
      args: {
        user_name: this.props.userName,
      },
    };
    switch (messageType) {
      case 'connected':
        this.ifr.contentWindow.postMessage(requestData, 'https://stchat.cf');
        break;
      case 'init_response':
        requestData.cmd = 'auth_connection';
        requestData.args.transaction_id = data.value.result.id;
        requestData.args.block_number = data.value.result.block_num;
        this.ifr.contentWindow.postMessage(requestData, 'https://stchat.cf');
        break;
      case 'start_chat':
        requestData.cmd = 'start_chat';
        requestData.args.partner = this.props.postMessageData;
        this.ifr.contentWindow.postMessage(requestData, 'https://stchat.cf');
        break;
      default:
    }
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
