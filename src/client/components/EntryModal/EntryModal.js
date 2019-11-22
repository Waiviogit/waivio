import React, { useState } from 'react';
import { Modal, Checkbox } from 'antd';
import '../../styles/styles-shortcodes.less';
import './EntryModal.less';

const EntryModal = () => {
  const [modalVisibility, setModalVisibility] = useState(true);
  const readNoticeHandler = () => {
    localStorage.setItem('message_read', 'true');
    setModalVisibility(false);
  };
  const footer = () => (
    <div className="EntryModal__footer">
      <span className="EntryModal__footer-text-content">Больше не показывать</span>
      <div className="EntryModal__footer-checkbox-wrap">
        <Checkbox onChange={readNoticeHandler} />
      </div>
    </div>
  );
  const title = () => (
    <div>
      <span className="EntryModal invest-title">Invest</span>
      <span className="EntryModal arena-title">Arena</span>
      <span> теперь на блокчейне!</span>
    </div>
  );

  const handleClickRedirect = () => {
    window.open('http://investarena.com');
  };
  const content = () => (
    <div>
      <div>
        <span> Рады сообщить, что 1 ноября</span>
        <span className="EntryModal invest-title pl1">Invest</span>
        <span className="EntryModal arena-title">Arena</span>
        <span> перейдет на новый уровень.</span>
      </div>
      <div>В новой версии у тебя появятся такие возможности, как:</div>
      <div className="EntryModal pl4">
        <span>-</span>
        <span> Надоело однообразие? Более</span>
        <span className="EntryModal fw6">30 000 постов в день </span>
        <span> от пользователей со</span>
        <span className="EntryModal fw6">всего мира!</span>
      </div>
      <div className="EntryModal pl4">
        <span>-</span>
        <span> Ищешь крутого наставника? Всегда актуальные</span>
        <span className="EntryModal fw6">рейтинги </span>
        <span> авторов по всем темам!</span>
      </div>
      <div className="EntryModal pl4">
        <span>-</span>
        <span>Любишь писать</span>
        <span className="EntryModal fw6">посты?</span>
        <span className="EntryModal invest-title pl1">Invest</span>
        <span className="EntryModal arena-title">Arena</span>
        <span>любит за это</span>
        <span className="EntryModal fw6">платить!</span>
      </div>
      <div className="EntryModal pl4">
        <span>-</span>
        <span>
          Теряетесь в многообразии информации? Многоуровневая система фильтров не позволит вам
          потеряться среди этого огромного контента!
        </span>
      </div>
      <div className="EntryModal pb3 pt3">
        <span>Ну, а если вам нравится текущая</span>
        <span className="EntryModal invest-title pl1">Invest</span>
        <span className="EntryModal arena-title">Arena</span>
        <span>, не переживайте, она останется доступной на домене</span>
        <span className="EntryModal link" onClick={handleClickRedirect} role="presentation">
          v1.investarena.com
        </span>
      </div>
      <div>
        <div>Оставайтесь с нами</div>
        <div>
          <span>Команда</span>
          <span className="EntryModal invest-title pl1">Invest</span>
          <span className="EntryModal arena-title">Arena</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {typeof window !== 'undefined' && localStorage.getItem('message_read') !== 'true' ? (
        <Modal
          title={[title()]}
          visible={modalVisibility}
          onCancel={() => setModalVisibility(false)}
          width={720}
          footer={[footer()]}
        >
          {content()}
        </Modal>
      ) : null}
    </div>
  );
};

export default EntryModal;
