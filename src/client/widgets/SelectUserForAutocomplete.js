import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../components/Avatar';

const SelectUserForAutocomplete = ({ account, resetUser }) => (
  <div className="SelectUserForAutocomplete">
    <div className="SelectUserForAutocomplete__user-info">
      <Avatar username={account} size={40} />
      <span>{account}</span>
    </div>
    <span role="presentation" onClick={() => resetUser(account)} className="iconfont icon-delete" />
  </div>
);

SelectUserForAutocomplete.propTypes = {
  resetUser: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
};

export default SelectUserForAutocomplete;
