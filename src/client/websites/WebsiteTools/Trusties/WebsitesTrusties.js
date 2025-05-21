import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { Button, message } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Avatar from '../../../components/Avatar';
import WeightTag from '../../../components/WeightTag';

import { getTrusties, getWebsiteLoading } from '../../../../store/websiteStore/websiteSelectors';
import {
  addWebTrusties,
  deleteWebTrusties,
  getWebTrusties,
} from '../../../../store/websiteStore/websiteActions';

const WebsitesTrusties = ({
  getWebsiteTrusties,
  match,
  trusties,
  addWebsiteTrusties,
  deleteWebsiteTrusties,
  isLoading,
  location,
}) => {
  const [selectUser, setSelectUser] = useState('');
  const [searchString, setSearchString] = useState('');
  const host = match.params.site;
  const emptyTrusties = isEmpty(trusties);
  const authoritiesClassList = classNames('WebsitesAuthorities__user-table', {
    'WebsitesAuthorities__table-empty': emptyTrusties,
  });

  const addAdmin = () => {
    if (trusties.includes(selectUser.name)) {
      message.error('This user in admins list');
    } else {
      addWebsiteTrusties(host, selectUser);
      setSearchString('');
    }
  };

  useEffect(() => {
    getWebsiteTrusties(host);
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading) {
      setSelectUser(null);
    }
  }, [isLoading]);

  return (
    <div className="WebsitesAuthorities">
      <h1>
        <FormattedMessage id="website_trusted_accounts" defaultMessage="Website trusted accounts" />
      </h1>
      <p>
        The site owner can add certain users as Trusted accounts, granting them special
        administrative privileges over specific objects. These users act as trusted collaborators,
        responsible for the appearance and quality of the content they co-author.
      </p>
      <p>
        Trusted accounts have the ability to approve updates to objects over which they have claimed
        authority. Their decisions are treated with the same weight as those of the site’s owner or
        administrators.
      </p>
      <p>
        In addition, the Trusted accounts system supports a network of trust: when a user is added
        as a Trusted account, all users from their personal trusted accounts list are also included.
        This allows for scalable delegation of responsibility while maintaining oversight and
        quality.
      </p>

      <h3>
        <FormattedMessage id="add_trusted_accounts" defaultMessage="Add trusted accounts" />:
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
        <FormattedMessage id="website_trusted_accounts" defaultMessage="Website trusted accounts" />
        :
      </h3>
      <div className={authoritiesClassList}>
        {emptyTrusties ? (
          <FormattedMessage
            id={'web_trusties_empty'}
            defaultMessage={'No trusted accounts added.'}
          />
        ) : (
          trusties.map(t => (
            <div key={t._id} className="WebsitesAuthorities__user">
              <span className="WebsitesAuthorities__user-info">
                <Avatar size={50} username={t.name} />{' '}
                <Link className="WebsitesAuthorities__username" to={`/@${t.name}`}>
                  {t.name}
                </Link>
                <WeightTag weight={t.wobjects_weight} />
              </span>
              {t.guideName ? (
                <span className={'WebsitesAuthorities__grey-text'}>@{`${t.guideName}`}</span>
              ) : (
                <Button
                  type="primary"
                  onClick={() =>
                    deleteWebsiteTrusties(
                      host,
                      trusties
                        .filter(tr => tr.name === t.name || tr.guideName === t.name)
                        .map(i => i.name),
                    )
                  }
                  loading={t.loading}
                >
                  <FormattedMessage id="delete" defaultMessage="Delete" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

WebsitesTrusties.propTypes = {
  getWebsiteTrusties: PropTypes.func.isRequired,
  addWebsiteTrusties: PropTypes.func.isRequired,
  deleteWebsiteTrusties: PropTypes.func.isRequired,
  trusties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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

WebsitesTrusties.defaultProps = {
  authorities: [],
};

export default connect(
  state => ({
    trusties: getTrusties(state),
    isLoading: getWebsiteLoading(state),
  }),
  {
    getWebsiteTrusties: getWebTrusties,
    addWebsiteTrusties: addWebTrusties,
    deleteWebsiteTrusties: deleteWebTrusties,
  },
)(withRouter(injectIntl(WebsitesTrusties)));
