import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AutoComplete, Icon, Input, Button } from 'antd';
import classNames from 'classnames';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchObjectTypesAutoCompete,
  searchUsersAutoCompete,
} from '../../search/searchActions';
import { toggleModal } from '../../../investarena/redux/actions/modalsActions';
import { disconnectBroker } from '../../../investarena/redux/actions/brokersActions';
import {
  getAuthenticatedUser,
  getAutoCompleteSearchResults,
  getIsAuthenticated,
  getNightmode,
  getScreenSize,
  getSearchObjectsResults,
  getSearchUsersResults,
  isGuestUser,
  searchObjectTypesResults,
} from '../../reducers';
import ModalDealConfirmation from '../../../investarena/components/Modals/ModalDealConfirmation';
import Avatar from '../Avatar';
import {
  getIsLoadingPlatformState,
  getPlatformNameState,
} from '../../../investarena/redux/selectors/platformSelectors';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import ObjectAvatar from '../ObjectAvatar';
import TopNavigation from './TopNavigation';
import BrokerBalance from './BrokerBalance/BrokerBalance';
import MobileMenu from './MobileMenu/MobileMenu';
import LoggedOutMenu from './LoggedOutMenu';
import LoggedInMenu from './LoggedInMenu';
import './Topnav.less';
import { getIsBeaxyUser } from '../../user/usersHelper';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    isAuthenticated: getIsAuthenticated(state),
    searchByObject: getSearchObjectsResults(state),
    searchByUser: getSearchUsersResults(state),
    searchByObjectType: searchObjectTypesResults(state),
    screenSize: getScreenSize(state),
    isNightMode: getNightmode(state),
    platformName: getPlatformNameState(state),
    isLoadingPlatform: getIsLoadingPlatformState(state),
    isGuest: isGuestUser(state),
    authUser: getAuthenticatedUser(state),
  }),
  {
    disconnectBroker,
    searchObjectsAutoCompete,
    searchAutoComplete,
    searchUsersAutoCompete,
    searchObjectTypesAutoCompete,
    resetSearchAutoCompete,
    toggleModal,
  },
)

