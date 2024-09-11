import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import SelectUserForAutocomplete from '../../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../../components/EditorUser/SearchUsersAutocomplete';

const AddUserForm = props => (
  <div className="NewsFiltersRule__line">
    <div className="AppendForm__appendTitles">
      {props.intl.formatMessage({
        id: 'add_a_user',
        defaultMessage: 'Add a user',
      })}
    </div>
    {!isEmpty(props.selectedUsers) && (
      <div className="NewsFiltersRule__card-wrap">
        {props.selectedUsers.map(userName => (
          <>
            <div>
              <SelectUserForAutocomplete
                isNewsFeed
                account={userName}
                resetUser={() => props.deleteUser(userName)}
              />
            </div>
          </>
        ))}
      </div>
    )}
    <div className="NewsFiltersRule__line-search">
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
    <p>Choose users whose followers should be in the group.</p>
  </div>
);

AddUserForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  selectedUsers: PropTypes.arrayOf().isRequired,
  handleSelectUsersBlog: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};
export default injectIntl(AddUserForm);
