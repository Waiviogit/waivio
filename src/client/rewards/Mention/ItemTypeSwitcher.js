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

const ItemTypeSwitcher = ({ setPrimaryObject, intl, obj }) => {
  const [searchString, setSearchString] = useState('');
  const dispatch = useDispatch();
  const autoCompleteSearchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);
  const account = useSelector(getAuthenticatedUserName);
  const dataSource =
    isEmpty(autoCompleteSearchResults) || loading
      ? []
      : [...autoCompleteSearchResults.users, ...autoCompleteSearchResults.wobjects].filter(
          item => item.object_type !== 'hashtag',
        );
  const handleAutoCompleteSearch = useCallback(
    debounce(
      value =>
        dispatch(
          searchAutoComplete(value, 3, 50, null, true, [
            'business',
            'book',
            'product',
            'restaurant',
          ]),
        ),
      300,
    ),
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

    setSearchString('');
    setPrimaryObject(value);
    dispatch(resetSearchAutoCompete());
  };

  const getOptionName = op => op.account || getObjectName(op);
  const handleSearch = value => {
    handleAutoCompleteSearch(value);
  };
  const handleChange = value => {
    setSearchString(value);
  };

  return (
    <div>
      {isEmpty(obj) && (
        <AutoComplete
          onSearch={handleSearch}
          onChange={handleChange}
          placeholder={intl.formatMessage({
            id: 'find_object',
            defaultMessage: 'Find object',
          })}
          allowClear={false}
          autoFocus={false}
          value={searchString}
          optionLabelProp="value"
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
      )}
    </div>
  );
};

ItemTypeSwitcher.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  obj: PropTypes.shape({}),
  setPrimaryObject: PropTypes.func,
};

export default injectIntl(ItemTypeSwitcher);
