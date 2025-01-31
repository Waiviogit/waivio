import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce, get } from 'lodash';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux';
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

@injectIntl
@connect(
  state => ({
    searchObjectsResults: getSearchObjectsResults(state),
    isSearchObject: getIsStartSearchObject(state),
  }),
  {
    searchObjects: searchObjectsAutoCompete,
    clearSearchResults: clearSearchObjectsResults,
    resetIsClearSearchFlag: resetToInitialIsClearSearchObj,
  },
)
class SearchObjectsAutocomplete extends Component {
  static defaultProps = {
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
    resetIsClearSearchFlag: () => {},
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

  static propTypes = {
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    onlyObjectTypes: PropTypes.arrayOf(PropTypes.string),
    addedItemsPermlinks: PropTypes.arrayOf(PropTypes.string),
    objectType: PropTypes.string,
    className: PropTypes.string,
    allowClear: PropTypes.bool,
    intl: PropTypes.shape(),
    searchObjectsResults: PropTypes.arrayOf(PropTypes.shape()),
    searchObjects: PropTypes.func,
    clearSearchResults: PropTypes.func,
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
    isSearchObject: PropTypes.bool,
    resetIsClearSearchFlag: PropTypes.func,
    parentObject: PropTypes.shape(),
    addHashtag: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };
    this.abortController = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(value = '') {
    this.setState({ searchString: value.toLowerCase() });
  }

  debouncedSearch = debounce((searchString, objType = '', parent) => {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    this.props.searchObjects(
      searchString,
      objType,
      parent,
      this.props.addHashtag,
      this.props.useExtendedSearch,
      this.props.onlyObjectTypes,
      this.abortController,
    );
  }, 300);

  handleSearch(value) {
    let val = value;
    const parentPermlink = this.props.parentPermlink ? this.props.parentPermlink : null;
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
      this.debouncedSearch(val, this.props.objectType, parentPermlink);
    }
  }

  handleSelect(objId) {
    const selectedObject = this.props.searchObjectsResults.find(
      obj => obj.author_permlink === objId,
    );

    this.props.handleSelect(
      selectedObject || {
        author_permlink: objId,
        fields: [
          {
            name: 'name',
            body: this.state.searchString,
          },
        ],
        isNew: true,
      },
      this.props.rowIndex,
      this.props.ruleIndex,
    );
    this.props.clearSearchResults();
    setTimeout(() => this.props.resetIsClearSearchFlag(), 300);
    this.setState({ searchString: '' });
  }

  renderSearchObjectsOptions = searchString => {
    const { searchObjectsResults, itemsIdsToOmit } = this.props;
    let searchObjectsOptions = [];

    if (searchString) {
      searchObjectsOptions = searchObjectsResults
        .filter(obj => !itemsIdsToOmit.includes(obj.author_permlink))
        .map(obj => (
          <AutoComplete.Option
            key={obj.author_permlink}
            label={obj.author_permlink}
            value={obj.author_permlink}
            className="obj-search-option item"
            disabled={this.props.addedItemsPermlinks?.includes(obj.author_permlink)}
          >
            <ObjectSearchCard
              isInList={this.props.addedItemsPermlinks?.includes(obj.author_permlink)}
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

  getListItemAuthorPermlink = item => get(item, 'author_permlink', '');

  searchObjectListed = searchObjectPermlink => {
    const parentListItems = get(this.props.parentObject, 'listItems', []);

    return (
      parentListItems.some(item => this.getListItemAuthorPermlink(item) === searchObjectPermlink) &&
      (parentListItems.some(
        item => getObjectName(item).toLowerCase() === this.state.searchString,
      ) ||
        parentListItems.some(item =>
          this.state.searchString.includes(this.getListItemAuthorPermlink(item)),
        ))
    );
  };

  render() {
    const { searchString } = this.state;
    const { intl, style, allowClear, disabled, autoFocus, isSearchObject } = this.props;

    return (
      <AutoComplete
        style={style}
        className={this.props.className}
        dropdownClassName={this.props.dropdownClassName}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        optionLabelProp={'label'}
        dataSource={
          isSearchObject
            ? pendingSearch(searchString, intl)
            : this.renderSearchObjectsOptions(searchString, intl)
        }
        placeholder={
          !this.props.placeholder
            ? intl.formatMessage({
                id: 'objects_auto_complete_placeholder',
                defaultMessage: 'Find an object',
              })
            : this.props.placeholder
        }
        value={searchString}
        allowClear={allowClear}
        autoFocus={autoFocus}
        disabled={disabled}
      />
    );
  }
}

export default SearchObjectsAutocomplete;
