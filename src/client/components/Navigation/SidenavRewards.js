import React from 'react';
import { injectIntl } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import './Sidenav.less';

@injectIntl
@withRouter
export default class SidenavRewards extends React.Component {
  propTypes = {
    match: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  render() {
    const { match, intl } = this.props;
    return (
      <React.Fragment>
        <ul className="Sidenav">
          <li>
            <NavLink
              to={`/rewards/all/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
            >
              {/* <i className="iconfont icon-dynamic" /> */}
              {intl.formatMessage({
                id: 'all',
                defaultMessage: `All`,
              })}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/rewards/active/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
            >
              {/* <i className="iconfont icon-dynamic" /> */}
              {intl.formatMessage({
                id: 'active',
                defaultMessage: `Active`,
              })}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/rewards/reserved/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
            >
              {/* <i className="iconfont icon-collection" /> */}
              {intl.formatMessage({
                id: 'reserved',
                defaultMessage: `Reserves`,
              })}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/rewards/history/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
            >
              {/* <i className="iconfont icon-collection" /> */}
              {intl.formatMessage({
                id: 'history',
                defaultMessage: `History`,
              })}
            </NavLink>
          </li>
          -----------------------------
        </ul>
        <Link to={`/rewards/create`} activeClassName="Sidenav__item--active">
          {/* <i className="iconfont icon-collection" /> */}
          {intl.formatMessage({
            id: 'create',
            defaultMessage: `Create`,
          })}
        </Link>
      </React.Fragment>
    );
  }
}
