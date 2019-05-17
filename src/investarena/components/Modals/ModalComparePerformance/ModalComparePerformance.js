import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { AutoComplete, Icon, Input, Modal } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import './ModalComparePerformance.less';
import InstrumentLongTermStatistics from '../../LeftSidebar/LongTermStatistics/InstrumentLongTermStatistics';
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
import UserLongTermStatistics from '../../LeftSidebar/LongTermStatistics/UserLongTermStatistics';
import UserCard from '../../../../client/components/UserCard';

@injectIntl
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
    item: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]).isRequired,
    toggleModal: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    isItemUser: PropTypes.bool.isRequired,
    searchAutoComplete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    autoCompleteSearchResults: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      itemToCompare: {},
      isItemToCompareUser: false,
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
    if (data.props.marker === 'user') {
      this.setState({ itemToCompare: value, isItemToCompareUser: true });
    } else if (data.props.marker === 'wobj') {
      const itemToCompare = _.find(this.props.autoCompleteSearchResults.wobjects, {
        author_permlink: value,
      });
      this.setState({ itemToCompare, isItemToCompareUser: false });
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
            lable={option.account}

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
              lable={wobjName}
              className="Topnav__search-autocomplete"
            >
              <ObjectCard wobject={option} showFollow={false} withLinks={false} />
              <div className="Topnav__search-content-small">{option.object_type}</div>
            </AutoComplete.Option>
          ) : null;
        })}
      </AutoComplete.OptGroup>
    );
  }

  removeItemToCompare = () => this.setState({ itemToCompare: {} });

  toggleModal = () => {
    this.props.toggleModal();
  };

  renderTitle = title => <span>{title}</span>;

  render() {
    const { intl, isModalOpen, autoCompleteSearchResults, isItemUser } = this.props;
    const { searchBarValue, itemToCompare, isItemToCompareUser } = this.state;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    return (
      <Modal
        title={intl.formatMessage({
          id: 'compare_profitability',
          defaultMessage: 'Compare profitability',
        })}
        visible={!!isModalOpen}
        footer={null}
        onCancel={this.toggleModal}
        // width={'90vw'}
      >
        <div className="ModalComparePerformance">
          {isItemUser ? <div className="ModalComparePerformance-item">
              <UserCard user={{ name: this.state.item }} showFollow={false} />
              <UserLongTermStatistics userName={this.state.item} />
          </div> :
            <div className="ModalComparePerformance-item">
            <ObjectCard wobject={this.state.item} showFollow={false} />
            <InstrumentLongTermStatistics wobject={this.state.item} />
          </div>}
          <div>vs</div>
          <div className="ModalComparePerformance__item-to-compare">
            {_.isEmpty(itemToCompare) ? (
              <div className="">
                <AutoComplete
                  dropdownClassName=""
                  dataSource={dropdownOptions}
                  onSearch={this.handleAutoCompleteSearch}
                  onSelect={this.handleSelectOnAutoCompleteDropdown}
                  onChange={this.handleOnChangeForAutoComplete}
                  defaultActiveFirstOption={false}
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="lable"
                  value={searchBarValue}
                >
                  <Input
                    ref={ref => {
                      this.searchInputRef = ref;
                    }}
                    onPressEnter={this.handleSearchForInput}
                    placeholder={intl.formatMessage({
                      id: 'findComparedItem',
                      defaultMessage: 'Item to compare',
                    })}
                  />
                </AutoComplete>
              </div>
            ) : isItemToCompareUser ? (
              <React.Fragment>
                <div className="ModalComparePerformance__item-to-compare-wrap">
                  <UserCard user={{ name: itemToCompare }} showFollow={false} />
                  <Icon type="close-circle" onClick={this.removeItemToCompare} />
                </div>
                <UserLongTermStatistics userName={itemToCompare} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="ModalComparePerformance__item-to-compare-wrap">
                  <ObjectCard wobject={itemToCompare} showFollow={false} />
                  <Icon type="close-circle" onClick={this.removeItemToCompare} />
                </div>
                <InstrumentLongTermStatistics wobject={itemToCompare} />
              </React.Fragment>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalComparePerformance;
