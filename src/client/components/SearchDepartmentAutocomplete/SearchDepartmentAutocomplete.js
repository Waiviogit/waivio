import React, { useState, useCallback } from 'react';
import { AutoComplete } from 'antd';
import { injectIntl } from 'react-intl';
import { debounce, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { searchDepartments } from '../../../waivioApi/ApiClient';
import DepartmentSearchCard from './DepartmentSearchCard';
import { pendingSearch } from '../../search/helpers';
import { objectFields } from '../../../common/constants/listOfFields';

const depLimit = 15;

const SearchDepartmentAutocomplete = ({
  allowClear,
  autoFocus,
  disabled,
  intl,
  setFieldsValue,
}) => {
  const [searchString, setSearchString] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (value = '') => {
    setSearchString(value);
    setFieldsValue({ [objectFields.departments]: value });
  };
  const handleSelect = val => {
    setSearchString(val);
    if (!isEmpty(searchString) && !isEmpty(val))
      setFieldsValue({ [objectFields.departments]: val });
  };
  const debouncedSearch = useCallback(
    debounce(
      searchStr =>
        searchDepartments(searchStr, depLimit, 0).then(r => {
          setDepartments(r.result);
          setLoading(false);
        }),
      300,
    ),
    [],
  );

  const handleSearch = value => {
    if (!isEmpty(value)) {
      setLoading(true);
      debouncedSearch(value);
    }
  };

  const renderSearchObjectsOptions = string => {
    let searchObjectsOptions = [];

    if (string) {
      searchObjectsOptions = departments.map(dep => (
        <AutoComplete.Option
          key={dep.id}
          label={dep.name}
          value={dep.name}
          className="obj-search-option item"
        >
          <DepartmentSearchCard name={dep.name} />
        </AutoComplete.Option>
      ));

      return searchObjectsOptions;
    }

    return searchObjectsOptions;
  };

  return (
    <AutoComplete
      className="SearchDepartmentAutocomplete"
      onChange={handleChange}
      onSelect={handleSelect}
      onSearch={handleSearch}
      optionLabelProp={'label'}
      dataSource={
        loading ? pendingSearch(searchString, intl) : renderSearchObjectsOptions(searchString)
      }
      placeholder={intl.formatMessage({
        id: 'department',
        defaultMessage: 'Department',
      })}
      value={searchString}
      allowClear={allowClear}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
};

SearchDepartmentAutocomplete.propTypes = {
  allowClear: PropTypes.bool,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  intl: PropTypes.bool.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
};
SearchDepartmentAutocomplete.defaultPropTypes = {
  allowClear: true,
  autoFocus: true,
  disabled: false,
};
export default injectIntl(SearchDepartmentAutocomplete);
