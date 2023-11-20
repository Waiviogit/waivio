import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import ReviewItem from '../../../../Create-Edit/ReviewItem';
import SearchUsersAutocomplete from '../../../../../components/EditorUser/SearchUsersAutocomplete';

import './ModalBodySearch.less';

const ModalBodySearch = ({ intl, setInputsValue, selectedUser, isSubmitted, botType }) => {
  const handleSetSponsor = user =>
    setInputsValue(prev => ({ ...prev, selectedUser: user, isSubmitted: false }));
  const handleRemoveSelectedUser = () => setInputsValue(prev => ({ ...prev, selectedUser: null }));
  const isError = isSubmitted && !selectedUser;

  return (
    <div className="modalBodySearch">
      <p className="modalBodySearch_label">
        {intl.formatMessage({ id: `match_bot_search_${botType}` })}
      </p>
      <SearchUsersAutocomplete
        autoFocus={false}
        allowClear={false}
        style={{ width: '100%' }}
        handleSelect={handleSetSponsor}
        className={classNames({ 'has-error': isError })}
        placeholder={intl.formatMessage({ id: `match_bot_placeholder_find_${botType}` })}
      />
      {isError && (
        <p className="modalBodySearch-error">
          {intl.formatMessage({ id: `matchBot_${botType}_btn_add` })}
        </p>
      )}
      {selectedUser && (
        <ReviewItem
          isUser
          object={selectedUser}
          key={selectedUser.account}
          removeReviewObject={handleRemoveSelectedUser}
        />
      )}
    </div>
  );
};

ModalBodySearch.propTypes = {
  intl: PropTypes.shape().isRequired,
  botType: PropTypes.string.isRequired,
  selectedUser: PropTypes.shape(),
  isSubmitted: PropTypes.bool,
  setInputsValue: PropTypes.func.isRequired,
};

ModalBodySearch.defaultProps = {
  isSubmitted: false,
  selectedUser: null,
};

export default injectIntl(ModalBodySearch);
