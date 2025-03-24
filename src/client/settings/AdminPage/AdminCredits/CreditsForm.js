import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';

const CreditsForm = ({ setCreditsUser, setShowCredits, intl }) => (
  <>
    <p>
      <h4 className={'WhitelistContent__title'}>Give credits to user:</h4>
      <SearchUsersAutocomplete
        // disabled={!isEmpty(user)}
        allowClear={false}
        handleSelect={u => {
          setCreditsUser(u.account);
          setShowCredits(true);
        }}
        placeholder={intl.formatMessage({
          id: 'find_users_placeholder',
          defaultMessage: 'Find user',
        })}
        style={{ width: '100%' }}
      />
    </p>
    <br />
  </>
);

CreditsForm.propTypes = {
  setCreditsUser: PropTypes.func.isRequired,
  setShowCredits: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(CreditsForm);
