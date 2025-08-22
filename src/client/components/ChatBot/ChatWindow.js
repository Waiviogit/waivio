import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Icon, Input, message as antdMessage, Modal, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty, isNil, map } from 'lodash';

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
import ImageSetter from '../ImageSetter/ImageSetter';

import { getLastSelection } from '../../../store/slateEditorStore/editorSelectors';

const CHAT_ID = 'chatId';

const ChatWindow = ({ className, hideChat, open, setIsOpen }) => {
  const [aiExpiredDate, setAiExpiredDate] = useState(Cookie.get('aiExpiredDate'));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState('100%');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOkayBtn, setIsOkayBtn] = useState(false);
  const [currentImage, setCurrentImage] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);

  const dispatch = useDispatch();
  const lastSelection = useSelector(getLastSelection);
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

  const onClick = () => {
    setIsModal(true);
    setIsOpen(false);
  };

  const handleOnOk = () => {
    setMessage(message?.includes('/imagine') ? message : `/imagine \n  ${message}`);
    setCurrentImage([...currentImage, ...loadedImages]);
    setIsOkayBtn(true);
    setIsOpen(true);
    setIsModal(false);
    setIsLoading(false);
    focusInput();
  };

  const handleOpenModal = () => {
    setIsModal(!isModal);
    setIsOkayBtn(false);
    setIsOpen(!open);
  };
  const focusInput = () => {
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        const length = textAreaRef.current.resizableTextArea.textArea.value.length;

        textAreaRef.current.resizableTextArea.textArea.setSelectionRange(length, length);
      }
    }, 0);
  };
  const onLoadingImage = value => setLoading(value);

  const getImages = image => {
    setLoadedImages(image?.slice(0, 2));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  const sendMessage = mess => {
    dispatch(setChatBotId());
    const textFromUser = typeof mess === 'string' ? mess : message;

    const imageRegex = /(https?:\/\/[^\s]*waivio\.nyc3\.digitaloceanspaces[^\s]*)|(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp))/gi;

    const matchedLinks = textFromUser.match(imageRegex) || [];
    const imageList = [...currentImage.map(i => i?.src), ...matchedLinks].slice(0, 2);
    const cleanText = textFromUser.replace(imageRegex, '').trim();

    const question = `${cleanText}\n${imageList.join(' ')}`.trim();

    const newMessage = { text: question, role: 'human' };
    const id = isEmpty(chatId) ? uuidv4() : chatId;

    if (isEmpty(chatId)) Cookie.set(CHAT_ID, id);

    if (!isEmpty(question) && !loading) {
      dispatch(setChatBotMessage(newMessage));
      setMessage('');
      setCurrentImage([]);
      setLoading(true);

      sendChatBotQuestion(question, id, authUser, imageList).then(res => {
        const resutText =
          res.message || isEmpty(res.result.kwargs.content)
            ? 'Sorry, an error has occurred.'
            : res.result.kwargs.content;

        dispatch(setChatBotMessage({ text: resutText, role: 'ai' }));
        setLoading(false);
      });
    }
  };

  const setInputData = e => {
    e.preventDefault();
    setMessage(e.target.value);
  };
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
  }, [chatMessages.length, loading]);

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

      textArea?.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => textArea?.removeEventListener('touchmove', handleTouchMove);
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;
    const handleFocus = () => {
      setTimeout(() => {
        if (textArea) {
          textArea?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    };

    textArea?.addEventListener('focus', handleFocus);

    return () => textArea?.removeEventListener('focus', handleFocus);
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

  const handleImageUpload = (blob, linkMethod = false) => {
    antdMessage.info('Uploading image');

    const formData = new FormData();
    const currentMethod = linkMethod ? 'imageUrl' : 'file';

    formData.append(currentMethod, blob);

    const currentLocation = window && window.location.hostname;

    let url;

    if (currentLocation === 'waiviodev.com') {
      url = `https://waiviodev.com/api/image`;
    } else if (currentLocation === 'waivio') {
      url = `https://waivio.com/api/image`;
    } else {
      url = `https://www.waivio.com/api/image`;
    }

    return fetch(url, {
      body: formData,
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        setCurrentImage([...currentImage, { src: res.image }]);
      })
      .catch(() => {
        antdMessage.error("Couldn't upload image");
      });
  };

  const pasteImageAndText = blob => {
    handleImageUpload(blob);
    setMessage(prev => {
      if (!prev || prev.trim() === '') {
        return '/imagine ';
      }

      return prev.includes('/imagine') ? prev : `/imagine ${prev}`;
    });
  };

  useEffect(() => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;

    if (!textArea) return;

    const handlePaste = async e => {
      const clipboardItems = await navigator.clipboard.read().catch(() => []);

      if (!clipboardItems.length) return;

      const item = clipboardItems[0];

      if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
        const type = item.types.includes('image/png') ? 'image/png' : 'image/jpeg';
        const blob = await item.getType(type);

        pasteImageAndText(blob);

        e.preventDefault();

        return;
      }

      if (item.types.includes('text/html')) {
        const htmlBlob = await item.getType('text/html');
        const htmlText = await htmlBlob.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const img = doc.querySelector('img');

        if (img?.src) {
          if (img.src.startsWith('blob:')) {
            const response = await fetch(img.src);
            const blob = await response.blob();
            pasteImageAndText(blob);
          }

          e.preventDefault();
        }
      }
    };

    textArea.addEventListener('paste', handlePaste);

    // eslint-disable-next-line consistent-return
    return () => textArea.removeEventListener('paste', handlePaste);
  }, [textAreaRef, setCurrentImage]);

  const handleRemoveImage = imageDetail => {
    const filteredImages = currentImage.filter(f => f.id !== imageDetail.id);

    setCurrentImage(filteredImages);
  };
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
    setMessage(`${mess.text}\n`);
    focusInput();
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
    <>
      <div
        className={isFullScreen ? 'ChatWindow fullscreen-wrapper' : ''}
        style={{
          ...(isFullScreen && isModal ? { display: 'none' } : {}),
        }}
      />
      <div
        className={`ChatWindow ${className} ${isMobile() ? 'smooth-height' : ''} ${
          isFullScreen ? 'fullscreen' : ''
        }`}
        style={{
          ...(isMobile() ? { height: `${height}px` } : {}),
          ...(isFullScreen && isModal ? { display: 'none' } : {}),
        }}
      >
        <div className="chat-header">
          <div className="chat-header-logo-wrap">
            <img className="chat-logo" src={siteImage} alt={siteName} />
            {isWaivio || shortSiteName || isFullScreen ? (
              <div className="chat-header-text">{siteName} AI Assistant</div>
            ) : (
              <div className="chat-header-text">
                <p>{siteName}</p>
                <p> AI Assistant</p>
              </div>
            )}
          </div>
          <div
            className={
              isAdministrator && chatId
                ? 'chat-header-buttons-wrap--all'
                : 'chat-header-buttons-wrap'
            }
          >
            {!isWaivio && isAdministrator && reloadBtn}
            {!isMobile() && (
              <Icon
                type={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                className="header-button-icon"
                onClick={toggleFullScreen}
              />
            )}
            {chatId ? (
              <Icon type="delete" className="header-button-icon" onClick={clearChatMessages} />
            ) : (
              <span />
            )}
            <Icon type="close" className="header-button-icon" onClick={onHideClick} />
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
                const key = mes.id || `${mes.role}-${index}`;

                return mes.role === 'human' ? (
                  <UserMessage
                    key={key}
                    text={text}
                    lastMessageRef={index === chatMessages.length - 1 ? lastMessageRef : null}
                  />
                ) : (
                  <AssistantMessage
                    siteImage={siteImage}
                    siteName={siteName}
                    key={key}
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
        {!isEmpty(currentImage) && (
          <div className="ImageSetter">
            <div className="image-box">
              {map(currentImage, image => (
                <div className="image-box__preview" key={image.id}>
                  <div
                    className="image-box__remove"
                    onClick={() => handleRemoveImage(image)}
                    role="presentation"
                  >
                    <i className="iconfont icon-delete_fill Image-box__remove-icon" />
                  </div>
                  <img src={image.src} height="86" alt={image.src} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="chat-footer">
          <button
            onClick={onClick}
            className={'md-sb-button-plus md-add-button md-add-button--comments'}
            type="button"
          >
            <Icon
              type="plus-circle"
              style={{
                fontSize: '26px',
                marginLeft: '16px',
                marginRight: '4px',
                background: 'white',
                borderRadius: '50%',
              }}
            />
          </button>
          <Input.TextArea
            placeholder="Type your question here..."
            value={message}
            onChange={setInputData}
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
        <Modal
          wrapClassName="Settings__modal"
          style={{ zIndex: 2500 }}
          onCancel={handleOpenModal}
          okButtonProps={{ disabled: isLoading || isEmpty(loadedImages) }}
          cancelButtonProps={{ disabled: isLoading }}
          visible={isModal}
          onOk={handleOnOk}
        >
          <ImageSetter
            isAiChat
            onImageLoaded={getImages}
            onLoadingImage={onLoadingImage}
            isEditor={false}
            isOkayBtn={isOkayBtn}
            isModal={isModal}
            lastSelection={lastSelection}
          />
        </Modal>
      </div>
    </>
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
  setIsOpen: PropTypes.func.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool,
};

export default ChatWindow;
