import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

const SectionOneItem = ({ intl, path, sectionItemNameId, sectionItemName, isShow, isExpired }) =>
  isShow && (
    <li>
      <NavLink
        to={path}
        className="sidenav-discover-objects__item"
        activeClassName="Sidenav__item--active"
      >
        {intl.formatMessage({
          id: sectionItemNameId,
          defaultMessage: sectionItemName,
        })}
        {isExpired && <span className={'Sidenav__expired'}> (!)</span>}
      </NavLink>
    </li>
  );

SectionOneItem.propTypes = {
  intl: PropTypes.shape().isRequired,
  path: PropTypes.string.isRequired,
  sectionItemNameId: PropTypes.string.isRequired,
  sectionItemName: PropTypes.string.isRequired,
  isShow: PropTypes.bool,
  isExpired: PropTypes.bool,
};

SectionOneItem.defaultProps = {
  isShow: true,
  isExpired: false,
};

export default injectIntl(SectionOneItem);
