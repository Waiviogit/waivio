import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAddOnObjectsFromDepartments } from '../../../../waivioApi/ApiClient';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { addOnsRelatedSimilarTypes } from '../../../object/const/objectTypes';

const ObjectsAddOn = ({ wobject, isCenterContent }) => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const locale = useSelector(getUsedLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const title = <FormattedMessage id="object_field_addOn" defaultMessage="Add-on" />;
  const linkTo = `/object/${wobject.author_permlink}/add-on`;
  const icon = (
    <a>
      <img
        src={'/images/icons/add-on-icon.svg'}
        style={{ width: '18px', height: '18px' }}
        alt="add on icon"
        className="iconfont SidebarContentBlock__icon"
      />
    </a>
  );

  useEffect(() => {
    if (
      !isEmpty(wobject.author_permlink) &&
      addOnsRelatedSimilarTypes.includes(wobject.object_type)
    ) {
      getAddOnObjectsFromDepartments(wobject.author_permlink, userName, locale, 0, 5).then(res =>
        setAddOnObjects(res.wobjects),
      );
    }
  }, [wobject.addOn]);

  return (
    <div>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={addOnObjects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectsAddOn.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsAddOn;
