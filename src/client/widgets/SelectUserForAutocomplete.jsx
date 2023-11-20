import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Avatar from '../components/Avatar';

const SelectUserForAutocomplete = ({ account, resetUser, isNewsFeed }) =>
  isNewsFeed ? (
    <div className="NewsFiltersRule__line-user-card">
      <div className="ObjectCard">
        <div className="ObjectCard__links">
          <Avatar username={account} size={34} isSquare />
          <span className="ObjectCard__name">{account}</span>
        </div>
      </div>
      <div className="NewsFiltersRule__line-close">
        <Icon type="close-circle" onClick={() => resetUser(account)} />
      </div>
    </div>
  ) : (
    <div className="SelectUserForAutocomplete">
      <div className="SelectUserForAutocomplete__user-info">
        <Avatar username={account} size={40} />
        <span>{account}</span>
      </div>
      {resetUser && (
        <span
          role="presentation"
          onClick={() => resetUser(account)}
          className="iconfont icon-delete"
        />
      )}
    </div>
  );

SelectUserForAutocomplete.propTypes = {
  resetUser: PropTypes.func,
  account: PropTypes.string.isRequired,
  isNewsFeed: PropTypes.bool,
};

SelectUserForAutocomplete.defaultProps = {
  resetUser: null,
  isNewsFeed: false,
};

export default SelectUserForAutocomplete;
