import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { getFeaturedObjects } from '../../../../waivioApi/ApiClient';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { featuredObjectTypes } from '../../../object/const/objectTypes';

const ObjectsFeatured = ({ wobject, isCenterContent }) => {
  const [featuredObjects, setFeaturedObjects] = useState([]);
  const locale = useSelector(getUsedLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const title = <FormattedMessage id="object_field_featured" defaultMessage="Featured" />;
  const linkTo = `/object/${wobject.author_permlink}/featured`;
  const icon = (
    <a>
      <ReactSVG
        src={'/images/icons/bookmark.svg'}
        alt="add on icon"
        className="SidebarContentBlock__bookmark-icon"
      />
    </a>
  );

  useEffect(() => {
    if (!isEmpty(wobject.author_permlink) && featuredObjectTypes.includes(wobject.object_type)) {
      getFeaturedObjects(wobject.author_permlink, userName, locale, 0, 5).then(res =>
        setFeaturedObjects(res.wobjects),
      );
    }
  }, [wobject.addOn]);

  return (
    <div>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={featuredObjects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectsFeatured.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsFeatured;
