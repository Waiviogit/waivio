import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const SidenavRewards = () => (
  <ul className="Sidenav">
    <li>
      <NavLink to="/" activeClassName="Sidenav__item--active">
        {/* <i className="iconfont icon-dynamic" /> */}
        Active(3)
      </NavLink>
    </li>
    <li>
      <NavLink to="/reserved" activeClassName="Sidenav__item--active">
        {/* <i className="iconfont icon-collection" /> */}
        Reserved(0)
      </NavLink>
    </li>
    <li>
      <NavLink to="/history" activeClassName="Sidenav__item--active">
        {/* <i className="iconfont icon-collection" /> */}
        History(5)
      </NavLink>
    </li>
  </ul>
);

export default SidenavRewards;
