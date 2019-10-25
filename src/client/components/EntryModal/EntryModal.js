import React, { useState } from 'react';
import { Modal, Checkbox } from 'antd';
import './EntryModal.less';

const EntryModal = () => {
  const [modalVisibility, setModalVisibility] = useState(true);
  const readNoticeHandler = () => {
    localStorage.setItem('message_read', 'true');
    setModalVisibility(false);
  };
  const footer = () => (
    <div className="EntryModal">
      <span className="EntryModal__text-content">I've read the notice</span>
      <div className="EntryModal__checkbox-wrap">
        <Checkbox onChange={readNoticeHandler} />
      </div>
    </div>
  );
  return (
    <div>
      {localStorage.getItem('message_read') !== 'true' ? (
        <Modal
          title={'Important notice'}
          visible={modalVisibility}
          onCancel={() => setModalVisibility(false)}
          footer={[footer()]}
        >
          New address is : w1.com
        </Modal>
      ) : null}
    </div>
  );
};

export default EntryModal;
