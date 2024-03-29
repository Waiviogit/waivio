import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import './ModalBodyDelete.less';

const ModalBodyDelete = ({ name, intl, handleCloseModal, handleDeleteBot, type }) => (
  <div className="deleteConfirmation">
    <span>
      {intl.formatMessage({
        id: `match_bots_${type}_delete_message`,
        defaultMessage: 'Do you want to delete match bot rule for ',
      })}
      <Link to={`/@${name}`}>{` @${name}`}</Link>?
    </span>
    <div className="modalFooter_buttons">
      <Button disabled={false} onClick={handleCloseModal}>
        {intl.formatMessage({ id: 'matchBot_btn_cancel', defaultMessage: 'Cancel' })}
      </Button>
      <div className="modalFooter__button-delete">
        <Button disabled={false} onClick={handleDeleteBot}>
          {intl.formatMessage({ id: 'matchBot_btn_delete', defaultMessage: 'Delete' })}
        </Button>
      </div>
    </div>
  </div>
);

ModalBodyDelete.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleDeleteBot: PropTypes.func.isRequired,
};

export default injectIntl(ModalBodyDelete);
