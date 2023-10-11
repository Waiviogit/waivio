import React from 'react';
import { truncate } from 'lodash';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

const LinkItem = ({ link, index }) => {
  const history = useHistory();

  return link.type === 'blank' ? (
    <a
      key={link.link}
      className="WebsiteTopNavigation__link"
      rel="noreferrer"
      target={'_blank'}
      href={link.link}
    >
      {truncate(link.name, {
        length: 24,
        separator: '...',
      })}
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
      {truncate(link.name, {
        length: 24,
        separator: '...',
      })}
    </NavLink>
  );
};

LinkItem.propTypes = {
  link: PropTypes.shape({
    link: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
  index: PropTypes.number,
};

export default LinkItem;
