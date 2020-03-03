import React, { useEffect, useRef, useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Resizable } from 're-resizable';
import { getChatConnectionCondition, getPostMessageData, getPostMessageType } from '../../reducers';
import { setDefaultCondition, setSessionId } from './chatActions';
import { GUEST_PREFIX } from '../../../common/constants/waivio';

import './Chat.less';

const Chat = ({
  visibility,
  postMessageType,
  postMessageData,
  userName,
  isConnectionStart,
  openChat,
  ...props
}) => {
  const [isChatConnected, setChatConnected] = useState(false);
  const [isCloseButton, setCloseButton] = useState(false);
  const chatUrl = 'https://staging.stchat.cf';
  const ifr = useRef();
  const isGuest = userName.startsWith(GUEST_PREFIX);
  const sendChatRequestData = (messageType, data) => {
    const requestData = {
      cmd: 'init',
      args: {
        username: userName,
        sessionData: {},
        isGuest,
      },
    };
    switch (messageType) {
      case 'connected':
        ifr.current.contentWindow.postMessage(requestData, chatUrl);
        break;
      case 'init_response': {
        requestData.cmd = 'auth_connection';
        if (isGuest) {
          requestData.args.sessionData.authToken = localStorage.getItem('accessToken');
        } else {
          requestData.args.sessionData.transactionId = data.value.result.id;
          requestData.args.sessionData.blockNumber = data.value.result.block_num;
        }
        ifr.current.contentWindow.postMessage(requestData, chatUrl);
        break;
      }
      case 'start_chat':
        requestData.cmd = 'start_chat';
        requestData.args.partner = postMessageData;
        ifr.current.contentWindow.postMessage(requestData, chatUrl);
        break;
      default:
    }
  };

  useEffect(() => {
    setCloseButton(true);
    window.addEventListener('message', event => {
      if (event && event.data && event.origin === chatUrl) {
        switch (event.data.cmd) {
          case 'connected':
            sendChatRequestData('connected');
            break;
          case 'init_response':
            if (!isGuest) {
              props
                .setSessionId(event.data.args.session_id)
                .then(data => sendChatRequestData('init_response', data));
            }
            break;
          case 'auth_connection_response':
            setCloseButton(false);
            setChatConnected(true);
            break;
          case 'close_chat':
            openChat();
            break;
          case 'start_chat_response':
            break;
          case 'new_event':
            break;
          default:
        }
      }
    });
  }, []);

  useEffect(() => {
    if (postMessageType !== postMessageData) {
      if (postMessageType === 'start_chat') {
        sendChatRequestData(postMessageType);
      }
    }
  }, [postMessageType, isChatConnected]);

  const setConditionOnHideChat = () => {
    if (!visibility) {
      props.setDefaultCondition();
    }
  };

  setConditionOnHideChat();
  return (
    <Resizable
      className={classNames('Chat', {
        'hide-element': !visibility,
      })}
      defaultSize={{
        width: 410,
        height: 600,
      }}
    >
      <div className="Chat__wrap">
        {isConnectionStart && (
          <iframe
            src={`${chatUrl}/app.html`}
            /* eslint no-return-assign: "error" */
            ref={ifr}
            title="frame"
          />
        )}
      </div>
      {isCloseButton && (
        <div className="Chat__close-button">
          <Icon style={{ fontSize: '25px' }} type="close" onClick={openChat} />
        </div>
      )}
    </Resizable>
  );
};

Chat.propTypes = {
  visibility: PropTypes.bool.isRequired,
  setSessionId: PropTypes.func.isRequired,
  postMessageType: PropTypes.string.isRequired,
  postMessageData: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  isConnectionStart: PropTypes.bool.isRequired,
  setDefaultCondition: PropTypes.func.isRequired,
  openChat: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    postMessageType: getPostMessageType(state),
    postMessageData: getPostMessageData(state),
    isConnectionStart: getChatConnectionCondition(state),
  }),
  {
    setSessionId,
    setDefaultCondition,
  },
)(Chat);
