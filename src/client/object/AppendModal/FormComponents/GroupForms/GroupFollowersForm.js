import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import SelectUserForAutocomplete from '../../../../widgets/SelectUserForAutocomplete';
import { andLayout } from '../../../../../common/helpers/AppendFormHelper';
import SearchUsersAutocomplete from '../../../../components/EditorUser/SearchUsersAutocomplete';

const GroupFollowersForm = props => (
  <div className="NewsFiltersRule__line">
    <div className="AppendForm__appendTitles">
      {props.intl.formatMessage({
        id: props.title,
        defaultMessage: props.title,
      })}
    </div>
    {!isEmpty(props.selectedUsers) && (
      <div className="NewsFiltersRule__card-wrap">
        {props.selectedUsers.map((userName, index) => (
          <>
            {andLayout(index)}
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
      <SearchUsersAutocomplete handleSelect={props.handleSelectUsersBlog} />
    </div>
    <p>Choose users whose followers should be in the group.</p>
  </div>
);

GroupFollowersForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  selectedUsers: PropTypes.arrayOf().isRequired,
  handleSelectUsersBlog: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
export default injectIntl(GroupFollowersForm);
