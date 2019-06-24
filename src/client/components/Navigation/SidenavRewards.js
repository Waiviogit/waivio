import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
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
      <ul className="Sidenav">
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
      </ul>
    );
  }
}
