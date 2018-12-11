import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { clearSearchObjectsResults, searchObjectsAutoCompete } from '../../search/searchActions';
import { getSearchObjectsResults } from '../../reducers';
import './EditorObject.less';

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
    canCreateNewObject: false,
    style: { width: '100%' },
    searchObjectsResults: [],
    linkedObjectsIds: [],
  };

  static propTypes = {
    canCreateNewObject: PropTypes.bool,
    linkedObjectsIds: PropTypes.arrayOf(PropTypes.string),
    intl: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    searchObjectsResults: PropTypes.arrayOf(PropTypes.object),
    searchObjects: PropTypes.func.isRequired,
    clearSearchResults: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      isOptionSelected: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(value = '') {
    if (!value) this.props.clearSearchResults();
    const searchString = value.toLowerCase().trim();
    this.setState(prevState =>
      prevState.isOptionSelected ? { searchString: '', isOptionSelected: false } : { searchString },
    );
  }

  debouncedSearch = _.debounce(value => this.props.searchObjects(value), 300);
  handleSearch(value) {
    if (value) {
      this.debouncedSearch(value);
    }
  }

  handleSelect(objId) {
    this.setState({ isOptionSelected: true });
    this.props.clearSearchResults();
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
    );
  }
  render() {
    const { searchString } = this.state;
    const { canCreateNewObject, intl, style, searchObjectsResults, linkedObjectsIds } = this.props;
    const searchObjectsOptions = searchString
      ? searchObjectsResults
          .filter(obj => !linkedObjectsIds.includes(obj.id))
          .map(obj => <AutoComplete.Option key={obj.id}>{obj.name}</AutoComplete.Option>)
      : [];
    return (
      <AutoComplete
        style={style}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        placeholder={intl.formatMessage({
          id: 'objects_auto_complete_placeholder',
          defaultMessage: 'Input object name here',
        })}
        value={searchString}
        allowClear
      >
        {canCreateNewObject && Boolean(searchString) && (
          <AutoComplete.Option
            key={`${searchString}-${Math.random()
              .toString(36)
              .substring(2)}`}
          >
            <div className="wobj-search-option">
              <span className="wobj-search-option__caption">{searchString}</span>
              <span className="wobj-search-option__label">create new</span>
            </div>
          </AutoComplete.Option>
        )}
        {searchObjectsOptions}
      </AutoComplete>
    );
  }
}

export default SearchObjectsAutocomplete;
