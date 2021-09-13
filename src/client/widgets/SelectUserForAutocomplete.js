import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Avatar from '../components/Avatar';
import { getBlacklist } from '../../waivioApi/ApiClient';
import { getNightmode } from '../../store/settingsStore/settingsSelectors';

const SelectUserForAutocomplete = ({ account, resetUser, nightmode }) => {
  const SelectUserForAutocompleteClassList = classNames('SelectUserForAutocomplete', {
    'SelectUserForAutocomplete__theme-dark': nightmode,
  });

  return (
    <div className={SelectUserForAutocompleteClassList}>
      <div className="SelectUserForAutocomplete__user-info">
        <Avatar username={account} size={40} />
        <span>{account}</span>
      </div>
      <span
        role="presentation"
        onClick={() => resetUser(account)}
        className="iconfont icon-delete"
      />
    </div>
  );
};

SelectUserForAutocomplete.propTypes = {
  resetUser: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  nightmode: PropTypes.bool.isRequired,
};

export default connect(state => ({
  nightmode: getNightmode(state),
}))(injectIntl(SelectUserForAutocomplete));
