import React, { useEffect, useState } from 'react';
import { Icon, Input } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import { getChatBotMessages } from '../../../store/chatBotStore/chatBotSelectors';
import {
  resetChatBotMessages,
  setChatBotHistory,
  setChatBotId,
  setChatBotMessage,
} from '../../../store/chatBotStore/chatBotActions';
import { getChatBotHistory, sendChatBotQuestion } from '../../../waivioApi/chatBotApi';
import { quickMessages } from './chatBotHelper';
import './ChatWindow.less';

const CHAT_ID = 'chatId';

const ChatWindow = ({ className, hideChat }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatMessages = useSelector(getChatBotMessages);
  const chatId = Cookie.get(CHAT_ID);
  const dispatch = useDispatch();

  const sendMessage = mess => {
    dispatch(setChatBotId());
    const question = typeof mess === 'string' ? mess : message;
    const newMessage = { text: question, role: 'human' };
    const id = isEmpty(chatId) ? uuidv4() : chatId;

    if (isEmpty(chatId)) {
      Cookie.set(CHAT_ID, id);
    }
    if (!isEmpty(question) && !loading) {
      dispatch(setChatBotMessage(newMessage));
      setMessage('');
      setLoading(true);
      sendChatBotQuestion(question, id).then(res => {
        dispatch(setChatBotMessage({ text: res.result, role: 'ai' }));
        setLoading(false);
      });
    }
  };

  const setInputData = e => {
    setMessage(e.target.value);
  };
  const clearChatMessages = () => {
    Cookie.remove(CHAT_ID);
    setMessage('');
    hideChat();
    dispatch(resetChatBotMessages());
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !isEmpty(message)) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatId && isEmpty(chatMessages))
      getChatBotHistory(chatId).then(r => dispatch(setChatBotHistory(r.result)));
  }, [chatId]);

  return (
    <div className={`ChatWindow ${className}`}>
      <div className="chat-header">
        <div className="chat-header-logo-wrap">
          <img className="chat-logo" src="/images/icons/cryptocurrencies/waiv.png" alt="Waivio" />
          <div className="chat-header-text">Waivio Assistant</div>
        </div>
        <div className="chat-header-buttons-wrap">
          {chatId ? (
            <Icon type="poweroff" className="hovered" onClick={clearChatMessages} />
          ) : (
            <span />
          )}
          <Icon type="shrink" className="hovered" onClick={hideChat} />
        </div>
      </div>
      <div className="chat-body">
        {isEmpty(chatMessages) && (
          <>
            <div className="info">
              <div className="info-paragraph">Welcome to Waivio AI Assistant!</div>
              <div className="info-paragraph">How can I assist you today?</div>
            </div>
            <div className="options">
              {quickMessages.map(mess => (
                <button key={mess.label} onClick={() => setMessage(`${mess.text} `)}>
                  {mess.label}
                </button>
              ))}
              <button key={'About Waivio'} onClick={() => sendMessage('About Waivio')}>
                About Waivio
              </button>
            </div>{' '}
          </>
        )}
        <div className="chat-messages">
          {!isEmpty(chatMessages) &&
            chatMessages.map(mes =>
              mes.role === 'human' ? (
                <UserMessage key={mes.text} text={mes.text} />
              ) : (
                <AssistantMessage key={mes.text} text={mes.text} loading={false} />
              ),
            )}
          {loading && <AssistantMessage loading />}
        </div>
      </div>
      <div className="chat-footer">
        <Input.TextArea
          placeholder="Enter your question"
          value={message}
          onInput={setInputData}
          onKeyDown={handleKeyDown}
          className="chat-input"
          autoSize={{ minRows: 1, maxRows: 5 }}
        />
        <span
          role="presentation"
          onClick={() => sendMessage()}
          className="QuickComment__send-comment"
        >
          <img src="/images/icons/send.svg" alt="send" />
        </span>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  hideChat: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ChatWindow;
