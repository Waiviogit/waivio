import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const Sidenav = ({ navigationMenu }) => (
  <ul className="Sidenav">
    {navigationMenu.map(menuItem => {
      return (
        <li key={menuItem.name}>
          <NavLink to={menuItem.linkTo.toLowerCase()} activeClassName="Sidenav__item--active">
            <FormattedMessage id={menuItem.intl.id} defaultMessage={menuItem.intl.defaultMessage} />
          </NavLink>
        </li>
      );
    })}
  </ul>
);

Sidenav.propTypes = {
  navigationMenu: PropTypes.arrayOf(PropTypes.shape()),
};

Sidenav.defaultProps = {
  navigationMenu: [
    {
      name: 'Main',
      linkTo: '/',
      intl: { id: '_', defaultMessage: 'Main' },
    },
  ],
};

export default Sidenav;
