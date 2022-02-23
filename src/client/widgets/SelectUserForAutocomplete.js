import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../components/Avatar';

const SelectUserForAutocomplete = ({ account, resetUser }) => (
  <div className="SelectUserForAutocomplete">
    <div className="SelectUserForAutocomplete__user-info">
      <Avatar username={account} size={40} />
      <span>{account}</span>
    </div>
    {resetUser && (
      <span role="presentation" onClick={() => resetUser()} className="iconfont icon-delete" />
    )}
  </div>
);

SelectUserForAutocomplete.propTypes = {
  resetUser: PropTypes.func,
  account: PropTypes.string.isRequired,
};

SelectUserForAutocomplete.defaultProps = {
  resetUser: null,
};

export default SelectUserForAutocomplete;
