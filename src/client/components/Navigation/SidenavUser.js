import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const SidenavUser = () => (
  <ul className="Sidenav">
    <div className="Sidenav__section-title pt3">
      <FormattedMessage id="tools" defaultMessage="Tools" />:
    </div>
    <li>
      <NavLink to="/activity" activeClassName="Sidenav__item--active">
        <FormattedMessage id="activity" defaultMessage="Activity" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/bookmarks" activeClassName="Sidenav__item--active">
        <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/drafts" activeClassName="Sidenav__item--active">
        <FormattedMessage id="drafts" defaultMessage="Drafts" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/edit-profile" activeClassName="Sidenav__item--active">
        <FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/invite" activeClassName="Sidenav__item--active">
        <FormattedMessage id="invite" defaultMessage="Invite" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/settings" activeClassName="Sidenav__item--active">
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </NavLink>
    </li>
  </ul>
);

export default SidenavUser;
