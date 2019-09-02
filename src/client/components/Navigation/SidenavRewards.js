import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Sidenav.less';
import { getAutoCompleteSearchResults, getIsAuthenticated } from '../../reducers';
import SteemConnect from '../../steemConnectAPI';

@injectIntl
@connect(state => ({
  autoCompleteSearchResults: getAutoCompleteSearchResults(state),
  authenticated: getIsAuthenticated(state),
}))
export default class SidenavRewards extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
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
    };
  }

  render() {
    const { intl, authenticated, location } = this.props;
    const next = location.pathname.length > 1 ? location.pathname : '';
    return (
      <React.Fragment>
        <ul className="Sidenav">
          <div className="Sidenav__section-title">
            {intl.formatMessage({
              id: 'rewards',
              defaultMessage: `rewards`,
            })}
            :
          </div>
          <li>
            <NavLink to={'/rewards/all'} activeClassName="Sidenav__item--active">
              {intl.formatMessage({
                id: 'all',
                defaultMessage: `All`,
              })}
            </NavLink>
          </li>
          {authenticated ? (
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
                <NavLink to={`/rewards/history`} activeClassName="Sidenav__item--active">
                  {intl.formatMessage({
                    id: 'history',
                    defaultMessage: `History`,
                  })}
                </NavLink>
              </li>
              <div className="Sidenav__section-title">
                {intl.formatMessage({
                  id: 'campaigns',
                  defaultMessage: `Campaigns`,
                })}
                :
              </div>
              <li>
                <NavLink to={`/rewards/create`} activeClassName="Sidenav__item--active">
                  {intl.formatMessage({
                    id: 'create',
                    defaultMessage: `Create`,
                  })}
                </NavLink>
              </li>
              <li>
                <NavLink to={`/rewards/created`} activeClassName="Sidenav__item--active">
                  {intl.formatMessage({
                    id: 'created',
                    defaultMessage: `Created`,
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
                <NavLink to={`/rewards/match-bot`} activeClassName="Sidenav__item--active">
                  {intl.formatMessage({
                    id: 'match_bot',
                    defaultMessage: `Match bot`,
                  })}
                </NavLink>
              </li>
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
