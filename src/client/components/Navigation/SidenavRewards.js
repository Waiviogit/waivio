import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAutoCompleteSearchResults, getIsAuthenticated, getTotalPayable } from '../../reducers';
import './Sidenav.less';
import SteemConnect from '../../steemConnectAPI';

@injectIntl
@connect(state => ({
  autoCompleteSearchResults: getAutoCompleteSearchResults(state),
  authenticated: getIsAuthenticated(state),
  totalPayable: getTotalPayable(state),
}))
export default class SidenavRewards extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    totalPayable: PropTypes.number.isRequired,
  };

  static defaultProps = {
    autoCompleteSearchResults: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverVisible: false,
      searchBarValue: '',
      isModalRewardUserOpen: false,
      currentTab: 'active',
      menuCondition: {
        rewards: true,
        campaigns: true,
      },
    };
  }

  toggleMenuCondition = menuItem => {
    const { menuCondition } = this.state;
    this.setState({
      menuCondition: {
        ...menuCondition,
        [menuItem]: !menuCondition[menuItem],
      },
    });
  };

  render() {
    const { intl, authenticated, location, totalPayable } = this.props;
    const { menuCondition } = this.state;
    const next = location.pathname.length > 1 ? location.pathname : '';
    console.log(totalPayable);
    return (
      <React.Fragment>
        <ul className="Sidenav">
          <div className="Sidenav__title-wrap">
            <div className="Sidenav__title-item">
              {intl.formatMessage({
                id: 'rewards',
                defaultMessage: `rewards`,
              })}
              :
            </div>
            <div
              className="Sidenav__title-icon"
              onClick={() => this.toggleMenuCondition('rewards')}
              role="presentation"
            >
              {!menuCondition.rewards ? (
                <i className="iconfont icon-addition" />
              ) : (
                <i className="iconfont icon-offline" />
              )}
            </div>
          </div>
          {menuCondition.rewards && (
            <React.Fragment>
              <li>
                <NavLink to={'/rewards/all'} activeClassName="Sidenav__item--active">
                  {intl.formatMessage({
                    id: 'all',
                    defaultMessage: `All`,
                  })}
                </NavLink>
              </li>
            </React.Fragment>
          )}
          {authenticated ? (
            <React.Fragment>
              {menuCondition.rewards && (
                <React.Fragment>
                  <li>
                    <NavLink to={`/rewards/active`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'eligible',
                        defaultMessage: `Eligible`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/rewards/reserved`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'reserved',
                        defaultMessage: `Reserves`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/rewards/receivables`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'sidenav_rewards_receivables',
                        defaultMessage: `Receivables`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/rewards/history`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'history',
                        defaultMessage: `History`,
                      })}
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
              <div className="Sidenav__title-wrap">
                <div className="Sidenav__title-item">
                  {intl.formatMessage({
                    id: 'campaigns',
                    defaultMessage: `Campaigns`,
                  })}
                  :
                </div>
                <div
                  className="Sidenav__title-icon"
                  onClick={() => this.toggleMenuCondition('campaigns')}
                  role="presentation"
                >
                  {!menuCondition.campaigns ? (
                    <i className="iconfont icon-addition" />
                  ) : (
                    <i className="iconfont icon-offline" />
                  )}
                </div>
              </div>
              {menuCondition.campaigns && (
                <React.Fragment>
                  <li>
                    <NavLink to={`/rewards/create`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'create',
                        defaultMessage: `Create`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/rewards/manage`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'manage',
                        defaultMessage: `Manage`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/rewards/payables`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'sidenav_rewards_payables',
                        defaultMessage: `Payables`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={`/rewards/match-bot`} activeClassName="Sidenav__item--active">
                      {intl.formatMessage({
                        id: 'match_bot',
                        defaultMessage: `Match bot`,
                      })}
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <span className="tc">
              {intl.formatMessage({
                id: 'pleaseLogin',
                defaultMessage: `For more options please`,
              })}
              <a href={SteemConnect.getLoginURL(next)} className="ml1">
                {intl.formatMessage({
                  id: 'login',
                  defaultMessage: `log in`,
                })}
              </a>
            </span>
          )}
        </ul>
      </React.Fragment>
    );
  }
}
