import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { getModerators, getWebsiteLoading } from '../../../reducers';
import { addWebsiteModerators, deleteWebModerators, getWebModerators } from '../../websiteActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../../../components/Avatar';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import WeightTag from '../../../components/WeightTag';

import './WebsiteModerators.less';

export const WebsiteModerators = ({
  getWebMods,
  match,
  moderators,
  intl,
  addWebModerators,
  delWebModerators,
  isLoading,
}) => {
  const [selectUser, setSelectUser] = useState(null);
  const host = match.params.site;

  const addModerator = () => {
    addWebModerators(host, selectUser)
      .then(() => setSelectUser(null))
      .catch(() => message.error('Try again, please'));
  };

  useEffect(() => {
    getWebMods(host);
  }, []);

  return (
    <div className="WebsiteModerators">
      <h1>
        <FormattedMessage id="website_moderators" defaultMessage="Website moderators" />
      </h1>
      <p>
        {intl.formatMessage({
          id: 'some_content_blockchain_rules',
          defaultMessage:
            'Some of the content on the Hive blockchain may violate local laws or company policies and it is essential that such content does not appear on the website.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'website_owner_moderators',
          defaultMessage: 'The website owner may grant moderator privileges to some Hive users.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'moderator_rules',
          defaultMessage:
            "If a moderator flags a post or comment, that content will not appear on the website. If a moderator mutes a user, none of that user's content will be displayed on the website.",
        })}
      </p>
      <h3>
        <FormattedMessage
          id="grant_moderator_privileges"
          defaultMessage="Grant moderator privileges:"
        />
      </h3>
      <div className="WebsiteModerators__search-user">
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
            style={{ width: '100%' }}
          />
        )}
      </div>
      <Button
        className="WebsiteModerators__add-button"
        type="primary"
        onClick={addModerator}
        disabled={!selectUser}
        loading={isLoading}
      >
        <FormattedMessage id="add" defaultMessage="Add" />
      </Button>
      <h3>
        <FormattedMessage id="website_administrators" defaultMessage="Website administrators" />:
      </h3>
      <div className="WebsiteModerators__user-table">
        {isEmpty(moderators) ? (
          <FormattedMessage id={'web_mods_empty'} defaultMessage={"You don't have moderators."} />
        ) : (
          moderators.map(({ name, _id: id, wobjects_weight: weight, loading }) => (
            <div key={id} className="WebsitesAdministrators__user">
              <span className="WebsitesAdministrators__user-info">
                <Avatar size={50} username={name} />
                <span>{name}</span>
                <WeightTag weight={weight} />
              </span>
              <Button type="primary" onClick={() => delWebModerators(host, name)} loading={loading}>
                <FormattedMessage id="delete" defaultMessage="Delete" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

WebsiteModerators.propTypes = {
  getWebMods: PropTypes.func.isRequired,
  addWebModerators: PropTypes.func.isRequired,
  delWebModerators: PropTypes.func.isRequired,
  moderators: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.string.isRequired,
};

WebsiteModerators.defaultProps = {
  moderators: [],
};

export default connect(
  state => ({
    moderators: getModerators(state),
    isLoading: getWebsiteLoading(state),
  }),
  {
    getWebMods: getWebModerators,
    addWebModerators: addWebsiteModerators,
    delWebModerators: deleteWebModerators,
  },
)(injectIntl(WebsiteModerators));
