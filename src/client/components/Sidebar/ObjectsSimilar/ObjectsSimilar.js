import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import { isEmpty } from 'lodash';
import { getSimilarObjectsFromDepartments } from '../../../../waivioApi/ApiClient';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { addOnsRelatedSimilarTypes } from '../../../object/const/objectTypes';

const ObjectsSimilar = ({ wobject, isCenterContent }) => {
  const [similarObjects, setSimilarObjects] = useState([]);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const title = <FormattedMessage id="object_field_similar" defaultMessage="Similar" />;
  const linkTo = `/object/${wobject.author_permlink}/similar`;
  const icon = <Icon type="block" className="iconfont icon-link SidebarContentBlock__icon" />;

  useEffect(() => {
    if (
      !isEmpty(wobject.author_permlink) &&
      addOnsRelatedSimilarTypes?.includes(wobject.object_type)
    ) {
      getSimilarObjectsFromDepartments(wobject.author_permlink, userName, locale, 0, 5).then(res =>
        setSimilarObjects(res.wobjects || []),
      );
    }
  }, [wobject.similar, wobject.author_permlink]);

  return (
    <div>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={similarObjects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectsSimilar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsSimilar;
