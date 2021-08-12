import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

const ModalBodyConfirm = ({ intl, name }) => (
  <span>
    {intl.formatMessage({ id: 'match_bots_edit_message' })}
    <Link to={`/@${name}`}>{` @${name}`}</Link>?
  </span>
);

ModalBodyConfirm.propTypes = {
  intl: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
};

export default injectIntl(ModalBodyConfirm);
