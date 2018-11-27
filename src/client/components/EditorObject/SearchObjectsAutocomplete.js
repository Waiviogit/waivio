import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getSearchObjectsResults } from '../../reducers';
import { searchObjectsAutoCompete } from '../../search/searchActions';
import './EditorObject.less';

@injectIntl
@connect(
  state => ({
    searchObjectsResults: getSearchObjectsResults(state),
  }),
  {
    searchObjects: searchObjectsAutoCompete,
  },
)
class SearchObjectsAutocomplete extends Component {
  static defaultProps = {
    canCreateNewObject: false,
    style: { width: '100%' },
    searchObjectsResults: [],
  };

  static propTypes = {
    canCreateNewObject: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    searchObjectsResults: PropTypes.arrayOf(PropTypes.object),
    searchObjects: PropTypes.func.isRequired,
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
    const searchString = value.toLowerCase().trim();
    this.setState(
      prevState =>
        prevState.isOptionSelected
          ? { searchString: '', isOptionSelected: false }
          : { searchString },
    );
  }

  debouncedSearch = _.debounce(value => this.props.searchObjects(value), 300);
  handleSearch(value) {
    this.debouncedSearch(value);
  }

  handleSelect(objId) {
    this.setState({ isOptionSelected: true });
    const selectedObject = this.props.searchObjectsResults.find(obj => obj.id === objId);
    this.props.handleSelect(
      selectedObject || {
        authorPermlink: objId,
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
    const { canCreateNewObject, intl, style, searchObjectsResults } = this.props;
    const searchObjectsOptions = searchObjectsResults.map(obj => (
      <AutoComplete.Option key={obj.id}>{obj.name}</AutoComplete.Option>
    ));
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
        {canCreateNewObject &&
          Boolean(searchString) && (
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
