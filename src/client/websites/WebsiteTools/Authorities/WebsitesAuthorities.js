import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { getAuthorities, getWebsiteLoading } from '../../../reducers';
import { addWebAuthorities, deleteWebAuthorities, getWebAuthorities } from '../../websiteActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../../../components/Avatar';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import WeightTag from '../../../components/WeightTag';

import './WebsitesAuthorities.less';

export const WebsitesAuthorities = ({
  getWebAuthority,
  match,
  authorities,
  intl,
  addWebsiteAuthorities,
  deleteWebsiteAuthorities,
  isLoading,
  location,
}) => {
  const [selectUser, setSelectUser] = useState('');
  const [searchString, setSearchString] = useState('');
  const host = match.params.site;

  const addAdmin = () => {
    if (authorities.includes(selectUser.name)) {
      message.error('This user in admins list');
    } else {
      addWebsiteAuthorities(host, selectUser);
      setSearchString('');
    }
  };

  useEffect(() => {
    getWebAuthority(host);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading) {
      setSelectUser(null);
    }
  }, [isLoading]);

  return (
    <div className="WebsitesAuthorities">
      <h1>
        <FormattedMessage id="website_authorities" defaultMessage="Website authorities" />
      </h1>
      <p>
        {intl.formatMessage({
          id: 'hive_public_blockchain_authority',
          defaultMessage:
            'Any Hive user can declare that they are responsible for the accuracy of an object by claiming authority over it. They exercise their authority by approving or rejecting object updates. If full ownership authority has been claimed, then user assumes that only approved updates will be processed.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'specify_which_authorities',
          defaultMessage:
            'The website owner can specify which authorities to trust (claims of other users will be ignored).',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'author_rules',
          defaultMessage:
            'This mechanism can be used to add controlled lists of objects to the website, while ensuring their accuracy.',
        })}
      </p>
      <h3>
        <FormattedMessage id="add_authority" defaultMessage="Add authorities:" />
      </h3>
      <div className="WebsitesAuthorities__search-user">
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
        className="WebsitesAuthorities__add-button"
        type="primary"
        onClick={addAdmin}
        disabled={!selectUser}
        loading={isLoading}
      >
        <FormattedMessage id="add" defaultMessage="Add" />
      </Button>
      <h3>
        <FormattedMessage id="trust_authorities" defaultMessage="Trusted authorities" />:
      </h3>
      <div className="WebsitesAuthorities__user-table">
        {isEmpty(authorities) ? (
          <FormattedMessage id={'web_authorities_empty'} defaultMessage={'No authorities added.'} />
        ) : (
          authorities.map(({ name, _id: id, wobjects_weight: weight, loading }) => (
            <div key={id} className="WebsitesAuthorities__user">
              <span className="WebsitesAuthorities__user-info">
                <Avatar size={50} username={name} />
                <span>{name}</span>
                <WeightTag weight={weight} />
              </span>
              <Button
                type="primary"
                onClick={() => deleteWebsiteAuthorities(host, name)}
                loading={loading}
              >
                <FormattedMessage id="delete" defaultMessage="Delete" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

WebsitesAuthorities.propTypes = {
  getWebAuthority: PropTypes.func.isRequired,
  addWebsiteAuthorities: PropTypes.func.isRequired,
  deleteWebsiteAuthorities: PropTypes.func.isRequired,
  authorities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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

WebsitesAuthorities.defaultProps = {
  authorities: [],
};

export default connect(
  state => ({
    authorities: getAuthorities(state),
    isLoading: getWebsiteLoading(state),
  }),
  {
    getWebAuthority: getWebAuthorities,
    addWebsiteAuthorities: addWebAuthorities,
    deleteWebsiteAuthorities: deleteWebAuthorities,
  },
)(withRouter(injectIntl(WebsitesAuthorities)));
