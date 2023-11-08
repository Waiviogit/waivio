import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { getMenuLinkTitle } from '../../../../common/helpers/headerHelpers';

const LinkItem = ({ link, index, intl }) => {
  const history = useHistory();

  return link.type === 'blank' ? (
    <a
      key={link.link}
      className="WebsiteTopNavigation__link"
      rel="noreferrer"
      target={'_blank'}
      href={link.link}
    >
      {getMenuLinkTitle(link, intl, 24)}
    </a>
  ) : (
    <NavLink
      className="WebsiteTopNavigation__link"
      isActive={() =>
        (!index && history.location.pathname === '/') ||
        history.location.pathname.includes(link?.link)
      }
      activeClassName={'WebsiteTopNavigation__link--active'}
      key={link.link}
      to={link.link}
    >
      {' '}
      {getMenuLinkTitle(link, intl, 24)}
    </NavLink>
  );
};

LinkItem.propTypes = {
  intl: PropTypes.shape(),
  link: PropTypes.shape({
    link: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  index: PropTypes.number,
};

export default injectIntl(LinkItem);
