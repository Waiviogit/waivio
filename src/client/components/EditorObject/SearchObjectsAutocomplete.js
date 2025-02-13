import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { AutoComplete } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  clearSearchObjectsResults,
  resetToInitialIsClearSearchObj,
  searchObjectsAutoCompete,
} from '../../../store/searchStore/searchActions';
import { linkRegex } from '../../../common/helpers/regexHelpers';
import ObjectSearchCard from '../ObjectSearchCard/ObjectSearchCard';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { pendingSearch } from '../../search/helpers';
import {
  getIsStartSearchObject,
  getSearchObjectsResults,
} from '../../../store/searchStore/searchSelectors';

import './SearchObjectsAutocomplete.less';

const SearchObjectsAutocomplete = props => {
  const [searchString, setSearchString] = useState('');
  const dispatch = useDispatch();
  const searchObjectsResults = useSelector(getSearchObjectsResults);
  const isSearchObject = useSelector(getIsStartSearchObject);
  const abortController = useRef(null);

  const handleChange = (value = '') => {
    setSearchString(value.toLowerCase());
  };

  const debouncedSearch = useCallback(
    debounce((searchStr, objType = '', parent) => {
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();
      dispatch(
        searchObjectsAutoCompete(
          searchStr,
          objType,
          parent,
          props.addHashtag,
          props.useExtendedSearch,
          props.onlyObjectTypes,
          abortController.current,
        ),
      );
    }, 300),
    [dispatch, props.addHashtag, props.useExtendedSearch, props.onlyObjectTypes],
  );

  const handleSearch = value => {
    let val = value;
    const parentPermlink = props.parentPermlink ? props.parentPermlink : null;
    const link = val.match(linkRegex);

    const wordsToRemove = ['list', 'page', 'newsfeed', 'widget', 'webpage', 'map', 'shop', 'group'];

    if (link && link.length > 0 && link[0] !== '') {
      let permlink = link[0];

      wordsToRemove.forEach(word => {
        const regex = new RegExp(`/${word}(/|$)`, 'g');

        permlink = permlink.replace(regex, '/');
      });

      permlink = permlink.replace(/([^:]\/)(\/+)/g, '$1');

      val = permlink;
    }

    if (val) {
      debouncedSearch(val, props.objectType, parentPermlink);
    }
  };

  const handleSelect = objId => {
    const selectedObject = searchObjectsResults.find(obj => obj.author_permlink === objId);

    props.handleSelect(
      selectedObject || {
        author_permlink: objId,
        fields: [
          {
            name: 'name',
            body: searchString,
          },
        ],
        isNew: true,
      },
      props.rowIndex,
      props.ruleIndex,
    );
    dispatch(clearSearchObjectsResults());
    setTimeout(() => dispatch(resetToInitialIsClearSearchObj()), 300);
    setSearchString('');
  };

  const renderSearchObjectsOptions = searchStr => {
    const { itemsIdsToOmit } = props;
    let searchObjectsOptions = [];

    if (searchStr) {
      searchObjectsOptions = searchObjectsResults
        .filter(obj => !itemsIdsToOmit.includes(obj.author_permlink))
        .map(obj => (
          <AutoComplete.Option
            key={obj.author_permlink}
            label={obj.author_permlink}
            value={obj.author_permlink}
            className="obj-search-option item"
            disabled={props.addedItemsPermlinks?.includes(obj.author_permlink)}
          >
            <ObjectSearchCard
              isInList={props.addedItemsPermlinks?.includes(obj.author_permlink)}
              object={obj}
              name={getObjectName(obj)}
              type={obj.type || obj.object_type}
            />
          </AutoComplete.Option>
        ));

      return searchObjectsOptions;
    }

    return searchObjectsOptions;
  };

  return (
    <AutoComplete
      style={props.style}
      className={props.className}
      dropdownClassName={props.dropdownClassName}
      onChange={handleChange}
      onSelect={handleSelect}
      onSearch={handleSearch}
      optionLabelProp={'label'}
      dataSource={
        isSearchObject
          ? pendingSearch(searchString, props.intl)
          : renderSearchObjectsOptions(searchString, props.intl)
      }
      placeholder={
        !props.placeholder
          ? props.intl.formatMessage({
              id: 'objects_auto_complete_placeholder',
              defaultMessage: 'Find an object',
            })
          : props.placeholder
      }
      value={searchString}
      allowClear={props.allowClear}
      autoFocus={props.autoFocus}
      disabled={props.disabled}
    />
  );
};

SearchObjectsAutocomplete.defaultProps = {
  intl: {},
  style: { width: '100%' },
  className: '',
  dropdownClassName: '',
  searchObjectsResults: [],
  addedItemsPermlinks: [],
  itemsIdsToOmit: [],
  objectType: '',
  searchObjects: () => {},
  clearSearchResults: () => {},
  handleSelect: () => {},
  allowClear: true,
  rowIndex: 0,
  ruleIndex: 0,
  disabled: false,
  useExtendedSearch: false,
  placeholder: '',
  parentPermlink: '',
  autoFocus: true,
  isSearchObject: false,
  addHashtag: false,
  parentObject: {},
};

SearchObjectsAutocomplete.propTypes = {
  itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
  onlyObjectTypes: PropTypes.arrayOf(PropTypes.string),
  addedItemsPermlinks: PropTypes.arrayOf(PropTypes.string),
  objectType: PropTypes.string,
  className: PropTypes.string,
  allowClear: PropTypes.bool,
  intl: PropTypes.shape(),
  handleSelect: PropTypes.func,
  rowIndex: PropTypes.number,
  ruleIndex: PropTypes.number,
  disabled: PropTypes.bool,
  useExtendedSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  parentPermlink: PropTypes.string,
  dropdownClassName: PropTypes.string,
  autoFocus: PropTypes.bool,
  style: PropTypes.shape({}),
  addHashtag: PropTypes.bool,
};

export default injectIntl(SearchObjectsAutocomplete);
