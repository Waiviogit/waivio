import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, debounce, size, map } from 'lodash';
import { injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AutoComplete, Icon, Input } from 'antd';
import classNames from 'classnames';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchObjectTypesAutoCompete,
  searchUsersAutoCompete,
} from '../../search/searchActions';
import {
  getIsStartSearchAutoComplete,
  getAutoCompleteSearchResults,
  getSearchObjectsResults,
  getSearchUsersResults,
  searchObjectTypesResults,
} from '../../reducers';
import listOfObjectTypes from '../../../common/constants/listOfObjectTypes';
import { replacer } from '../../helpers/parser';
import { getObjectName } from '../../helpers/wObjectHelper';
import { setFiltersAndLoad } from '../../objectTypes/objectTypeActions';
import HeaderButton from '../HeaderButton/HeaderButton';
import { getTranformSearchCountData, pendingSearch } from '../../search/helpers';
import UserSearchItem from '../../search/SearchItems/UserSearchItem';
import ObjectSearchItem from '../../search/SearchItems/ObjectSearchItem';

import './Topnav.less';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    searchByObject: getSearchObjectsResults(state),
    searchByUser: getSearchUsersResults(state),
    searchByObjectType: searchObjectTypesResults(state),
    isStartSearchAutoComplete: getIsStartSearchAutoComplete(state),
  }),
  {
    searchObjectsAutoCompete,
    setActiveFilters: setFiltersAndLoad,
    searchAutoComplete,
    searchUsersAutoCompete,
    searchObjectTypesAutoCompete,
    resetSearchAutoCompete,
  },
)
class Topnav extends React.Component {
  static propTypes = {
    /* from decorators */
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    /* from connect */
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    searchAutoComplete: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    setActiveFilters: PropTypes.func.isRequired,
    /* passed props */
    searchObjectsAutoCompete: PropTypes.func.isRequired,
    searchUsersAutoCompete: PropTypes.func.isRequired,
    searchObjectTypesAutoCompete: PropTypes.func.isRequired,
    searchByObject: PropTypes.arrayOf(PropTypes.shape()),
    searchByUser: PropTypes.arrayOf(PropTypes.shape()),
    searchByObjectType: PropTypes.arrayOf(PropTypes.shape()),
    isStartSearchAutoComplete: PropTypes.bool,
  };
  static defaultProps = {
    autoCompleteSearchResults: {},
    searchByObject: [],
    searchByUser: [],
    searchByObjectType: [],
    isStartSearchAutoComplete: false,
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
      searchBarValue: '',
      searchData: '',
      currentItem: 'All',
      dropdownOpen: false,
      selectColor: false,
    };

    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.hideAutoCompleteDropdown = this.hideAutoCompleteDropdown.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.handleClearSearchData();
    }
  }

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 300);

  debouncedSearchByObject = debounce(
    (searchString, objType) => this.props.searchObjectsAutoCompete(searchString, objType),
    300,
  );

  debouncedSearchByUser = debounce(
    searchString => this.props.searchUsersAutoCompete(searchString),
    300,
  );

  debouncedSearchByObjectTypes = debounce(
    searchString => this.props.searchObjectTypesAutoCompete(searchString),
    300,
  );

  handleMobileSearchButtonClick = () => {
    const { searchBarActive } = this.state;

    this.setState(
      {
        searchBarActive: !searchBarActive,
      },
      () => {
        this.searchInputRef.input.focus();
      },
    );

    if (!searchBarActive) {
      this.setState({
        dropdownOpen: false,
      });
    }
  };

  hideAutoCompleteDropdown() {
    this.setState({ searchBarActive: false }, this.props.resetSearchAutoCompete);
  }

  handleSearchForInput(event) {
    const value = replacer(event.target.value, '@');
    const checkIsUserExist = inpValue =>
      this.props.searchByUser.some(item => item.account === inpValue);
    const waivioValue = `waivio_${value}`;
    let pathname = '';

    if (checkIsUserExist(value)) {
      pathname = `/@${value}`;
    } else if (checkIsUserExist(waivioValue)) {
      pathname = `/@${waivioValue}`;
    }

    this.props.resetSearchAutoCompete();
    this.props.history.push({
      pathname,
      state: {
        query: value,
      },
    });

    if (this.props.searchByUser.some(item => item.account === value)) {
      this.setState({
        searchBarValue: '',
        searchData: '',
        currentItem: '',
        searchBarActive: false,
        dropdownOpen: false,
      });
      this.handleClearSearchData();
    }
  }

  handleSearchAllResultsClick = () => {
    const { searchData, searchBarValue } = this.state;

    this.handleOnBlur();
    let redirectUrl = '';

    switch (searchData.type) {
      case 'wobject':
        redirectUrl = `/discover-objects/${searchData.subtype}?search=${searchBarValue}`;
        this.props.setActiveFilters({ searchString: searchBarValue });
        break;
      case 'user':
        redirectUrl = `/discover/${searchBarValue.replace('@', '')}`;
        break;
      case 'type':
      default:
        redirectUrl = `/discover-objects?search=${searchBarValue}`;
        break;
    }

    this.props.history.push(redirectUrl);
  };

  handleAutoCompleteSearch(value) {
    this.setState({ dropdownOpen: true, searchBarValue: value });
    this.handleSearch(value);
  }

  handleSearch = value => {
    const { searchBarValue } = this.state;

    this.debouncedSearch(searchBarValue);
    if (searchBarValue === value) {
      this.debouncedSearchByUser(searchBarValue);
      this.debouncedSearchByObjectTypes(searchBarValue);
    }
  };

  handleSelectOnAutoCompleteDropdown(value, data) {
    if (data.props.marker === Topnav.markers.SELECT_BAR) {
      const optionValue = value.split('#')[1];

      if (value === `${Topnav.markers.SELECT_BAR}#All`) {
        this.setState({
          searchData: '',
          dropdownOpen: true,
          currentItem: optionValue,
        });

        return;
      }
      const nextState = {
        searchData: {
          subtype: optionValue,
          type: data.props.type,
        },
        dropdownOpen: true,
        currentItem: optionValue,
      };

      if (data.props.type === 'wobject') {
        this.setState(nextState);
        this.debouncedSearchByObject(this.state.searchBarValue, optionValue);

        return;
      }

      if (data.props.type === 'user' || data.props.type === 'type') {
        this.setState(nextState);

        return;
      }
    }

    let redirectUrl = '';

    switch (data.props.marker) {
      case Topnav.markers.USER:
        redirectUrl = `/@${value.replace('user', '')}`;
        break;
      case Topnav.markers.WOBJ:
        redirectUrl = value.replace('wobj', '');
        break;
      default:
        redirectUrl = `/discover-objects/${value.replace('type', '')}`;
    }

    this.props.history.push(redirectUrl);
    this.setState({ dropdownOpen: false });
    this.hideAutoCompleteDropdown();
  }

  handleOnChangeForAutoComplete(value, data) {
    if (!value) {
      this.setState({
        searchBarValue: '',
        searchData: '',
        currentItem: '',
      });
    }

    if (value[0] === '@') {
      this.setState({
        searchBarValue: value,
        searchData: {
          subtype: 'Users',
          type: 'user',
        },
        currentItem: 'Users',
      });
    } else if (
      data.props.marker === Topnav.markers.TYPE ||
      data.props.marker === Topnav.markers.USER ||
      data.props.marker === Topnav.markers.WOBJ
    )
      this.setState({ searchBarValue: '' });
    else if (data.props.marker !== Topnav.markers.SELECT_BAR) {
      this.setState({ searchBarValue: value, searchData: '', currentItem: 'All' });
    }
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
          size(accounts),
        )}
      >
        {map(accounts, option => (
          <AutoComplete.Option
            marker={Topnav.markers.USER}
            key={`user${option.account}`}
            value={`user${option.account}`}
            className="Topnav__search-autocomplete"
          >
            <UserSearchItem user={option} />
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
          size(wobjects),
        )}
      >
        {map(wobjects, option => (
          <AutoComplete.Option
            marker={Topnav.markers.WOBJ}
            key={`wobj${getObjectName(option)}`}
            value={`wobj${option.defaultShowLink}`}
            className="Topnav__search-autocomplete"
          >
            <ObjectSearchItem wobj={option} />
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  }

  wobjectTypeSearchLayout(objectTypes) {
    return (
      <AutoComplete.OptGroup
        key="typesTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'wobjectType_search_title',
            defaultMessage: 'Types',
          }),
          size(objectTypes),
        )}
      >
        {map(objectTypes, option => (
          <AutoComplete.Option
            marker={Topnav.markers.TYPE}
            key={`type${option.name}`}
            value={`type${option.name}`}
            className="Topnav__search-autocomplete"
          >
            {option.name}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  }

  prepareOptions(searchResults) {
    const { searchData } = this.state;
    const { searchByObject, searchByUser, searchByObjectType } = this.props;
    const dataSource = [];

    if (!isEmpty(searchResults)) {
      dataSource.push(this.searchSelectBar(searchResults));
    }
    if (!searchData) {
      if (!isEmpty(searchResults.wobjects))
        dataSource.push(this.wobjectSearchLayout(searchResults.wobjects.slice(0, 5)));
      if (!isEmpty(searchResults.users))
        dataSource.push(this.usersSearchLayout(searchResults.users));
      if (!isEmpty(searchResults.objectTypes))
        dataSource.push(this.wobjectTypeSearchLayout(searchResults.objectTypes));
    } else {
      if (searchData.type === 'wobject') {
        dataSource.push(this.wobjectSearchLayout(searchByObject.slice(0, 15)));
      }
      if (searchData.type === 'user') {
        dataSource.push(this.usersSearchLayout(searchByUser.slice(0, 15)));
      }
      if (searchData.type === 'type') {
        dataSource.push(this.wobjectTypeSearchLayout(searchByObjectType));
      }
    }

    return dataSource;
  }

  searchSelectBar = searchResults => {
    const options = getTranformSearchCountData(searchResults, listOfObjectTypes);

    return (
      <AutoComplete.OptGroup key={Topnav.markers.SELECT_BAR} label=" ">
        {map(options, option => (
          <AutoComplete.Option
            marker={Topnav.markers.SELECT_BAR}
            key={`type${option.name}`}
            value={`${Topnav.markers.SELECT_BAR}#${option.name}`}
            type={option.type}
            className={this.changeItemClass(option.name)}
          >
            {`${option.name}(${option.count})`}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  };

  changeItemClass = key =>
    classNames('ant-select-dropdown-menu-item', {
      'Topnav__search-selected-active': this.state.currentItem === key,
    });

  handleOnBlur = () => {
    this.setState({
      dropdownOpen: false,
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

  handleOnFocus = () => {
    if (this.state.searchBarValue) {
      this.setState({ dropdownOpen: true });
    }
  };

  renderTitle = title => <span>{title}</span>;

  render() {
    const { intl, autoCompleteSearchResults, isStartSearchAutoComplete } = this.props;
    const { searchBarActive, dropdownOpen, searchBarValue } = this.state;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    const downBar = (
      <AutoComplete.Option disabled key="all" className="Topnav__search-all-results">
        <div
          className="search-btn"
          onClick={this.handleSearchAllResultsClick}
          role="presentation"
          title={this.state.searchBarValue.length > 60 ? this.state.searchBarValue : ''}
        >
          {intl.formatMessage(
            {
              id: 'search_all_results_for',
              defaultMessage: 'Search all results for {search}',
            },
            { search: this.state.searchBarValue },
          )}
        </div>
      </AutoComplete.Option>
    );

    const allDownBar =
      this.state.currentItem === 'All' ? dropdownOptions : dropdownOptions.concat([downBar]);

    const formattedAutoCompleteDropdown = isEmpty(dropdownOptions) ? dropdownOptions : allDownBar;

    return (
      <div className="Topnav">
        <div className="topnav-layout">
          <div className={classNames('left', { 'Topnav__mobile-hidden': searchBarActive })}>
            <Link className="Topnav__brand" to="/">
              <img src="/images/icons/waivio.svg" alt="Waivio" />
            </Link>
          </div>
          <div className={classNames('center', { mobileVisible: searchBarActive })}>
            <div className="Topnav__input-container" onBlur={this.handleOnBlur}>
              <i className="iconfont icon-search" />
              <AutoComplete
                dropdownClassName="Topnav__search-dropdown-container"
                dataSource={
                  isStartSearchAutoComplete
                    ? pendingSearch(searchBarValue, intl)
                    : formattedAutoCompleteDropdown
                }
                onSearch={this.handleAutoCompleteSearch}
                onSelect={this.handleSelectOnAutoCompleteDropdown}
                onChange={this.handleOnChangeForAutoComplete}
                defaultActiveFirstOption={false}
                dropdownMatchSelectWidth={false}
                optionLabelProp="value"
                dropdownStyle={{ color: 'red' }}
                value={this.state.searchBarValue}
                open={dropdownOpen}
                onFocus={this.handleOnFocus}
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
          <div className="right">
            <button
              className={classNames('Topnav__mobile-search', {
                'Topnav__mobile-search-close': searchBarActive,
              })}
              onClick={this.handleMobileSearchButtonClick}
            >
              <i
                className={classNames('iconfont', {
                  'icon-close': searchBarActive,
                  'icon-search': !searchBarActive,
                })}
              />
            </button>
            <HeaderButton searchBarActive={this.state.searchBarActive} />
          </div>
        </div>
      </div>
    );
  }
}

export default Topnav;
