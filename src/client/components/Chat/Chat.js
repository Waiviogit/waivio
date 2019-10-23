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
        username: `monterey`,
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
      if (event && event.data && event.origin === 'https://stchat.cf') {
        switch (event.data.cmd) {
          case 'connected':
            this.sendChatRequestData(initData);
            break;
          case 'init_response':
            this.props
              .setSessionId(event.data.args.session_id)
              // eslint-disable-next-line react/no-did-mount-set-state
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
    return (
      <div
        className={classNames('Chat', {
          'hide-element': !this.props.visibility,
        })}
      >
        <div className="Chat__wrap">
          {this.props.visibility ? (
            <iframe
              src="https://stchat.cf/app.html"
              /* eslint no-return-assign: "error" */
              ref={f => (this.ifr = f)}
              title="frame"
              sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation"
              name="sandbox"
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Chat;
