import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const SidenavUser = isGuest => (
  <ul className="Sidenav">
    {!isGuest && (
      <li>
        <NavLink to="/activity" activeClassName="Sidenav__item--active">
          <i className="iconfont icon-dynamic" />
          <FormattedMessage id="activity" defaultMessage="Activity" />
        </NavLink>
      </li>
    )}
    <li>
      <NavLink to="/bookmarks" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-collection" />
        <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/drafts" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-write" />
        <FormattedMessage id="drafts" defaultMessage="Drafts" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/edit-profile" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-mine" />
        <FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/invite" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-share" />
        <FormattedMessage id="invite" defaultMessage="Invite" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/settings" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-setup" />
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </NavLink>
    </li>
  </ul>
);

SidenavUser.porpTypes = {
  isGuest: PropTypes.bool,
};

SidenavUser.defaultProps = {
  isGuest: false,
};

export default SidenavUser;
