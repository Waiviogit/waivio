import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import SearchUsersAutocomplete from '../../../../../components/EditorUser/SearchUsersAutocomplete';

import './ModalBodySearch.less';

const ModalBodySearch = ({ intl, botType, setInputsValue }) => {
  const handleSetSponsor = user => setInputsValue(prev => ({ ...prev, [botType]: user }));

  return (
    <div className="modalBodySearch">
      <p className="modalBodySearch_label">
        {intl.formatMessage({ id: 'match_bot_search_author' })}
      </p>
      <SearchUsersAutocomplete
        allowClear={false}
        handleSelect={handleSetSponsor}
        placeholder={intl.formatMessage({ id: 'match_bot_placeholder_find_author' })}
        style={{ width: '100%' }}
        autoFocus={false}
      />
    </div>
  );
};

ModalBodySearch.propTypes = {
  intl: PropTypes.shape().isRequired,
  botType: PropTypes.string.isRequired,
  setInputsValue: PropTypes.func.isRequired,
};

export default injectIntl(ModalBodySearch);
