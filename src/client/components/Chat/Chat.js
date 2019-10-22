import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { jsonParse } from '../../helpers/formatter';
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

  state = {
    initResponseData: {
      cmd: 'auth_connection',
      args: {
        user_name: '',
        block_number: 123,
        transaction_id: '',
      },
    },
  };

  componentDidMount() {
    this.props.setSessionId('aswasdf_asdf_fagjkas').then(data => console.log('data', data));
    // const initData = {
    //   cmd: "init",
    //   args: {
    //     username: `${this.props.userName}`
    //   }
    // };

    // window.addEventListener('message', event => {
    // let chatResponseData = jsonParse(event.data);
    // switch (chatResponseData.cmd) {
    //   case "connected":
    //     this.sendChatRequestData(initData);
    //     break;
    //   case "init_response":
    // setSessionId(chatResponseData.args.session_id)
    //   .then(transactionId => this.setState({
    //     initResponseData: {
    //       ...this.state.initResponseData,
    //       args: {
    //         ...this.state.initResponseData.args,
    //         transaction_id: transactionId,
    //         user_name: `${this.props.userName}`
    //       }
    //     }
    //   })
    //   .then(() => this.sendChatRequestData(this.state.initResponseData))
    // break;
    // case "auth_connection_response":
    //   console.log(chatResponseData.args.status);
    //   break;
    // case "new_event":
    //   console.log("new_event");
    //   break;
    // }

    // });
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      initResponseData: {
        ...this.state.initResponseData,
        args: {
          ...this.state.initResponseData.args,
          transaction_id: 'asdgfasdfga',
          user_name: `${this.props.userName}`,
        },
      },
    });
  }

  sendChatRequestData = data => {
    this.ifr.onload = () => {
      this.ifr.contentWindow.postMessage(JSON.stringify(data));
    };
  };

  render() {
    console.log(this.state);
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
