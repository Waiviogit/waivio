import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getSearchObjectsResults } from '../../reducers';
import { searchObjects } from '../../search/searchActions';

function onSelect(value) {
  console.log('onSelect', value);
}

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
  };

  debouncedSearch = _.debounce(value => this.props.searchObjects(value), 300);
  handleSearch = value => this.debouncedSearch(value);

  render() {
    const { intl, style, searchObjectsResults } = this.props;
    const searchObjectsOptions = searchObjectsResults.map(obj => (
      <AutoComplete.Option key={obj.id}>{obj.tag}</AutoComplete.Option>
    ));
    return (
      <AutoComplete
        style={style}
        onSelect={onSelect}
        onSearch={this.handleSearch}
        placeholder={intl.formatMessage({
          id: 'objects_auto_complete_placeholder',
          defaultMessage: 'Input object name here',
        })}
      >
        {searchObjectsOptions}
      </AutoComplete>
    );
  }
}

export default SearchObjectsAutocomplete;
