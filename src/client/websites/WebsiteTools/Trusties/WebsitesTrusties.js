import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { Button, message } from 'antd';
import { withRouter } from 'react-router';
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
        <FormattedMessage id="website_trusties" defaultMessage="Website trusties" />
      </h1>
      <p>
        The site owner can designate certain users as Trusties, granting them special administrative
        privileges over specific objects. These users act as trusted collaborators, responsible for
        the appearance and quality of the content they co-author.
      </p>
      <p>
        Trusties have the ability to approve updates for objects where they have claimed authority.
        Their decisions are treated with the same weight as those of the owner.
      </p>
      <p>
        In addition, the Trusties system supports a network of trust: when a user is added as a
        Trustie, all users from their personal trust list are also included. This allows for a
        scalable delegation of responsibility while maintaining oversight and quality.
      </p>
      <p>
        This mechanism enables collaborative object management while ensuring that updates come from
        a trusted and vetted group.
      </p>
      <h3>
        <FormattedMessage id="add_trusties" defaultMessage="Add trusties:" />
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
        <FormattedMessage id="website_trusties" defaultMessage="Website trusties" />:
      </h3>
      <div className={authoritiesClassList}>
        {emptyTrusties ? (
          <FormattedMessage id={'web_trusties_empty'} defaultMessage={'No trusties added.'} />
        ) : (
          trusties.map(({ name, _id: id, wobjects_weight: weight, loading }) => (
            <div key={id} className="WebsitesAuthorities__user">
              <span className="WebsitesAuthorities__user-info">
                <Avatar size={50} username={name} />
                <span>{name}</span>
                <WeightTag weight={weight} />
              </span>
              <Button
                type="primary"
                onClick={() => deleteWebsiteTrusties(host, name)}
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
