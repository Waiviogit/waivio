import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Icon, Input, message as antdMessage, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty, isNil } from 'lodash';

import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import { getChatBotMessages } from '../../../store/chatBotStore/chatBotSelectors';
import {
  resetChatBotMessages,
  setChatBotHistory,
  setChatBotId,
  setChatBotMessage,
} from '../../../store/chatBotStore/chatBotActions';
import {
  getChatBotHistory,
  sendChatBotQuestion,
  updateAIKnowledge,
} from '../../../waivioApi/chatBotApi';
import { quickMessages } from './chatBotHelper';
import {
  getHostAddress,
  getIsWaivio,
  getUserAdministrator,
  getWebsiteConfiguration,
} from '../../../store/appStore/appSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import './ChatWindow.less';

const CHAT_ID = 'chatId';

const ChatWindow = ({ className, hideChat, open }) => {
  const [aiExpiredDate, setAiExpiredDate] = useState(Cookie.get('aiExpiredDate'));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState('100%');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const dispatch = useDispatch();
  const config = useSelector(getWebsiteConfiguration);
  const mobileLogo = get(config, 'mobileLogo');
  const desktopLogo = get(config, 'desktopLogo');
  const chatMessages = useSelector(getChatBotMessages);
  const isWaivio = useSelector(getIsWaivio);
  const authUser = useSelector(getAuthenticatedUserName);
  const host = useSelector(getHostAddress);
  const currHost = host || (typeof location !== 'undefined' && location.hostname);
  const chatId = Cookie.get(CHAT_ID);
  const textAreaRef = useRef(null);
  const chatBodyRef = useRef(null);
  const touchStartRef = useRef(0);
  const lastMessageRef = useRef(null);
  const siteName = isWaivio ? 'Waivio' : config?.header?.name || currHost;
  const isAdministrator = useSelector(getUserAdministrator);
  const siteNameLength = chatId ? 15 : 23;
  const shortSiteName = siteName?.length < siteNameLength;
  const siteImage = isWaivio
    ? '/images/icons/cryptocurrencies/waiv.png'
    : desktopLogo || mobileLogo;

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  const sendMessage = mess => {
    dispatch(setChatBotId());
    const question = typeof mess === 'string' ? mess : message;
    const newMessage = { text: question, role: 'human' };
    const id = isEmpty(chatId) ? uuidv4() : chatId;

    if (isEmpty(chatId)) Cookie.set(CHAT_ID, id);
    if (!isEmpty(question) && !loading) {
      dispatch(setChatBotMessage(newMessage));
      setMessage('');
      setLoading(true);
      sendChatBotQuestion(question, id, authUser).then(res => {
        const resutText =
          res.message || isEmpty(res.result.kwargs.content)
            ? 'Sorry, an error has occurred.'
            : res.result.kwargs.content;

        dispatch(setChatBotMessage({ text: resutText, role: 'ai' }));
        setLoading(false);
      });
    }
  };

  const setInputData = e => setMessage(e.target.value);
  const clearChatMessages = () => {
    Cookie.remove(CHAT_ID);
    setMessage('');
    dispatch(resetChatBotMessages());
  };

  const onHideClick = () => {
    hideChat();
    setIsFullScreen(false);
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
  }, [chatId, chatMessages?.length]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chatMessages, loading]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (chatBody) {
      // eslint-disable-next-line no-return-assign
      const handleTouchStart = e => (touchStartRef.current = e.touches[0].clientY);
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
      const stopPropagation = e => e.stopPropagation();
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
      chatBody.addEventListener('touchmove', stopPropagation, { passive: false });
      chatBody.addEventListener('wheel', handleWheel, { passive: false });
      chatBody.addEventListener('wheel', stopPropagation, { passive: false });

      return () => {
        chatBody.removeEventListener('touchstart', handleTouchStart);
        chatBody.removeEventListener('touchmove', handleTouchMove);
        chatBody.removeEventListener('touchmove', stopPropagation);
        chatBody.removeEventListener('wheel', handleWheel);
        chatBody.removeEventListener('wheel', stopPropagation);
      };
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;

    if (textArea) {
      const handleTouchMove = e => e.stopPropagation();

      textArea.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => textArea.removeEventListener('touchmove', handleTouchMove);
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;

    if (textArea) {
      const handleFocus = () => {
        setTimeout(() => {
          if (textAreaRef.current) textAreaRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      };

      textArea.addEventListener('focus', handleFocus);

      return () => textArea.removeEventListener('focus', handleFocus);
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      const handleViewportChange = () => {
        setHeight(window.visualViewport.height);
      };

      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      handleViewportChange();

      return () => {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      };
    }
  }, []);

  const onReloadClick = () => {
    isNil(aiExpiredDate) || aiExpiredDate < Date.now()
      ? updateAIKnowledge(authUser, currHost).then(r => {
          if (!isEmpty(r) && !r.message) {
            r.result
              ? antdMessage.success('The AI assistant update has been enabled.')
              : antdMessage.info('Update AI Assistant can only be done once per day.');
            setAiExpiredDate(r.timeToNextRequest);
            Cookie.set('aiExpiredDate', r.timeToNextRequest);
          }
        })
      : antdMessage.info('Update AI Assistant can only be done once per day.');
  };

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

  const reloadBtn = (
    <Tooltip
      placement="topLeft"
      title={'Update AI Assistant for the site. Can only be done once per day.'}
      overlayClassName="AiReloadContainer"
      overlayStyle={{ top: '10px' }}
    >
      <Icon type="reload" className="header-button-icon" onClick={onReloadClick} />
    </Tooltip>
  );

  const content = (
    <div
      className={`ChatWindow ${className} ${isMobile() ? 'smooth-height' : ''} ${
        isFullScreen ? 'fullscreen' : ''
      }`}
      style={isMobile() ? { height: `${height}px` } : {}}
    >
      <div className="chat-header">
        <div className="chat-header-logo-wrap">
          <img className="chat-logo" src={siteImage} alt={siteName} />
          {(isWaivio || shortSiteName) && (
            <div className="chat-header-text">{siteName} AI Assistant</div>
          )}
        </div>
        <div
          className={
            isAdministrator && chatId ? 'chat-header-buttons-wrap--all' : 'chat-header-buttons-wrap'
          }
        >
          {!isWaivio && isAdministrator && reloadBtn}
          <Icon
            type={isFullScreen ? 'fullscreen' : 'fullscreen-exit'}
            className="header-button-icon"
            onClick={toggleFullScreen}
          />
          {chatId ? (
            <Icon type="delete" className="header-button-icon" onClick={clearChatMessages} />
          ) : (
            <span />
          )}
          <Icon type="shrink" className="header-button-icon" onClick={onHideClick} />
        </div>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {isEmpty(chatMessages) && (
          <>
            <div className="info">
              <div className="info-paragraph">How can I help you today?</div>
            </div>
            <div className="options">
              {quickMessages(siteName, currHost, config?.header?.name).map(mess => (
                <button key={mess.label} onClick={() => handleQuickMessageClick(mess)}>
                  {mess.label}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="chat-messages">
          {!isEmpty(chatMessages) &&
            chatMessages.map((mes, index) => {
              const text = mes.text.replace(/\n\n/g, '\n');

              return mes.role === 'human' ? (
                <UserMessage
                  key={mes.text}
                  text={text}
                  lastMessageRef={index === chatMessages.length - 1 ? lastMessageRef : null}
                />
              ) : (
                <AssistantMessage
                  siteImage={siteImage}
                  siteName={siteName}
                  key={mes.text}
                  text={text}
                  loading={false}
                  lastMessageRef={index === chatMessages.length - 1 ? lastMessageRef : null}
                />
              );
            })}
          {loading && (
            <AssistantMessage
              siteImage={siteImage}
              siteName={siteName}
              loading
              lastMessageRef={lastMessageRef}
            />
          )}
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

  return isMobile() ? (
    <Drawer visible={open} placement="bottom">
      {content}
    </Drawer>
  ) : (
    content
  );
};

ChatWindow.propTypes = {
  hideChat: PropTypes.func.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool,
};

export default ChatWindow;
