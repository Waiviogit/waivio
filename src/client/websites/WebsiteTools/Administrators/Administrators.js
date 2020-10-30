import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, message} from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAdministrators } from '../../../reducers';
import {addWebAdministrator, deleteWebAdministrator, getWebAdministrators} from '../../websiteActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../../../components/Avatar';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

import './Administrators.less';

export const WebsitesAdministrators = ({ getWebAdmins, match, admins, intl, addWebAdmins, deleteWebAdmins }) => {
  const [selectUser, setSelectUser] = useState('');
  const host = match.params.site;
  const mockAdmins = [
    { name: 'lucykolosova', _id: 1233434 },
    { name: 'lucykolosova', _id: 12330434 },
  ];

  const addAdmin = () => {
    addWebAdmins(host, [selectUser])
      .then(() => setSelectUser(''))
      .catch(() => message.error('Try again, please'))
  }


  useEffect(() => {
    getWebAdmins(host);
  }, []);

  return (
    <div className="WebsitesAdministrators">
      <h1>
        <FormattedMessage id="website_administrators" defaultMessage="Website administrators" />
      </h1>
      <p>
        {intl.formatMessage({
          id: 'hive_public_blockchain',
          defaultMessage:
            'Hive is a public blockchain and any user can post updates to any object. The Hive community then approves or rejects these updates.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'certain_objects_appear',
          defaultMessage:
            'But sometimes it is essential that certain objects appear on the website exactly as intended by the site operators. To do this, the website owner may grant administrative privileges to',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'admin_rules',
          defaultMessage: 'Administrators have a deciding right to approve or reject object updates on the website. If several administrators vote on the same update, only the last vote stands.',
        })}
      </p>
      <h3>
        <FormattedMessage
          id="grant_administrative_privileges"
          defaultMessage="Grant administrative privileges:"
        />
      </h3>
      <div className="WebsitesAdministrators__search-user">
        {selectUser ? (
          <SelectUserForAutocomplete account={selectUser} resetUser={() => setSelectUser('')} />
        ) : (
          <SearchUsersAutocomplete
            handleSelect={({ account }) => setSelectUser(account)}
            style={{ width: '100%' }}
          />
        )}
      </div>

      <Button className="WebsitesAdministrators__add-button" type="primary" onClick={addAdmin} disabled={!selectUser}>
        <FormattedMessage id="add" defaultMessage="Add" />
      </Button>
      <h3>
        <FormattedMessage id="website_administrators" defaultMessage="Website administrators" />:
      </h3>
      <div className="WebsitesAdministrators__user-table">
        {mockAdmins.map(admin => (
          <div key={admin._id} className="WebsitesAdministrators__user">
            <span className="WebsitesAdministrators__user-info">
              <Avatar size={50} username={admin.name} />
              <span>{admin.name}</span>
            </span>
            <Button type="primary" onClick={() => deleteWebAdmins(host, admin.name)}>
              <FormattedMessage id="delete" defaultMessage="Delete" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

WebsitesAdministrators.propTypes = {
  getWebAdmins: PropTypes.func.isRequired,
  addWebAdmins: PropTypes.func.isRequired,
  deleteWebAdmins: PropTypes.func.isRequired,
  admins: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

WebsitesAdministrators.defaultProps = {
  admins: [],
};

export default connect(
  state => ({
    admins: getAdministrators(state),
  }),
  {
    getWebAdmins: getWebAdministrators,
    addWebAdmins: addWebAdministrator,
    deleteWebAdmins: deleteWebAdministrator,
  },
)(injectIntl(WebsitesAdministrators));
