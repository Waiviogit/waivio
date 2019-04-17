import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const isNews = (match, location) => location.pathname.match(/trending/);

const Sidenav = ({ username }) =>
  username ? (
    <ul className="Sidenav">
      <li>
        <NavLink to="/" activeClassName="Sidenav__item--active" exact>
          <i className="iconfont icon-clock" />
          <FormattedMessage id="feed" defaultMessage="Feed" />
        </NavLink>
      </li>
      <li>
        <NavLink to="/trending" activeClassName="Sidenav__item--active" isActive={isNews}>
          <i className="iconfont icon-headlines" />
          <FormattedMessage id="news" defaultMessage="News" />
        </NavLink>
      </li>
    </ul>
  ) : null;

Sidenav.propTypes = {
  username: PropTypes.string,
};

Sidenav.defaultProps = {
  username: undefined,
};

export default Sidenav;
