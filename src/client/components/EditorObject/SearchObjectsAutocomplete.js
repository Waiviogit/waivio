import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { clearSearchObjectsResults, searchObjectsAutoCompete } from '../../search/searchActions';
import { getSearchObjectsResults } from '../../reducers';
import { linkRegex } from '../../helpers/regexHelpers';
import './SearchObjectsAutocomplete.less';
import ObjectSearchCard from '../ObjectSearchCard/ObjectSearchCard';

@injectIntl
@connect(
  state => ({
    searchObjectsResults: getSearchObjectsResults(state),
  }),
  {
    searchObjects: searchObjectsAutoCompete,
    clearSearchResults: clearSearchObjectsResults,
  },
)
class SearchObjectsAutocomplete extends Component {
  static defaultProps = {
    intl: {},
    style: { width: '100%' },
    className: '',
    searchObjectsResults: [],
    itemsIdsToOmit: [],
    objectType: '',
    searchObjects: () => {},
    clearSearchResults: () => {},
    handleSelect: () => {},
    allowClear: true,
    rowIndex: 0,
    ruleIndex: 0,
    disabled: false,
    placeholder: '',
    parentPermlink: '',
    autoFocus: true,
  };

  static propTypes = {
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    objectType: PropTypes.string,
    className: PropTypes.string,
    allowClear: PropTypes.bool,
    intl: PropTypes.shape(),
    style: PropTypes.shape(),
    searchObjectsResults: PropTypes.arrayOf(PropTypes.object),
    searchObjects: PropTypes.func,
    clearSearchResults: PropTypes.func,
    handleSelect: PropTypes.func,
    rowIndex: PropTypes.number,
    ruleIndex: PropTypes.number,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    parentPermlink: PropTypes.string,
    autoFocus: PropTypes.bool,
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

  debouncedSearch = _.debounce(
    (searchString, objType = '', parent) => this.props.searchObjects(searchString, objType, parent),
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
    const selectedObject = this.props.searchObjectsResults.find(obj => obj.id === objId);
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
    this.setState({ searchString: '' });
  }
  render() {
    const { searchString } = this.state;
    const {
      intl,
      style,
      searchObjectsResults,
      itemsIdsToOmit,
      allowClear,
      disabled,
      autoFocus,
    } = this.props;
    const searchObjectsOptions = searchString
      ? searchObjectsResults
          .filter(obj => !itemsIdsToOmit.includes(obj.id))
          .map(obj => (
            <AutoComplete.Option key={obj.id} label={obj.id} className="obj-search-option item">
              <ObjectSearchCard object={obj} name={obj.name} type={obj.type} />
            </AutoComplete.Option>
          ))
      : [];
    return (
      <AutoComplete
        style={style}
        className={this.props.className}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        optionLabelProp={'label'}
        placeholder={
          !this.props.placeholder
            ? intl.formatMessage({
                id: 'objects_auto_complete_placeholder',
                defaultMessage: 'Find topics',
              })
            : this.props.placeholder
        }
        value={searchString}
        allowClear={allowClear}
        autoFocus={autoFocus}
        disabled={disabled}
      >
        {searchObjectsOptions}
      </AutoComplete>
    );
  }
}

export default SearchObjectsAutocomplete;
