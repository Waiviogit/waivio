import React, { useEffect, useState } from 'react';
import { isEmpty, throttle } from 'lodash';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsRelatedContent from './ObjectsRelatedContent';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';
import './ObjectsRelated.less';

const ObjectsRelated = ({ currWobject, isCenterContent, getObjectRelated, hasNext, objects }) => {
  const [relatedObjects, setRelatedObjects] = useState([]);
  const objectsPermlinks = objects?.map(obj => obj.author_permlink);
  const relatedObjectsPermlinks = !isEmpty(currWobject.related)
    ? [...currWobject?.related?.map(obj => obj.body), ...objectsPermlinks]
    : objectsPermlinks;

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
      <ObjectsRelatedContent
        isCenterContent={isCenterContent}
        relatedObjects={sortedRelatedObjects}
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
