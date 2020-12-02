import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { getAdministrators, getWebsiteLoading } from '../../../reducers';
import {
  addWebAdministrator,
  deleteWebAdministrator,
  getWebAdministrators,
} from '../../websiteActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../../../components/Avatar';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import WeightTag from '../../../components/WeightTag';

import './Administrators.less';

export const WebsitesAdministrators = ({
  getWebAdmins,
  match,
  admins,
  intl,
  addWebAdmins,
  deleteWebAdmins,
  isLoading,
  location,
}) => {
  const [selectUser, setSelectUser] = useState('');
  const [searchString, setSearchString] = useState('');
  const host = match.params.site;

  const addAdmin = () => {
    if (admins.includes(selectUser.name)) {
      message.error('This user in admins list');
    } else {
      addWebAdmins(host, selectUser)
        .then(() => setSelectUser(null))
        .catch(() => message.error('Try again, please'));
      setSearchString('');
    }
  };

  useEffect(() => {
    getWebAdmins(host);
  }, [location.pathname]);

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
            'But sometimes it is essential that certain objects appear on the website exactly as intended by the site operators. To do this, the website owner may grant administrative privileges to some Hive users.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'admin_rules',
          defaultMessage:
            'Administrators have a deciding right to approve or reject object updates on the website. If several administrators vote on the same update, only the last vote stands.',
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
          <SelectUserForAutocomplete
            account={selectUser.name}
            resetUser={() => setSelectUser(null)}
          />
        ) : (
          <SearchUsersAutocomplete
            handleSelect={({ account, wobjects_weight: weight }) =>
              setSelectUser({
                name: account,
                wobjects_weight: weight,
              })
            }
            searchString={searchString}
            setSearchString={setSearchString}
            style={{ width: '100%' }}
          />
        )}
      </div>

      <Button
        className="WebsitesAdministrators__add-button"
        type="primary"
        onClick={addAdmin}
        disabled={!selectUser}
        loading={isLoading}
      >
        <FormattedMessage id="add" defaultMessage="Add" />
      </Button>
      <h3>
        <FormattedMessage id="website_administrators" defaultMessage="Website administrators" />:
      </h3>
      <div className="WebsitesAdministrators__user-table">
        {isEmpty(admins) ? (
          <FormattedMessage
            id={'web_admins_empty'}
            defaultMessage={"You don't have administrators."}
          />
        ) : (
          admins.map(({ name, _id: id, wobjects_weight: weight, loading }) => (
            <div key={id} className="WebsitesAdministrators__user">
              <span className="WebsitesAdministrators__user-info">
                <Avatar size={50} username={name} />
                <span>{name}</span>
                <WeightTag weight={weight} />
              </span>
              <Button type="primary" onClick={() => deleteWebAdmins(host, name)} loading={loading}>
                <FormattedMessage id="delete" defaultMessage="Delete" />
              </Button>
            </div>
          ))
        )}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
};

WebsitesAdministrators.defaultProps = {
  admins: [],
};

export default connect(
  state => ({
    admins: getAdministrators(state),
    isLoading: getWebsiteLoading(state),
  }),
  {
    getWebAdmins: getWebAdministrators,
    addWebAdmins: addWebAdministrator,
    deleteWebAdmins: deleteWebAdministrator,
  },
)(withRouter(injectIntl(WebsitesAdministrators)));
