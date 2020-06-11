import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import BlacklistContent from './BlacklistContent';
import './Blacklist.less';
import BlacklistFooter from './BlacklistFooter';

const Blacklist = ({ intl, location: { pathname }, userName }) => (
  <div className="Blacklist">
    <ul className="Blacklist__menu">
      <li className="Blacklist__item">
        <Link
          to="/rewards/blacklist"
          className={classNames('Blacklist__link', {
            'Blacklist__link--active': pathname === '/rewards/blacklist',
          })}
        >
          {intl.formatMessage({
            id: 'blacklist',
            defaultMessage: 'Blacklist',
          })}
        </Link>
      </li>
      <li className="Blacklist__item">
        <Link
          to="/rewards/blacklist/references"
          className={classNames('Blacklist__link', {
            'Blacklist__link--active': pathname.includes('references'),
          })}
        >
          {intl.formatMessage({
            id: 'references',
            defaultMessage: 'References',
          })}
        </Link>
      </li>
      <li className="Blacklist__item">
        <Link
          to="/rewards/blacklist/whitelist"
          className={classNames('Blacklist__link', {
            'Blacklist__link--active': pathname.includes('whitelist'),
          })}
        >
          {intl.formatMessage({
            id: 'whitelist',
            defaultMessage: 'Whitelist',
          })}
        </Link>
      </li>
    </ul>
    <BlacklistContent userName={userName} pathname={pathname} />
    <BlacklistFooter />
  </div>
);

Blacklist.propTypes = {
  intl: PropTypes.shape().isRequired,
  location: PropTypes.shape(),
  userName: PropTypes.string,
};

Blacklist.defaultProps = {
  location: {
    pathname: '',
  },
  userName: '',
};

export default injectIntl(Blacklist);
