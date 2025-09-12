import React, { useEffect, useState } from 'react';
import { isEmpty, throttle } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getRelatedObjectsFromDepartments } from '../../../../waivioApi/ApiClient';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';
import './ObjectsRelated.less';
import { getUsedLocale } from '../../../../store/appStore/appSelectors';
import { addOnsRelatedSimilarTypes } from '../../../object/const/objectTypes';

const ObjectsRelated = ({
  currWobject,
  isCenterContent,
  getObjectRelated,
  hasNext,
  objects,
  clearRelateObjects,
}) => {
  const [relatedObjects, setRelatedObjects] = useState([]);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const title = <FormattedMessage id="related_to_object" defaultMessage="Related" />;
  const linkTo = `/object/${currWobject.author_permlink}/related`;
  const icon = <i className="iconfont icon-link SidebarContentBlock__icon" />;

  useEffect(() => {
    if (
      !isEmpty(currWobject.author_permlink) &&
      addOnsRelatedSimilarTypes?.includes(currWobject.object_type)
    ) {
      getRelatedObjectsFromDepartments(
        currWobject.author_permlink,
        userName,
        locale,
        0,
        5,
      ).then(res => setRelatedObjects(res.wobjects || []));
    }
  }, [currWobject.related, currWobject.author_permlink]);

  const sortedRelatedObjects = [...relatedObjects, ...objects];

  useEffect(() => {
    getObjectRelated();

    return () => {
      clearRelateObjects();
    };
  }, [currWobject.related, currWobject.author_permlink]);

  const onWheelHandler = () => {
    if (hasNext) {
      getObjectRelated();
    }
  };

  return (
    <div onWheel={throttle(onWheelHandler, 500)}>
      <ObjectsSidebarTablesContent
        isCenterContent={isCenterContent}
        objects={sortedRelatedObjects}
        title={title}
        linkTo={linkTo}
        icon={icon}
      />
    </div>
  );
};

ObjectsRelated.propTypes = {
  currWobject: PropTypes.shape().isRequired,
  getObjectRelated: PropTypes.func.isRequired,
  clearRelateObjects: PropTypes.func.isRequired,
  isCenterContent: PropTypes.bool,
  hasNext: PropTypes.bool,
  objects: PropTypes.arrayOf(PropTypes.shape()),
};

ObjectsRelated.defaultProps = {
  isCenterContent: false,
  hasNext: false,
  objects: [],
  currWobject: {},
};

export default ObjectsRelated;
