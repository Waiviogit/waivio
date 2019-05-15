import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { AutoComplete, Input, Modal } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import './ModalComparePerformance.less';
import InstrumentLongTermStatistics from '../../LeftSidebar/InstrumentLongTermStatistics/InstrumentLongTermStatistics';
import ObjectCard from '../../../../client/components/Sidebar/ObjectCard';
import {
  getAutoCompleteSearchResults,
  getNightmode,
  getScreenSize,
} from '../../../../client/reducers';
import { searchAutoComplete } from '../../../../client/search/searchActions';
import { getFieldWithMaxWeight } from '../../../../client/object/wObjectHelper';
import { objectFields } from '../../../../common/constants/listOfFields';
import Avatar from '../../../../client/components/Avatar';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    screenSize: getScreenSize(state),
    isNightMode: getNightmode(state),
  }),
  {
    searchAutoComplete,
  },
)
class ModalComparePerformance extends React.Component {
  static propTypes = {
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    intl: PropTypes.shape().isRequired,
    wobject: PropTypes.shape().isRequired,
    toggleModal: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    searchAutoComplete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    autoCompleteSearchResults: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      item: this.props.wobject,
      itemToCompare: {},
    };

    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.prepareOptions = this.prepareOptions.bind(this);
    this.usersSearchLayout = this.usersSearchLayout.bind(this);
    this.wobjectSearchLayout = this.wobjectSearchLayout.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (
      !_.isEmpty(nextProps.autoCompleteSearchResults) &&
      _.size(nextProps.autoCompleteSearchResults) !== _.size(this.props.autoCompleteSearchResults)
    ) {
      this.prepareOptions(nextProps.autoCompleteSearchResults);
    }
  }

  prepareOptions(searchResults) {
    const dataSource = [];
    if (!_.isEmpty(searchResults.accounts))
      dataSource.push(this.usersSearchLayout(searchResults.accounts));

    if (!_.isEmpty(searchResults.wobjects))
      dataSource.push(this.wobjectSearchLayout(searchResults.wobjects));
    return dataSource;
  }

  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
  }

  debouncedSearch = _.debounce(value => this.props.searchAutoComplete(value), 300);

  handleSelectOnAutoCompleteDropdown(value, data) {
    if (data.props.marker === 'user') this.props.history.push(`/@${value}`);
    else if (data.props.marker === 'wobj') {
      this.props.history.replace(`/object/${value}`);
    }
  }

  handleOnChangeForAutoComplete(value) {
    this.setState({ searchBarValue: value });
  }

  usersSearchLayout(accounts) {
    return (
      <AutoComplete.OptGroup
        key="usersTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'users_search_title',
            defaultMessage: 'Users',
          }),
          _.size(accounts),
        )}
      >
        {_.map(accounts, option => (
          <AutoComplete.Option
            marker={'user'}
            key={`user${option.account}`}
            value={`${option.account}`}
            className="Topnav__search-autocomplete"
          >
            <div className="Topnav__search-content-wrap">
              <Avatar username={option.account} size={40} />
              <div className="Topnav__search-content">{option.account}</div>
            </div>
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  }

  wobjectSearchLayout(wobjects) {
    return (
      <AutoComplete.OptGroup
        key="wobjectsTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'wobjects_search_title',
            defaultMessage: 'Objects',
          }),
          _.size(wobjects),
        )}
      >
        {_.map(wobjects, option => {
          const wobjName = getFieldWithMaxWeight(option, objectFields.name);
          return wobjName ? (
            <AutoComplete.Option
              marker={'wobj'}
              key={`wobj${wobjName}`}
              value={`${option.author_permlink}`}
              className="Topnav__search-autocomplete"
            >
              <ObjectCard wobject={option} showFollow={false} />
              <div className="Topnav__search-content-small">{option.object_type}</div>
            </AutoComplete.Option>
          ) : null;
        })}
      </AutoComplete.OptGroup>
    );
  }

  renderTitle = title => <span>{title}</span>;

  render() {
    const { intl, toggleModal, isModalOpen, autoCompleteSearchResults } = this.props;
    const { searchBarValue, item, itemToCompare } = this.state;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    const formattedAutoCompleteDropdown = _.isEmpty(dropdownOptions)
      ? dropdownOptions
      : dropdownOptions.concat([
          <AutoComplete.Option disabled key="all" className="Topnav__search-all-results">
            <span onClick={this.hideAutoCompleteDropdown} role="presentation">
              {intl.formatMessage(
                {
                  id: 'search_all_results_for',
                  defaultMessage: 'Search all results for {search}',
                },
                { search: searchBarValue },
              )}
            </span>
          </AutoComplete.Option>,
        ]);
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            title={intl.formatMessage({
              id: 'compare_profitability',
              defaultMessage: 'Compare profitability',
            })}
            visible={!!isModalOpen}
            footer={null}
            onCancel={toggleModal}
            width={'500px'}
          >
            <div className="ModalComparePerformance">
              <div className="ModalComparePerformance-item">
                <ObjectCard wobject={item} showFollow={false} />
                <InstrumentLongTermStatistics wobject={item} />
              </div>
              <div>vs</div>
              <div className="ModalComparePerformance-item-to-compare">
                {!itemToCompare && (
                  <div className="Topnav__input-container">
                    <AutoComplete
                      dropdownClassName="Topnav__search-dropdown-container"
                      dataSource={formattedAutoCompleteDropdown}
                      onSearch={this.handleAutoCompleteSearch}
                      onSelect={this.handleSelectOnAutoCompleteDropdown}
                      onChange={this.handleOnChangeForAutoComplete}
                      defaultActiveFirstOption={false}
                      dropdownMatchSelectWidth={false}
                      optionLabelProp="value"
                      value={searchBarValue}
                    >
                      <Input
                        ref={ref => {
                          this.searchInputRef = ref;
                        }}
                        onPressEnter={this.handleSearchForInput}
                        placeholder={intl.formatMessage({
                          id: 'search_placeholder',
                          defaultMessage: 'What are you looking for?',
                        })}
                        autoCapitalize="off"
                        autoCorrect="off"
                      />
                    </AutoComplete>
                    <i className="iconfont icon-search" />
                  </div>
                )}
                <ObjectCard wobject={item} showFollow={false} />
                <InstrumentLongTermStatistics wobject={item} />
              </div>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default ModalComparePerformance;
