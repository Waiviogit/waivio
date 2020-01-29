import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const SidenavUser = () => {
  const [menuCondition, setMenuCondition] = useState({
    personal: true,
    websites: true,
  });

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <ul className="Sidenav">
      <div
        className="Sidenav__title-wrap"
        onClick={() => toggleMenuCondition('personal')}
        role="presentation"
      >
        <div className="Sidenav__title-item">
          <FormattedMessage id="sidenav_user_personal" defaultMessage="Personal" />:
        </div>
        <div className="Sidenav__title-icon">
          {!menuCondition.personal ? (
            <i className="iconfont icon-addition" />
          ) : (
            <i className="iconfont icon-offline" />
          )}
        </div>
      </div>
      {menuCondition.personal && (
        <React.Fragment>
          <li>
            <NavLink to="/drafts" activeClassName="Sidenav__item--active">
              <FormattedMessage id="drafts" defaultMessage="Drafts" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/bookmarks" activeClassName="Sidenav__item--active">
              <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/edit-profile" activeClassName="Sidenav__item--active">
              <FormattedMessage id="edit_profile" defaultMessage="Edit profile" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" activeClassName="Sidenav__item--active">
              <FormattedMessage id="settings" defaultMessage="Settings" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/invite" activeClassName="Sidenav__item--active">
              <FormattedMessage id="invite" defaultMessage="Invite" />
            </NavLink>
          </li>
        </React.Fragment>
      )}
      <div
        className="Sidenav__title-wrap"
        onClick={() => toggleMenuCondition('websites')}
        role="presentation"
      >
        <div className="Sidenav__title-item">
          <FormattedMessage id="sidenav_user_websites" defaultMessage="Websites" />:
        </div>
        <div className="Sidenav__title-icon">
          {!menuCondition.websites ? (
            <i className="iconfont icon-addition" />
          ) : (
            <i className="iconfont icon-offline" />
          )}
        </div>
      </div>
      {menuCondition.websites && (
        <React.Fragment>
          <li>
            <NavLink to="/create_mock" activeClassName="Sidenav__item--active">
              <FormattedMessage id="sidenav_user_create" defaultMessage="Create" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage_mock" activeClassName="Sidenav__item--active">
              <FormattedMessage id="sidenav_user_manage" defaultMessage="Manage" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/payments_mock" activeClassName="Sidenav__item--active">
              <FormattedMessage id="sidenav_user_payments" defaultMessage="Payments" />
            </NavLink>
          </li>
        </React.Fragment>
      )}
    </ul>
  );
};

export default SidenavUser;
