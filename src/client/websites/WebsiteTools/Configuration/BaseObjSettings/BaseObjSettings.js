import React, { useCallback, useState } from 'react';
import { debounce, isEmpty } from 'lodash';
import { AutoComplete, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { searchAutoComplete } from '../../../../../store/searchStore/searchActions';
import { getObjectName } from '../../../../../common/helpers/wObjectHelper';
import Avatar from '../../../../components/Avatar';
import ObjectAvatar from '../../../../components/ObjectAvatar';
import UserSearchItem from '../../../../search/SearchItems/UserSearchItem';
import ObjectSearchCard from '../../../../components/ObjectSearchCard/ObjectSearchCard';
import {
  getAutoCompleteSearchResults,
  getIsStartSearchAutoComplete,
} from '../../../../../store/searchStore/searchSelectors';
import { pendingSearch } from '../../../../search/helpers';

import './BaseObjSettings.less';

const BaseObjSettings = ({ handleSubmit, intl }) => {
  const dispatch = useDispatch();
  const autoCompleteSearchResults = useSelector(getAutoCompleteSearchResults);
  const loading = useSelector(getIsStartSearchAutoComplete);
  const [selectedObj, setSelectedObj] = useState(null);
  const dataSource = isEmpty(autoCompleteSearchResults)
    ? []
    : [...autoCompleteSearchResults.users, ...autoCompleteSearchResults.wobjects];
  const handleAutoCompleteSearch = useCallback(
    debounce(value => dispatch(searchAutoComplete(value, 3, 15, null, true)), 300),
    [],
  );

  const resetMainObj = () => {
    setSelectedObj(null);
    handleSubmit(null);
  };

  const getOptionName = op => op.account || getObjectName(op);

  return selectedObj ? (
    <div className="BaseObjSettings__searchCard">
      <div className="BaseObjSettings__content">
        {selectedObj.account ? (
          <Avatar username={selectedObj.account} size={40} />
        ) : (
          <ObjectAvatar item={selectedObj} size={40} />
        )}
        <span className="BaseObjSettings__name">{getOptionName(selectedObj)}</span>
      </div>
      <b className="BaseObjSettings__type">{selectedObj.account ? 'user' : 'object'}</b>
      <span className="BaseObjSettings__clear" onClick={resetMainObj}>
        <Icon type="close-circle" />
      </span>
    </div>
  ) : (
    <AutoComplete
      onSearch={handleAutoCompleteSearch}
      dataSource={
        loading
          ? pendingSearch('', intl)
          : dataSource.map(o => (
              <AutoComplete.Option
                value={getOptionName(o)}
                key={getOptionName(o)}
                label={getOptionName(o)}
                onClick={() => {
                  setSelectedObj(o);
                  handleSubmit(o);
                }}
              >
                {o.account ? (
                  <UserSearchItem user={o} />
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
  );
};

BaseObjSettings.propTypes = {
  intl: PropTypes.shape({}),
  handleSubmit: PropTypes.string,
};

export default injectIntl(BaseObjSettings);
