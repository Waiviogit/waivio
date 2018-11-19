import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getSearchObjectsResults } from '../../reducers';
import { searchObjects } from '../../search/searchActions';

@injectIntl
@connect(
  state => ({
    searchObjectsResults: getSearchObjectsResults(state),
  }),
  {
    searchObjects,
  },
)
class SearchObjectsAutocomplete extends Component {
  static defaultProps = {
    style: { width: '100%' },
    searchObjectsResults: [],
  };

  static propTypes = {
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

  handleChange(searchString) {
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
    this.props.handleSelect(selectedObject);
  }
  render() {
    const { searchString } = this.state;
    const { intl, style, searchObjectsResults } = this.props;
    const searchObjectsOptions = searchObjectsResults.map(obj => (
      <AutoComplete.Option key={obj.id}>{obj.tag}</AutoComplete.Option>
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
        {searchObjectsOptions}
      </AutoComplete>
    );
  }
}

export default SearchObjectsAutocomplete;
