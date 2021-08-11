import { Modal } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../../MatchBotsBtn';

import ModalAuthorsBody from '../ModalAuthorsBody';

const ModalsAuthors = ({ intl, modalType }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const handleOpen = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <div>
      <MatchBotsBtn
        name={intl.formatMessage({
          id: 'matchBot_authors_btn_add',
          defaultMessage: 'Add author',
        })}
        onClick={handleOpen}
      />
      <Modal
        onOk={handleOpen}
        visible={isModalOpen}
        onCancel={handleCancel}
        title={intl.formatMessage({ id: 'match_bots_add_new_author' })}
        okText={intl.formatMessage({ id: `matchBot_authors_btn_${modalType}` })}
      >
        <ModalAuthorsBody />
      </Modal>
    </div>
  );
};

ModalsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  modalType: PropTypes.string.isRequired,
};

export default injectIntl(ModalsAuthors);