class Topnav extends React.Component {
  static handleScrollToTop() {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

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
    isAuthenticated: PropTypes.bool.isRequired,
    isPlatformConnected: PropTypes.bool.isRequired,
    searchAutoComplete: PropTypes.func.isRequired,
    getUserMetadata: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    platformName: PropTypes.string.isRequired,
    screenSize: PropTypes.string,
    toggleModal: PropTypes.func.isRequired,
    disconnectBroker: PropTypes.func.isRequired,
    /* passed props */
    username: PropTypes.string,
    onMenuItemClick: PropTypes.func,
    searchObjectsAutoCompete: PropTypes.func.isRequired,
    searchUsersAutoCompete: PropTypes.func.isRequired,
    searchObjectTypesAutoCompete: PropTypes.func.isRequired,
    searchByObject: PropTypes.arrayOf(PropTypes.shape()),
    searchByUser: PropTypes.arrayOf(PropTypes.shape()),
    searchByObjectType: PropTypes.arrayOf(PropTypes.shape()),
    openChat: PropTypes.func.isRequired,
    messagesCount: PropTypes.number,
    isGuest: PropTypes.bool,
    isMobileMenuOpen: PropTypes.bool.isRequired,
    toggleMobileMenu: PropTypes.func.isRequired,
    authUser: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    autoCompleteSearchResults: {},
    searchByObject: [],
    searchByUser: [],
    searchByObjectType: [],
    username: undefined,
    onMenuItemClick: () => {},
    screenSize: 'medium',
    messagesCount: 0,
    isGuest: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      burgerMenuVisible: false,
      searchBarValue: '',
      selectedPage: '',
      searchData: '',
      currentItem: 'All',
      dropdownOpen: false,
      selectColor: false,
      scrolling: false,
      visible: false,
      isMobileMenuOpen: false,
    };
  }

  componentDidMount() {
    if (window && window.screen.width < 768) {
      window.addEventListener('scroll', this.handleScroll);
      this.prevScrollpos = window.pageYOffset;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchBarValue !== this.state.searchBarValue &&
      this.state.searchBarValue !== ''
    ) {
      this.debouncedSearchByUser(this.state.searchBarValue);
      this.debouncedSearchByObjectTypes(this.state.searchBarValue);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  onMobileAvatarClick = () => {
    const { isMobileMenuOpen, toggleMobileMenu } = this.props;
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  getTranformSearchCountData = searchResults => {
    const { objectTypesCount, wobjectsCounts, usersCount } = searchResults;
    const wobjectAllCount = wobjectsCounts
      ? wobjectsCounts.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)
      : null;
    const countAllSearch = objectTypesCount + usersCount + wobjectAllCount;
    const countArr = [{ name: 'All', count: countAllSearch }];
    if (!_.isEmpty(wobjectsCounts)) {
      _.forEach(wobjectsCounts, current => {
        const obj = {};
        obj.name = current.object_type;
        obj.count = current.count;
        obj.type = 'wobject';
        countArr.push(obj);
      });
    }
    if (objectTypesCount) {
      countArr.push({ name: 'Types', count: objectTypesCount, type: 'type' });
    }
    if (usersCount) {
      countArr.push({ name: 'Users', count: usersCount, type: 'user' });
    }
    return countArr;
  };

  static markers = {
    USER: 'user',
    WOBJ: 'wobj',
    TYPE: 'type',
    SELECT_BAR: 'searchSelectBar',
  };

  handleClickMenu = e => this.setState({ selectedPage: e.key });

  handleScroll = () => {
    const currentScrollPos = window && window.pageYOffset;
    const visible = this.prevScrollpos < currentScrollPos;

    this.prevScrollpos = currentScrollPos;

    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  };

  content = () => {
    const { username } = this.props;
    return username ? (
      <LoggedInMenu {...this.state} {...this.props} />
    ) : (
      <LoggedOutMenu location={location} searchBarActive={this.state.searchBarActive} />
    );
  };

  handleMobileSearchButtonClick = () => {
    const { searchBarActive } = this.state;
    this.setState({ searchBarActive: !searchBarActive }, () => {
      this.searchInputRef.input.focus();
    });
  };

  hideAutoCompleteDropdown = () => {
    this.setState({ searchBarActive: false }, this.props.resetSearchAutoCompete);
  };

  handleSearchForInput = event => {
    const value = event.target.value;
    this.hideAutoCompleteDropdown();
    this.props.history.push({
      pathname: '/discover-objects',
      search: `search=${value}`,
      state: {
        query: value,
      },
    });
  };

  handleSearchAllResultsClick = () => {
    const { searchData, searchBarValue } = this.state;
    this.handleOnBlur();
    let redirectUrl = '';
    switch (searchData.type) {
      case 'wobject':
        redirectUrl = `/discover-objects/${searchData.subtype}?search=${searchBarValue}`;
        break;
      case 'user':
        redirectUrl = `/search?q=${searchBarValue}`;
        break;
      case 'type':
      default:
        redirectUrl = `/discover-objects?search=${searchBarValue}`;
        break;
    }
    this.props.history.push(redirectUrl);
  };

  debouncedSearch = _.debounce(value => this.props.searchAutoComplete(value, 3, 15), 300);
  debouncedSearchByObject = _.debounce((searchString, objType) =>
    this.props.searchObjectsAutoCompete(searchString, objType),
  );
  debouncedSearchByUser = _.debounce(searchString =>
    this.props.searchUsersAutoCompete(searchString),
  );
  debouncedSearchByObjectTypes = _.debounce(searchString =>
    this.props.searchObjectTypesAutoCompete(searchString),
  );

  handleAutoCompleteSearch = value => {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true });
  };

  handleSelectOnAutoCompleteDropdown = (value, data) => {
    const { isMobileMenuOpen, toggleMobileMenu } = this.props;
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
        redirectUrl = `/object/${value.replace('wobj', '')}`;
        break;
      default:
        redirectUrl = `/discover-objects/${value.replace('type', '')}`;
    }

    this.props.history.push(redirectUrl);
    this.setState({ dropdownOpen: false });
    this.hideAutoCompleteDropdown();
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  handleOnChangeForAutoComplete = (value, data) => {
    if (
      data.props.marker === Topnav.markers.TYPE ||
      data.props.marker === Topnav.markers.USER ||
      data.props.marker === Topnav.markers.WOBJ
    )
      this.setState({ searchBarValue: '' });
    else if (data.props.marker !== Topnav.markers.SELECT_BAR) {
      this.setState({ searchBarValue: value, searchData: '', currentItem: 'All' });
    }
  };

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
            marker={Topnav.markers.USER}
            key={`user${option.account}`}
            value={`user${option.account}`}
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
          const parent = option.parent;
          return wobjName ? (
            <AutoComplete.Option
              marker={Topnav.markers.WOBJ}
              key={`wobj${wobjName}`}
              value={`wobj${option.author_permlink}`}
              className="Topnav__search-autocomplete"
            >
              <div className="Topnav__search-content-wrap">
                <ObjectAvatar item={option} size={40} />
                <div>
                  <div className="Topnav__search-content">{wobjName}</div>
                  {parent && (
                    <div className="Topnav__search-content-small">
                      {getFieldWithMaxWeight(parent, objectFields.name)}
                    </div>
                  )}
                </div>
              </div>
              <div className="Topnav__search-content-small">{option.object_type}</div>
            </AutoComplete.Option>
          ) : null;
        })}
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
          _.size(objectTypes),
        )}
      >
        {_.map(objectTypes, option => (
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
    if (!_.isEmpty(searchResults)) {
      dataSource.push(this.searchSelectBar(searchResults));
    }
    if (!searchData) {
      if (!_.isEmpty(searchResults.wobjects))
        dataSource.push(this.wobjectSearchLayout(searchResults.wobjects.slice(0, 5)));
      if (!_.isEmpty(searchResults.users))
        dataSource.push(this.usersSearchLayout(searchResults.users));
      if (!_.isEmpty(searchResults.objectTypes))
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
    const options = this.getTranformSearchCountData(searchResults);
    return (
      <AutoComplete.OptGroup key={Topnav.markers.SELECT_BAR} label=" ">
        {_.map(options, option => (
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

  toggleModalBroker = () => {
    this.props.toggleModal('broker');
  };

  changeItemClass = key =>
    classNames('ant-select-dropdown-menu-item', {
      'Topnav__search-selected-active': this.state.currentItem === key,
    });

  handleOnBlur = () => {
    this.setState({
      dropdownOpen: false,
    });

    if (!this.state.searchData) {
      this.props.resetSearchAutoCompete();
    }
  };

  handleClearSearchData = () =>
    this.setState(
      {
        searchData: '',
        searchBarValue: '',
      },
      this.props.resetSearchAutoCompete,
    );

  handleOnFocus = () => this.setState({ dropdownOpen: true });

  scrollHandler = () => {
    this.setState({ scrolling: !this.state.scrolling });
  };

  renderTitle = title => <span>{title}</span>;

  render() {
    const {
      intl,
      isAuthenticated,
      autoCompleteSearchResults,
      screenSize,
      platformName,
      username,
      toggleMobileMenu,
      isMobileMenuOpen,
      authUser,
    } = this.props;
    const { searchBarActive, dropdownOpen } = this.state;
    const isMobile = screenSize === 'xsmall' || screenSize === 'small';
    const brandLogoPath = '/images/logo-brand.png';
    const brandLogoPathMobile = '/images/ia-logo-removebg.png?mobile';
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    const isBeaxyUser = getIsBeaxyUser(authUser);
    return (
      <React.Fragment>
        <div className="Topnav">
          <ModalDealConfirmation />
          <div className="topnav-layout">
            <div className={classNames('left', { 'Topnav__mobile-hidden': searchBarActive })}>
              <Link to="/" className="Topnav__brand">
                <img
                  alt="InvestArena"
                  src={brandLogoPathMobile}
                  className="Topnav__brand-icon mobile"
                />
                <img alt="InvestArena" src={brandLogoPath} className="Topnav__brand-icon" />
              </Link>
            </div>
            <div
              className={classNames(
                'center',
                'center-menu',
                { mobileVisible: searchBarActive },
                { 'center-menu--logedout': !isAuthenticated },
              )}
            >
              {!isMobile && (
                <div className="Topnav__input-container" onBlur={this.handleOnBlur}>
                  <i className="iconfont icon-search" />
                  <AutoComplete
                    dropdownClassName="Topnav__search-dropdown-container"
                    dataSource={dropdownOptions}
                    onSearch={this.handleAutoCompleteSearch}
                    onSelect={this.handleSelectOnAutoCompleteDropdown}
                    onChange={this.handleOnChangeForAutoComplete}
                    defaultActiveFirstOption={false}
                    dropdownMatchSelectWidth={false}
                    optionLabelProp="value"
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
              )}
              <div className="Topnav__horizontal-menu">
                {!isMobile && (
                  <TopNavigation
                    authenticated={isAuthenticated}
                    location={this.props.history.location}
                    isMobile={isMobile || screenSize === 'medium'}
                  />
                )}
              </div>
            </div>
            <div
              className={classNames('Topnav__right-top', {
                'Topnav__right-top--logedout': !isAuthenticated,
              })}
            >
              {!username ? (
                <div className="mr2">
                  <LoggedOutMenu location={location} searchBarActive={this.state.searchBarActive} />
                </div>
              ) : (
                <Link
                  to={`/@${username}`}
                  className="Topnav__right-top__avatar"
                  onClick={this.onMobileAvatarClick}
                >
                  <Avatar username={username} size={40} />
                </Link>
              )}
              <div className="Topnav__right-top__icon">
                {!isMobileMenuOpen ? (
                  <Icon type="menu" className="iconfont icon-menu" onClick={toggleMobileMenu} />
                ) : (
                  <Icon type="close" theme="outlined" onClick={toggleMobileMenu} />
                )}
              </div>
            </div>
            <div className="Topnav__right-bottom">
              {this.content()}
              {isAuthenticated && platformName && (
                <div
                  className={classNames('Topnav__broker', {
                    'justify-end': platformName === 'widgets',
                  })}
                >
                  {platformName === 'widgets' ? (
                    <div className="st-header-broker-balance-pl-wrap">
                      {!isBeaxyUser && (
                        <Button type="primary" onClick={this.toggleModalBroker}>
                          {intl.formatMessage({
                            id: 'headerAuthorized.connectToBeaxy',
                            defaultMessage: 'Connect to beaxy',
                          })}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <BrokerBalance />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {isMobile && isMobileMenuOpen && (
          <MobileMenu
            {...this.props}
            {...this.state}
            searchOptions={this.prepareOptions(autoCompleteSearchResults)}
            onSearch={this.handleAutoCompleteSearch}
            onSelect={this.handleSelectOnAutoCompleteDropdown}
            onChange={this.handleOnChangeForAutoComplete}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            onSearchPressEnter={this.handleSearchForInput}
            hotNews={this.hotNews}
            toggleMobileMenu={toggleMobileMenu}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Topnav;
