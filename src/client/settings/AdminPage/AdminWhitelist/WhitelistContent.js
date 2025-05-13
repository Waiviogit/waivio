import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { isEmpty, map } from 'lodash';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

import './WhitelistContent.less';
import EmptyCampaing from '../../../statics/EmptyCampaign';
import BlacklistUser from '../../../newRewards/BlackList/BlacklistUser';
import {
  addUserToAdminWhitelist,
  deleteUserFromAdminWhitelist,
} from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

const WhitelistContent = ({ intl, title, userList, caption, type, buttonTitle, setMainList }) => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const authUserName = useSelector(getAuthenticatedUserName);
  const handleAddUser = u => setUser(u);

  const handledeleteUser = () => {
    setUser({});
  };

  const handleSaveListUsers = () => {
    setLoading(true);
    addUserToAdminWhitelist(authUserName, user.account).then(res => {
      if (res.result) {
        setMainList([{ ...user, name: user.account }, ...userList]);
        setUser({});
        setLoading(false);
      }
    });
  };

  const handleDeleteListUser = u => {
    deleteUserFromAdminWhitelist(authUserName, u).then(() => {
      setMainList(userList.filter(usr => usr.name !== u));
    });
  };

  return (
    <div className={'WhitelistContent'}>
      <h4 className="WhitelistContent__title">{title}</h4>
      <SearchUsersAutocomplete
        disabled={!isEmpty(user)}
        allowClear={false}
        handleSelect={handleAddUser}
        placeholder={intl.formatMessage({
          id: 'find_users_placeholder',
          defaultMessage: 'Find user',
        })}
        style={{ width: '100%' }}
        autoFocus={false}
        itemsIdsToOmit={[user, ...userList].map(u => u.account)}
      />
      <p className="WhitelistContent__caption">{caption}</p>
      {!isEmpty(user) && (
        <div className="WhitelistContent__selectUserList">
          <SelectUserForAutocomplete
            key={user.account}
            account={user.account}
            resetUser={handledeleteUser}
          />
        </div>
      )}
      <div className="WhitelistContent__button-container">
        <Button
          disabled={isEmpty(user)}
          loading={loading}
          type="primary"
          onClick={handleSaveListUsers}
          className="WhitelistContent__button"
        >
          {buttonTitle}
        </Button>
      </div>
      <h3 className="WhitelistContent__title">{type}</h3>
      {!isEmpty(userList) ? (
        <div className="WhitelistContent__container">
          {map(userList, u => (
            <BlacklistUser key={u.account} user={u} handleDeleteUsers={handleDeleteListUser} />
          ))}
        </div>
      ) : (
        <EmptyCampaing
          emptyMessage={intl.formatMessage({
            id: 'your_list_is_empty',
            defaultMessage: 'Your list is empty',
          })}
        />
      )}
    </div>
  );
};

WhitelistContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  buttonTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf().isRequired,
  caption: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  ids: PropTypes.shape({
    remove: PropTypes.string,
    add: PropTypes.string,
  }).isRequired,
  setMainList: PropTypes.func.isRequired,
};

WhitelistContent.defaultProps = {
  buttonTitle: 'Add',
};

export default injectIntl(WhitelistContent);
