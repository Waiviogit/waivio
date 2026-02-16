import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { getMenuLinkTitle } from '../../../../common/helpers/headerHelpers';
import { setLinkSafetyInfo } from '../../../../store/wObjectStore/wobjActions';
import { useTemplateId } from '../../../../designTemplates/TemplateProvider';

const LinkItem = ({ link, index, intl }) => {
  const templateId = useTemplateId();
  const isCleanTemplate = templateId === 'clean';
  const uppercase = !isCleanTemplate;
  const history = useHistory();
  const dispatch = useDispatch();
  const directObjTypes = ['person'];
  const hostname = window.location.hostname;

  let linkTo = directObjTypes?.includes(link?.object_type || '')
    ? `/object/${link.permlink}`
    : link.link;

  if (!linkTo && link.type === 'nav') linkTo = `/object/${link.permlink}`;
  const normalize = (path = '') => (path.length > 1 ? path.replace(/\/+$/, '') : path);

  const pathname = normalize(history.location.pathname);

  let linkPathname = linkTo;

  if (linkTo?.startsWith('http')) {
    linkPathname = new URL(linkTo).pathname;
  }

  linkPathname = normalize(linkPathname);

  const className =
    pathname === linkPathname || (index === 0 && history.location.pathname === '/')
      ? 'WebsiteTopNavigation__link WebsiteTopNavigation__link--active'
      : 'WebsiteTopNavigation__link';

  if (linkTo?.includes('/active-campaigns')) {
    return (
      <a key={link.link} className={className} rel="noreferrer" href={link.link}>
        {getMenuLinkTitle(link, intl, 24, uppercase)}
      </a>
    );
  }

  return link.type === 'blank' ? (
    <a
      key={link.link}
      className={className}
      onClick={() => {
        if (link?.link?.includes(hostname)) {
          return window && window?.open(link.link, link.isNewTab ? '_blank' : '_self');
        }

        return dispatch(setLinkSafetyInfo(link?.link));
      }}
      target={link.isNewTab ? '_blank' : '_self'}
    >
      {getMenuLinkTitle(link, intl, 24, uppercase)}
    </a>
  ) : (
    <NavLink
      className="WebsiteTopNavigation__link"
      isActive={() =>
        (index === 0 && history.location.pathname === '/') ||
        history.location.pathname?.includes(linkTo)
      }
      activeClassName={'WebsiteTopNavigation__link--active'}
      key={link.link}
      to={linkTo}
      target={link.isNewTab ? '_blank' : '_self'}
    >
      {' '}
      {getMenuLinkTitle(link, intl, 24, uppercase)}
    </NavLink>
  );
};

LinkItem.propTypes = {
  intl: PropTypes.shape(),
  link: PropTypes.shape({
    link: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    isNewTab: PropTypes.string,
    object_type: PropTypes.string,
    permlink: PropTypes.string,
  }),
  index: PropTypes.number,
};

export default injectIntl(LinkItem);
