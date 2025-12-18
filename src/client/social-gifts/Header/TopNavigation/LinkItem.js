import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { getMenuLinkTitle } from '../../../../common/helpers/headerHelpers';
import { checkAndOpenWaivioLink } from '../../../../common/helpers/urlHelpers';
import { setLinkSafetyInfo } from '../../../../store/wObjectStore/wobjActions';
import { useTemplateId } from '../../../../designTemplates/TemplateProvider';

const LinkItem = ({ link, index, intl }) => {
  const templateId = useTemplateId();
  const isCleanTemplate = templateId === 'clean';
  const uppercase = !isCleanTemplate;
  const history = useHistory();
  const dispatch = useDispatch();
  const directObjTypes = ['person'];

  let linkTo = directObjTypes?.includes(link?.object_type || '')
    ? `/object/${link.permlink}`
    : link.link;

  if (!linkTo && link.type === 'nav') linkTo = `/object/${link.permlink}`;

  if (linkTo?.includes('/active-campaigns')) {
    return (
      <a key={link.link} className="WebsiteTopNavigation__link" rel="noreferrer" href={link.link}>
        {getMenuLinkTitle(link, intl, 24, uppercase)}
      </a>
    );
  }

  return link.type === 'blank' ? (
    <a
      key={link.link}
      className="WebsiteTopNavigation__link"
      onClick={() => {
        if (!checkAndOpenWaivioLink(link.link)) {
          dispatch(setLinkSafetyInfo(link.link));
        }
      }}
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
    object_type: PropTypes.string,
    permlink: PropTypes.string,
  }),
  index: PropTypes.number,
};

export default injectIntl(LinkItem);
