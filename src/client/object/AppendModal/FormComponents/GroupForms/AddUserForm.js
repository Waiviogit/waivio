import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import SearchUsersAutocomplete from '../../../../components/EditorUser/SearchUsersAutocomplete';
import './GroupForms.less';
import Avatar from '../../../../components/Avatar';

const AddUserForm = props => {
  const account = props.selectedUsers[0];

  return (
    <div className="NewsFiltersRule__line">
      <div className="AppendForm__appendTitles NewsFiltersRule-title">
        {props.intl.formatMessage({
          id: `${props.isAdd ? 'add_a_user' : 'exclude_a_user'}`,
          defaultMessage: `${props.isAdd ? 'Add a user' : 'Exclude a user'}`,
        })}
      </div>
      {!isEmpty(props.selectedUsers) && (
        <div className="SelectUserForAutocomplete">
          <div className="SelectUserForAutocomplete__user-info">
            <Avatar username={account} size={40} />
            <span>{account}</span>
          </div>
          <span
            role="presentation"
            onClick={() => props.deleteUser(account)}
            className="iconfont icon-delete"
          />
        </div>
      )}
      <div className="NewsFiltersRule__line-search mt1">
        {props.selectedUsers.length < 1 && (
          <SearchUsersAutocomplete
            placeholder={props.intl.formatMessage({
              id: 'find_a_user',
              defaultMessage: 'Find a user',
            })}
            handleSelect={props.handleSelectUsersBlog}
          />
        )}
      </div>
      <p>
        {props.isAdd
          ? 'Add a specific user to the group.'
          : 'Exclude a specific user from the group.'}
      </p>
    </div>
  );
};

AddUserForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  selectedUsers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleSelectUsersBlog: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  isAdd: PropTypes.bool.isRequired,
};
export default injectIntl(AddUserForm);
