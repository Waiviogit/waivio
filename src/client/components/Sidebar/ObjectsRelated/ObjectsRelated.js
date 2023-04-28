import React, { useEffect, useState } from 'react';
import { isEmpty, throttle } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';
import './ObjectsRelated.less';
import ObjectsSidebarTablesContent from '../ObjectSidebarTablesContent/ObjectSidebarTablesContent';

const ObjectsRelated = ({ currWobject, isCenterContent, getObjectRelated, hasNext, objects }) => {
  const [relatedObjects, setRelatedObjects] = useState([]);
  const objectsPermlinks = objects?.map(obj => obj.author_permlink);
  const relatedObjectsPermlinks = !isEmpty(currWobject.related)
    ? [...currWobject?.related?.map(obj => obj.body), ...objectsPermlinks]
    : objectsPermlinks;
  const title = <FormattedMessage id="related_to_object" defaultMessage="Related" />;
  const linkTo = `/object/${currWobject.author_permlink}/related`;
  const icon = <i className="iconfont icon-link SidebarContentBlock__icon" />;

  useEffect(() => {
    if (!isEmpty(relatedObjectsPermlinks) || !isEmpty(objectsPermlinks)) {
      getObjectInfo(relatedObjectsPermlinks).then(res => setRelatedObjects(res.wobjects));
    }
  }, [currWobject.related, objects.length]);

  const sortedRelatedObjects = sortByFieldPermlinksList(relatedObjectsPermlinks, relatedObjects);

  useEffect(() => {
    getObjectRelated();
  }, [currWobject.related, objects.length]);

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
