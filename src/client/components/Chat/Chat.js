import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getPostMessageType, getPostMessageData, getChatConnectionCondition } from '../../reducers';
import { setSessionId, setDefaultCondition } from './chatActions';
import './Chat.less';

@connect(
  state => ({
    postMessageType: getPostMessageType(state),
    postMessageData: getPostMessageData(state),
    isConnectionStart: getChatConnectionCondition(state),
  }),
  {
    setSessionId,
    setDefaultCondition,
  },
)
class Chat extends React.Component {
  static propTypes = {
    visibility: PropTypes.bool.isRequired,
    setSessionId: PropTypes.func.isRequired,
    postMessageType: PropTypes.string.isRequired,
    postMessageData: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    isConnectionStart: PropTypes.bool.isRequired,
    setDefaultCondition: PropTypes.func.isRequired,
    openChat: PropTypes.func.isRequired,
  };

  state = {
    isAuthorized: false,
  };

  componentDidMount() {
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
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({ isAuthorized: true });
            break;
          case 'close_chat':
            this.props.openChat();
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
    if (
      prevProps.postMessageType !== this.props.postMessageType ||
      prevProps.postMessageType !== this.props.postMessageData
    ) {
      if (this.props.postMessageType === 'start_chat') {
        this.sendChatRequestData(this.props.postMessageType);
      }
    }
  }

  setConditionOnHideChat = () => {
    if (!this.props.visibility) {
      this.props.setDefaultCondition();
    }
  };

  sendChatRequestData = (messageType, data) => {
    const requestData = {
      cmd: 'init',
      args: {
        username: this.props.userName,
      },
    };
    switch (messageType) {
      case 'connected':
        this.ifr.contentWindow.postMessage(requestData, 'https://stchat.cf');
        break;
      case 'init_response':
        requestData.cmd = 'auth_connection';
        requestData.args.transactionId = data.value.result.id;
        requestData.args.blockNumber = data.value.result.block_num;
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
    const { visibility, isConnectionStart } = this.props;
    this.setConditionOnHideChat();
    return (
      <div
        className={classNames('Chat', {
          'hide-element': !visibility,
        })}
      >
        <div className="Chat__wrap">
          {isConnectionStart && (
            <iframe
              src="https://stchat.cf/app.html"
              /* eslint no-return-assign: "error" */
              ref={f => (this.ifr = f)}
              title="frame"
            />
          )}
        </div>
      </div>
    );
  }
}

export default Chat;
