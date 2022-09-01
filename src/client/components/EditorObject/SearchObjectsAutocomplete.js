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
    placeholder: '',
    parentPermlink: '',
    autoFocus: true,
    isSearchObject: false,
    addItem: false,
    addHashtag: false,
    parentObject: {},
  };

  static propTypes = {
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
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
    placeholder: PropTypes.string,
    parentPermlink: PropTypes.string,
    dropdownClassName: PropTypes.string,
    autoFocus: PropTypes.bool,
    style: PropTypes.shape({}),
    isSearchObject: PropTypes.bool,
    resetIsClearSearchFlag: PropTypes.func,
    parentObject: PropTypes.shape(),
    addItem: PropTypes.bool,
    addHashtag: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(value = '') {
    this.setState({ searchString: value.toLowerCase() });
  }

  debouncedSearch = debounce(
    (searchString, objType = '', parent) =>
      this.props.searchObjects(searchString, objType, parent, this.props.addHashtag),
    300,
  );

  handleSearch(value) {
    let val = value;
    const parentPermlink = this.props.parentPermlink ? this.props.parentPermlink : null;
    const link = val.match(linkRegex);

    if (link && link.length > 0 && link[0] !== '') {
      const permlink = link[0].split('/');

      val = permlink[permlink.length - 1].replace('@', '');
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

  renderSearchObjectsOptions = (searchString, intl) => {
    const { addItem, searchObjectsResults, itemsIdsToOmit } = this.props;
    let searchObjectsOptions = [];

    if (
      searchString &&
      addItem &&
      searchObjectsResults.map(item => this.searchObjectListed(item.author_permlink)).includes(true)
    ) {
      searchObjectsOptions = (
        <AutoComplete.Option disabled key="all">
          <div className="pending-status">
            {intl.formatMessage({
              id: 'object_listed',
              defaultMessage: 'This object is already listed',
            })}
          </div>
        </AutoComplete.Option>
      );

      return [searchObjectsOptions];
    } else if (searchString) {
      searchObjectsOptions = searchObjectsResults
        .filter(obj => !itemsIdsToOmit.includes(obj.author_permlink))
        .map(obj => (
          <AutoComplete.Option
            key={obj.author_permlink}
            label={obj.author_permlink}
            value={obj.author_permlink}
            className="obj-search-option item"
          >
            <ObjectSearchCard
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
        placeholder={this.props.placeholder}
        value={searchString}
        allowClear={allowClear}
        autoFocus={autoFocus}
        disabled={disabled}
      />
    );
  }
}

export default SearchObjectsAutocomplete;
