import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const AppendButton = ({ toggleModal }) => (
  <React.Fragment>
    <Button onClick={toggleModal}>
      <FormattedMessage id="append_new_proposition" defaultMessage="New proposition" />
    </Button>
  </React.Fragment>
);

AppendButton.propTypes = {
  toggleModal: PropTypes.func.isRequired,
};

AppendButton.defaultProps = {
  showModal: false,
};

export default AppendButton;
