import React, { useEffect, useState, useRef } from 'react';
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
import { getIsWaivio } from '../../../store/appStore/appSelectors';

const CHAT_ID = 'chatId';

const ChatWindow = ({ className, hideChat }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatMessages = useSelector(getChatBotMessages);
  const isWaivio = useSelector(getIsWaivio);
  const chatId = Cookie.get(CHAT_ID);
  const dispatch = useDispatch();
  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const touchStartRef = useRef(0);

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
    if (chatId && isEmpty(chatMessages) && isWaivio) {
      getChatBotHistory(chatId).then(r => dispatch(setChatBotHistory(r.result)));
    }
  }, [chatId, chatMessages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, loading]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (chatBody) {
      const handleTouchStart = e => {
        touchStartRef.current = e.touches[0].clientY;
      };

      const handleTouchMove = e => {
        const touchCurrent = e.touches[0].clientY;
        const { scrollTop, scrollHeight, clientHeight } = chatBody;
        const delta = touchStartRef.current - touchCurrent;

        if (
          (scrollTop === 0 && delta < 0) ||
          (scrollTop + clientHeight === scrollHeight && delta > 0)
        ) {
          e.preventDefault();
        }
      };

      const handleWheel = e => {
        const { scrollTop, scrollHeight, clientHeight } = chatBody;
        const delta = e.deltaY;

        if (
          (scrollTop === 0 && delta < 0) ||
          (scrollTop + clientHeight === scrollHeight && delta > 0)
        ) {
          e.preventDefault();
        }
      };

      chatBody.addEventListener('touchstart', handleTouchStart, { passive: false });
      chatBody.addEventListener('touchmove', handleTouchMove, { passive: false });
      chatBody.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        chatBody.removeEventListener('touchstart', handleTouchStart);
        chatBody.removeEventListener('touchmove', handleTouchMove);
        chatBody.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const handleTouchMove = e => {
      e.stopPropagation();
    };

    const textArea = textAreaRef.current?.resizableTextArea?.textArea;

    if (textArea) {
      textArea.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        textArea.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, []);

  const handleQuickMessageClick = mess => {
    setMessage(`${mess.text}:\n`);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const length = textAreaRef.current.resizableTextArea.textArea.value.length;

        textAreaRef.current.resizableTextArea.textArea.setSelectionRange(length, length);
      }
    }, 0);
  };

  return (
    <div className={`ChatWindow ${className}`}>
      <div className="chat-header">
        <div className="chat-header-logo-wrap">
          <img className="chat-logo" src="/images/icons/cryptocurrencies/waiv.png" alt="Waivio" />
          <div className="chat-header-text">Waivio AI Assistant</div>
        </div>
        <div className="chat-header-buttons-wrap">
          {chatId ? (
            <Icon type="delete" className="header-button-icon" onClick={clearChatMessages} />
          ) : (
            <span />
          )}
          <Icon type="shrink" className="header-button-icon" onClick={hideChat} />
        </div>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {isEmpty(chatMessages) && (
          <>
            <div className="info">
              <div className="info-paragraph">How can I help you today?</div>
            </div>
            <div className="options">
              {quickMessages.map(mess => (
                <button key={mess.label} onClick={() => handleQuickMessageClick(mess)}>
                  {mess.label}
                </button>
              ))}
            </div>
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
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-footer">
        <Input.TextArea
          placeholder="Type your question here..."
          value={message}
          onInput={setInputData}
          onKeyDown={handleKeyDown}
          className="chat-input"
          autoSize={{ minRows: 1, maxRows: 5 }}
          ref={textAreaRef}
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
