import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import AppendModal from './AppendModal';

const AppendButton = ({ showModal, toggleModal, locale }) => (
  <React.Fragment>
    <Button onClick={toggleModal}>
      <FormattedMessage id="append_new_proposition" defaultMessage="New proposition" />
    </Button>
    <AppendModal showModal={showModal} hideModal={toggleModal} locale={locale} />
  </React.Fragment>
);

AppendButton.propTypes = {
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  locale: PropTypes.string,
};

AppendButton.defaultProps = {
  showModal: false,
  locale: 'auto',
};

export default AppendButton;
