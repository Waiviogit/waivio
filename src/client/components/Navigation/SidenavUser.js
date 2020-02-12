import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';
import {isGuestUserSelector} from "../../../investarena/redux/selectors/userSelectors";

const SidenavUser = () => {
  const isGuest = useSelector(isGuestUserSelector);
  return(
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
)};

export default SidenavUser;
