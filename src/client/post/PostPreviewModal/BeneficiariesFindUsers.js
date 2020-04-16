import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { AutoComplete, Icon, Input } from 'antd';
import { debounce, isEmpty } from 'lodash';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchUsersAutoCompete,
} from '../../search/searchActions';
import { getUserMetadata } from '../../user/usersActions';
import { getAutoCompleteSearchResults } from '../../reducers';
// import Avatar from '../../components/Avatar';
// import WeightTag from '../../components/WeightTag';

@injectIntl
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
  }),
  {
    searchObjectsAutoCompete,
    searchAutoComplete,
    getUserMetadata,
    searchUsersAutoCompete,
    resetSearchAutoCompete,
  },
)
class BeneficiariesFindUsers extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    /* from connect */
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    searchAutoComplete: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    searchUsersAutoCompete: PropTypes.func.isRequired,
  };
  static defaultProps = {
    autoCompleteSearchResults: {},
    username: undefined,
  };

  static markers = {
    USER: 'user',
    WOBJ: 'wobj',
    TYPE: 'type',
    SELECT_BAR: 'searchSelectBar',
  };

  static handleScrollToTop() {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverVisible: false,
      searchBarValue: '',
      notificationsPopoverVisible: false,
      searchData: '',
      currentItem: 'All',
      dropdownOpen: false,
      selectColor: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchBarValue !== this.state.searchBarValue &&
      this.state.searchBarValue !== ''
    ) {
      this.debouncedSearchByUser(this.state.searchBarValue);
    }
  }

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 300);

  debouncedSearchByUser = debounce(searchString => this.props.searchUsersAutoCompete(searchString));

  renderTitle = title => <span>{title}</span>;

  // usersSearchLayout = accounts => {
  //   return (
  //     <AutoComplete.OptGroup
  //       key="usersTitle"
  //       label={this.renderTitle(
  //         this.props.intl.formatMessage({
  //           id: 'users_search_title',
  //           defaultMessage: 'Users',
  //         }),
  //         size(accounts),
  //       )}
  //     >
  //       {map(
  //         accounts,
  //         option =>
  //           option && (
  //             <AutoComplete.Option
  //               marker={BeneficiariesFindUsers.markers.USER}
  //               key={`user${option.account}`}
  //               value={`user${option.account}`}
  //               className="beneficiariesFindUsers__search-autocomplete"
  //             >
  //               <div className="beneficiariesFindUsers__search-content-wrap">
  //                 <Avatar username={option.account} size={40} />
  //                 <div className="beneficiariesFindUsers__search-content">{option.account}</div>
  //                 <span className="beneficiariesFindUsers__search-expertize">
  //                   <WeightTag weight={option.wobjects_weight} />
  //                   &middot;
  //                   <span className="beneficiariesFindUsers__search-follow-counter">
  //                     {option.followers_count}
  //                   </span>
  //                 </span>
  //               </div>
  //               <div className="beneficiariesFindUsers__search-content-small">
  //                 {option.youFollows && !option.followsYou && (
  //                   <FormattedMessage id="following_user" defaultMessage="following" />
  //                 )}
  //                 {!option.youFollows && option.followsYou && (
  //                   <FormattedMessage id="follows you" defaultMessage="follows you" />
  //                 )}
  //                 {option.youFollows && option.followsYou && (
  //                   <FormattedMessage id="mutual_follow" defaultMessage="mutual following" />
  //                 )}
  //               </div>
  //             </AutoComplete.Option>
  //           ),
  //       )}
  //     </AutoComplete.OptGroup>
  //   );
  // };

  prepareOptions = searchResults => {
    console.log('searchResults', searchResults);
    // const { searchData } = this.state;
    const dataSource = [];

    if (!isEmpty(searchResults.users)) dataSource.push(this.usersSearchLayout(searchResults.users));

    return dataSource;
  };

  handleAutoCompleteSearch = value => {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true });
  };

  handleSelectOnAutoCompleteDropdown = (value, data) => {
    if (data.props.marker === BeneficiariesFindUsers.markers.SELECT_BAR) {
      const optionValue = value.split('#')[1];

      const nextState = {
        searchData: {
          subtype: optionValue,
          type: data.props.type,
        },
        dropdownOpen: true,
        currentItem: optionValue,
      };

      if (data.props.type === 'user' || data.props.type === 'type') {
        this.setState(nextState);
        return;
      }
    }

    this.setState({ dropdownOpen: false });
    this.hideAutoCompleteDropdown();
  };

  handleOnChangeForAutoComplete = value => {
    if (!value) {
      this.setState({
        searchBarValue: '',
        searchData: '',
        currentItem: '',
      });
    }
    this.setState({
      searchBarValue: value,
      searchData: {
        subtype: 'Users',
        type: 'user',
      },
      currentItem: 'Users',
    });
  };

  handleClearSearchData = () =>
    this.setState(
      {
        searchData: '',
        searchBarValue: '',
      },
      this.props.resetSearchAutoCompete,
    );

  handleSearchForInput = event => {
    const value = event.target.value;
    console.log(value);
    this.props.resetSearchAutoCompete();
    this.setState({
      searchBarValue: '',
      searchData: '',
      currentItem: '',
      searchBarActive: false,
      dropdownOpen: false,
    });
    this.handleClearSearchData();
  };

  render() {
    const { intl, autoCompleteSearchResults } = this.props;
    // const { dropdownOpen } = this.state;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    // const getOptions = accounts => {
    //   if (autoCompleteSearchResults.users) {
    //     map(autoCompleteSearchResults.users, user => {
    //       return (
    //         <AutoComplete.OptGroup
    //           key="usersTitle"
    //           label={this.renderTitle(
    //             this.props.intl.formatMessage({
    //               id: 'users_search_title',
    //               defaultMessage: 'Users',
    //             }),
    //             size(accounts),
    //           )}
    //         >
    //           {map(
    //             accounts,
    //             option =>
    //               option && (
    //                 <AutoComplete.Option
    //                   marker={BeneficiariesFindUsers.markers.USER}
    //                   key={`user${option.account}`}
    //                   value={`user${option.account}`}
    //                   className="beneficiariesFindUsers__search-autocomplete"
    //                 >
    //                   <div className="beneficiariesFindUsers__search-content-wrap">
    //                     <Avatar username={option.account} size={40} />
    //                     <div className="beneficiariesFindUsers__search-content">
    //                       {option.account}
    //                     </div>
    //                     <span className="beneficiariesFindUsers__search-expertize">
    //                       <WeightTag weight={option.wobjects_weight} />
    //                       &middot;
    //                       <span className="beneficiariesFindUsers__search-follow-counter">
    //                         {option.followers_count}
    //                       </span>
    //                     </span>
    //                   </div>
    //                 </AutoComplete.Option>
    //               ),
    //           )}
    //         </AutoComplete.OptGroup>
    //       );
    //     });
    //   }
    // };

    console.log('dropdownOptions', dropdownOptions);
    return (
      <div className="beneficiariesFindUsers">
        <div className="beneficiariesFindUsers-layout">
          <div className="beneficiariesFindUsers__input-container" onBlur={this.handleOnBlur}>
            <i className="iconfont icon-search" />
            <AutoComplete
              dropdownClassName="beneficiariesFindUsers__search-dropdown-container"
              // dataSource={formattedAutoCompleteDropdown}
              dataSource={dropdownOptions}
              onSearch={this.handleAutoCompleteSearch}
              onSelect={this.handleSelectOnAutoCompleteDropdown}
              onChange={this.handleOnChangeForAutoComplete}
              defaultActiveFirstOption={false}
              dropdownMatchSelectWidth={false}
              optionLabelProp="value"
              dropdownStyle={{ color: 'red' }}
              value={this.state.searchBarValue}
              open={this.state.dropdownOpen}
              onFocus={this.handleOnFocus}
            >
              <Input
                onPressEnter={this.handleSearchForInput}
                placeholder={intl.formatMessage({
                  id: 'find_users_placeholder',
                  defaultMessage: 'Find users',
                })}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </AutoComplete>
            {!!this.state.searchBarValue.length && (
              <Icon
                type="close-circle"
                style={{ fontSize: '12px' }}
                theme="filled"
                onClick={this.handleClearSearchData}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default BeneficiariesFindUsers;
