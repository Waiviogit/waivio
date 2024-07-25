import React, { useCallback, useState } from 'react';
import { AutoComplete } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { debounce, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getAvatarURL } from '../../components/Avatar';
import { pendingSearch } from '../../search/helpers';
import UserSearchItem from '../../search/SearchItems/UserSearchItem';
import ObjectSearchCard from '../../components/ObjectSearchCard/ObjectSearchCard';
import {
  getAutoCompleteSearchResults,
  getIsStartSearchAutoComplete,
} from '../../../store/searchStore/searchSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
} from '../../../store/searchStore/searchActions';
import { parseJSON } from '../../../common/helpers/parseJSON';

import './ItemTypeSwitcher.less';

const ItemTypeSwitcher = ({ setPrimaryObject, intl }) => {
  const [searchString, setSearchString] = useState('');
  const dispatch = useDispatch();
  const autoCompleteSearchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);
  const account = useSelector(getAuthenticatedUserName);
  const dataSource =
    isEmpty(autoCompleteSearchResults) || loading
      ? []
      : [...autoCompleteSearchResults.users, ...autoCompleteSearchResults.wobjects];

  const handleAutoCompleteSearch = useCallback(
    debounce(value => {
      let objType;
      let wobLimit = 50;
      let userLimit = 50;

      dispatch(resetSearchAutoCompete());

      if (value[0] === '#') {
        objType = ['hashtag'];
        userLimit = 0;
      }

      if (value[0] === '@') wobLimit = 0;

      return dispatch(searchAutoComplete(value, userLimit, wobLimit, null, true, objType));
    }, 400),
    [],
  );

  const handleSelect = o => {
    const profile = o?.posting_json_metadata ? parseJSON(o.posting_json_metadata)?.profile : null;
    const value = o.account
      ? {
          name: o.account,
          object_type: 'user',
          avatar: getAvatarURL(o.account, 100, account),
          description: profile?.about,
          account: o.account,
        }
      : o;

    setSearchString(null);
    setPrimaryObject(value);
    dispatch(resetSearchAutoCompete());
  };

  const getOptionName = o => o.account || o.author_permlink;

  const handleSearch = value => {
    handleAutoCompleteSearch(value);
    setSearchString(value);
  };

  return (
    <div>
      <AutoComplete
        onSearch={handleSearch}
        // onChange={handleChange}
        placeholder={intl.formatMessage({
          id: 'find_object',
          defaultMessage: 'Find object',
        })}
        autoFocus={false}
        value={searchString}
        optionLabelProp="label"
        dropdownClassName={'BaseObjSettings__resultList'}
        dataSource={
          loading
            ? pendingSearch('', intl)
            : dataSource.map(o => (
                <AutoComplete.Option
                  value={getOptionName(o)}
                  key={getOptionName(o)}
                  label={getOptionName(o)}
                  onClick={() => handleSelect(o)}
                  className={'BaseObjSettings__resulItem'}
                >
                  {o.account ? (
                    <UserSearchItem user={o} withType hideActions={() => {}} />
                  ) : (
                    <ObjectSearchCard
                      object={o}
                      name={getObjectName(o)}
                      type={o.type || o.object_type}
                    />
                  )}
                </AutoComplete.Option>
              ))
        }
      />
    </div>
  );
};

ItemTypeSwitcher.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  setPrimaryObject: PropTypes.func,
};

export default injectIntl(ItemTypeSwitcher);
