import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAutoCompleteSearchResults,
  getHasReceivables,
  getCountTookPartCampaigns,
  getCreatedCampaignsCount,
  getExpiredPayment,
} from '../../store/reducers';
import {
  MESSAGES,
  HISTORY,
  PATH_NAME_HISTORY,
  FRAUD_DETECTION,
} from '../../../common/constants/rewards';
import ModalSignIn from './ModlaSignIn/ModalSignIn';
import { getIsWaivio } from '../../store/appStore/appSelectors';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../store/authStore/authSelectors';

import './Sidenav.less';

@injectIntl
@connect(state => ({
  authUserName: getAuthenticatedUserName(state),
  autoCompleteSearchResults: getAutoCompleteSearchResults(state),
  authenticated: getIsAuthenticated(state),
  isGuest: isGuestUser(state),
  hasReceivables: getHasReceivables(state),
  countTookPartCampaigns: getCountTookPartCampaigns(state),
  createdCampaignsCount: getCreatedCampaignsCount(state),
  isWaivio: getIsWaivio(state),
  isExpired: getExpiredPayment(state),
}))
export default class SidenavRewards extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired,
    hasReceivables: PropTypes.bool,
    isWaivio: PropTypes.bool,
    isExpired: PropTypes.bool,
    countTookPartCampaigns: PropTypes.number,
    createdCampaignsCount: PropTypes.number,
    authUserName: PropTypes.string,
  };

  static defaultProps = {
    autoCompleteSearchResults: {},
    hasReceivables: false,
    isExpired: false,
    isWaivio: true,
    countTookPartCampaigns: 0,
    createdCampaignsCount: 0,
    authUserName: '',
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
        referrals: true,
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
    const {
      intl,
      authenticated,
      isGuest,
      hasReceivables,
      countTookPartCampaigns,
      createdCampaignsCount,
      authUserName,
      isWaivio,
      isExpired,
    } = this.props;
    const { menuCondition } = this.state;

    return (
      <React.Fragment>
        <ul className="Sidenav">
          <div
            className="Sidenav__title-wrap"
            onClick={() => this.toggleMenuCondition('rewards')}
            role="presentation"
          >
            <div className="Sidenav__title-item">
              {intl.formatMessage({
                id: 'sidenav_rewards',
                defaultMessage: 'Rewards',
              })}
              :
            </div>
            <div className="Sidenav__title-icon">
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
                <NavLink
                  to={'/rewards/all'}
                  className="sidenav-discover-objects__item"
                  activeClassName="Sidenav__item--active"
                >
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
                    <NavLink
                      to={`/rewards/active`}
                      className="sidenav-discover-objects__item"
                      activeClassName="Sidenav__item--active"
                    >
                      {intl.formatMessage({
                        id: 'eligible',
                        defaultMessage: `Eligible`,
                      })}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={`/rewards/reserved`}
                      className="sidenav-discover-objects__item"
                      activeClassName="Sidenav__item--active"
                    >
                      {intl.formatMessage({
                        id: 'reserved',
                        defaultMessage: `Reserves`,
                      })}
                    </NavLink>
                  </li>
                  {hasReceivables ? (
                    <li>
                      <NavLink
                        to={`/rewards/receivables`}
                        className="sidenav-discover-objects__item"
                        activeClassName="Sidenav__item--active"
                      >
                        {intl.formatMessage({
                          id: 'sidenav_rewards_receivables',
                          defaultMessage: `Receivables`,
                        })}
                      </NavLink>
                    </li>
                  ) : null}
                  {!!countTookPartCampaigns && (
                    <li>
                      <NavLink
                        to={PATH_NAME_HISTORY}
                        className="sidenav-discover-objects__item"
                        activeClassName="Sidenav__item--active"
                      >
                        {intl.formatMessage({
                          id: HISTORY,
                          defaultMessage: `History`,
                        })}
                      </NavLink>
                    </li>
                  )}
                </React.Fragment>
              )}
              {isWaivio && (
                <React.Fragment>
                  <div
                    className="Sidenav__title-wrap"
                    onClick={() => this.toggleMenuCondition('campaigns')}
                    role="presentation"
                  >
                    <div className="Sidenav__title-item">
                      {intl.formatMessage({
                        id: 'campaigns',
                        defaultMessage: `Campaigns`,
                      })}
                      :
                    </div>
                    <div className="Sidenav__title-icon">
                      {!menuCondition.campaigns ? (
                        <i className="iconfont icon-addition" />
                      ) : (
                        <i className="iconfont icon-offline" />
                      )}
                    </div>
                  </div>
                  {isGuest && menuCondition.campaigns && (
                    <li>
                      <NavLink
                        to={`/rewards/reports`}
                        className="sidenav-discover-objects__item"
                        activeClassName="Sidenav__item--active"
                      >
                        {intl.formatMessage({
                          id: 'sidenav_rewards_reports',
                          defaultMessage: `Reports`,
                        })}
                      </NavLink>
                    </li>
                  )}
                  {!isGuest && menuCondition.campaigns && (
                    <React.Fragment>
                      <li>
                        <NavLink
                          to={`/rewards/create`}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: 'create',
                            defaultMessage: `Create`,
                          })}
                        </NavLink>
                      </li>
                      {!!createdCampaignsCount && (
                        <React.Fragment>
                          <li>
                            <NavLink
                              to={`/rewards/manage`}
                              className="sidenav-discover-objects__item"
                              activeClassName="Sidenav__item--active"
                            >
                              {intl.formatMessage({
                                id: 'manage',
                                defaultMessage: `Manage`,
                              })}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/rewards/payables`}
                              className="sidenav-discover-objects__item"
                              activeClassName="Sidenav__item--active"
                            >
                              {intl.formatMessage({
                                id: 'sidenav_rewards_payables',
                                defaultMessage: `Payables`,
                              })}
                              {isExpired && <span className={'Sidenav__expired'}> (!)</span>}
                            </NavLink>
                          </li>
                        </React.Fragment>
                      )}
                      <li>
                        <NavLink
                          to={`/rewards/reports`}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: 'sidenav_rewards_reports',
                            defaultMessage: `Reports`,
                          })}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={`/rewards/guideHistory`}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: 'reservations',
                            defaultMessage: 'Reservations',
                          })}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={`/rewards/messages`}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: MESSAGES,
                            defaultMessage: `Messages`,
                          })}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={`/rewards/match-bot`}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: 'matchBot',
                            defaultMessage: `Match bot`,
                          })}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={'/rewards/fraud-detection'}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: FRAUD_DETECTION,
                            defaultMessage: 'Fraud detection',
                          })}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={`/rewards/blacklist`}
                          className="sidenav-discover-objects__item"
                          activeClassName="Sidenav__item--active"
                        >
                          {intl.formatMessage({
                            id: 'blacklist',
                            defaultMessage: `Blacklist`,
                          })}
                        </NavLink>
                      </li>
                    </React.Fragment>
                  )}
                  {!isGuest && (
                    <React.Fragment>
                      <div
                        className="Sidenav__title-wrap"
                        onClick={() => this.toggleMenuCondition('referrals')}
                        role="presentation"
                      >
                        <div className="Sidenav__title-item">
                          {intl.formatMessage({
                            id: 'referrals',
                            defaultMessage: `Referrals`,
                          })}
                          :
                        </div>
                        <div className="Sidenav__title-icon">
                          {!menuCondition.referrals ? (
                            <i className="iconfont icon-addition" />
                          ) : (
                            <i className="iconfont icon-offline" />
                          )}
                        </div>
                      </div>
                      {menuCondition.referrals && (
                        <React.Fragment>
                          <li>
                            <NavLink
                              to={`/rewards/referral-details/${authUserName}`}
                              className="sidenav-discover-objects__item"
                              activeClassName="Sidenav__item--active"
                            >
                              {intl.formatMessage({
                                id: 'referrals_details',
                                defaultMessage: `Details`,
                              })}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/rewards/referral-instructions/${authUserName}`}
                              className="sidenav-discover-objects__item"
                              activeClassName="Sidenav__item--active"
                            >
                              {intl.formatMessage({
                                id: 'referrals_instructions',
                                defaultMessage: `Instructions`,
                              })}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to={`/rewards/referral-status/${authUserName}`}
                              className="sidenav-discover-objects__item"
                              activeClassName="Sidenav__item--active"
                            >
                              {intl.formatMessage({
                                id: 'referrals_status',
                                defaultMessage: `Status`,
                              })}
                            </NavLink>
                          </li>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <span className="tc">
              {intl.formatMessage({
                id: 'pleaseLogin',
                defaultMessage: `For more options please`,
              })}{' '}
              <ModalSignIn isButton={false} />
            </span>
          )}
        </ul>
      </React.Fragment>
    );
  }
}
