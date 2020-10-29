import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAdministrators } from '../../../reducers';
import { getWebAdministrators } from '../../websiteActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../../../components/Avatar';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

import './Administrators.less';

export const WebsitesAdministrators = ({ getWebAdmins, match, admins, intl }) => {
  const [selectUser, setSelectUser] = useState('');
  const host = match.params.site;
  const mockAdmins = [
    { name: 'lucykolosova', _id: 1233434 },
    { name: 'lucykolosova', _id: 12330434 },
  ];

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
        But sometimes it is essential that certain objects appear on the website exactly as intended
        by the site operators. To do this, the website owner may grant administrative privileges to
        some Hive users.
      </p>
      <p>
        Administrators have a deciding right to approve or reject object updates on the website. If
        several administrators vote on the same update, only the last vote stands.
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

      <Button className="WebsitesAdministrators__add-button" type="primary">
        Add
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
            <Button type="primary">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

WebsitesAdministrators.propTypes = {
  getWebAdmins: PropTypes.func.isRequired,
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
  },
)(Form.create()(injectIntl(WebsitesAdministrators)));
