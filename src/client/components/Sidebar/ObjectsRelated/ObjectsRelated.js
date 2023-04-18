import { isEmpty, throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsRelatedContent from './ObjectsRelatedContent';

import './ObjectsRelated.less';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';

const ObjectsRelated = ({
  clearRelateObjects,
  currWobject,
  isCenterContent,
  getObjectRelated,
  hasNext,
  objects,
}) => {
  const [relatedObjects, setRelatedObjects] = useState([]);
  const relatedObjectsPermlinks = !isEmpty(currWobject.related)
    ? currWobject?.related?.map(obj => obj.body)
    : [];

  useEffect(() => {
    if (!isEmpty(relatedObjectsPermlinks)) {
      getObjectInfo(relatedObjectsPermlinks).then(res => setRelatedObjects(res.wobjects));
    }
  }, [currWobject.related]);

  const sortedRelatedObjects = sortByFieldPermlinksList(relatedObjectsPermlinks, relatedObjects);

  const renderedObjects = [...sortedRelatedObjects, ...objects];

  useEffect(
    () => () => {
      clearRelateObjects();
    },
    [],
  );

  const onWheelHandler = () => {
    if (hasNext) {
      getObjectRelated();
    }
  };

  return (
    <div onWheel={throttle(onWheelHandler, 500)}>
      <ObjectsRelatedContent isCenterContent={isCenterContent} relatedObjects={renderedObjects} />
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
