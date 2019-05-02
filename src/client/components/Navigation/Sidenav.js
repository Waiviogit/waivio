import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const Sidenav = ({ navigationMenu }) => (
  <ul className="Sidenav">
    {navigationMenu.map(menuItem =>
      !menuItem.isHidden ? (
        <li key={menuItem.name}>
          <NavLink
            to={menuItem.linkTo.toLowerCase()}
            className="with-badge"
            activeClassName="Sidenav__item--active"
          >
            <FormattedMessage id={menuItem.intl.id} defaultMessage={menuItem.intl.defaultMessage} />
            {menuItem.badge ? <span>{menuItem.badge}</span> : null}
          </NavLink>
        </li>
      ) : null,
    )}
  </ul>
);

Sidenav.propTypes = {
  navigationMenu: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      linkTo: PropTypes.string.isRequired,
      intl: PropTypes.shape({ id: PropTypes.string, defaultMessage: PropTypes.string }).isRequired,
      badge: PropTypes.oneOf(PropTypes.string, PropTypes.number),
      isHidden: PropTypes.bool,
    }),
  ),
};

Sidenav.defaultProps = {
  navigationMenu: [
    {
      name: 'Main',
      linkTo: '/',
      intl: { id: '_', defaultMessage: 'Main' },
      badge: '',
      isHidden: false,
    },
  ],
};

export default Sidenav;
