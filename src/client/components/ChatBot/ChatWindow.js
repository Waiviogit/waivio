import React, { useState } from 'react';
import { Button, Icon, Input } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import uuidv4 from 'uuid/v4';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import { getChatBotMessages } from '../../../store/chatBotStore/chatBotSelectors';
import {
  resetChatBotMessages,
  setChatBotId,
  setChatBotMessage,
} from '../../../store/chatBotStore/chatBotActions';
import { sendChatBotQuestion } from '../../../waivioApi/chatBotApi';
import { quickMessages } from './chatBotHelper';
import './ChatWindow.less';

const CHAT_ID = 'chatId';
const ChatWindow = ({ clearChat, className, hideChat }) => {
  const [message, setMessage] = useState('');
  // const [history, setHistory] = useState('');
  const chatMessages = useSelector(getChatBotMessages);
  const chatId = Cookie.get(CHAT_ID);
  const dispatch = useDispatch();

  const sendMessage = mess => {
    dispatch(setChatBotId());
    const newMessage = { isUser: true, text: typeof mess === 'string' ? mess : message };
    const id = isEmpty(chatId) ? uuidv4() : chatId;

    if (isEmpty(chatId)) {
      Cookie.set(CHAT_ID, id);
    }
    dispatch(setChatBotMessage(newMessage));
    setMessage('');
    sendChatBotQuestion(message, id).then(res => dispatch(setChatBotMessage({ text: res.result })));
  };

  const setInputData = e => {
    setMessage(e.target.value);
  };
  const clearChatMessages = () => {
    Cookie.remove(CHAT_ID);
    clearChat();
    dispatch(resetChatBotMessages());
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !isEmpty(message)) {
      sendMessage();
    }
  };

  // useEffect(() => {
  //   getChatBotHistory(chatId).then(r => console.log(r));
  // }, []);

  return (
    <div className={`ChatWindow ${className}`}>
      <div className="chat-header">
        <div className="chat-header-logo-wrap">
          <img className="chat-logo" src="/images/icons/cryptocurrencies/waiv.png" alt={'Waivio'} />
          <div className="chat-header-text">Waivio Assistant</div>
        </div>
        <div className="chat-header-buttons-wrap">
          <Icon type="poweroff" className="hovered" onClick={clearChatMessages} />
          <Icon type="shrink" className="hovered" onClick={hideChat} />
        </div>
      </div>
      <div className="chat-body">
        <div className="info">
          <p>Welcome to Waivio AI Assistant!</p>
          <p> How can I assist you today?</p>
        </div>
        <div className="options">
          {quickMessages.map(mess => (
            <button key={mess.label} onClick={() => sendMessage(mess.text)}>
              {mess.label}
            </button>
          ))}
        </div>
        {!isEmpty(chatMessages) &&
          chatMessages?.map(mes =>
            mes.isUser ? (
              <UserMessage key={mes.text} text={mes.text} />
            ) : (
              <AssistantMessage key={mes.text} text={mes.text} />
            ),
          )}
      </div>
      <div className="chat-footer">
        <Input
          allowClear
          placeholder="Enter your question"
          value={message}
          onInput={setInputData}
          onKeyPress={handleKeyPress}
        />
        <Button disabled={isEmpty(message)} onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  clearChat: PropTypes.func.isRequired,
  hideChat: PropTypes.func.isRequired,
  className: PropTypes.string,
};
export default ChatWindow;
