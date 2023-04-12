import { isEmpty, throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import WeightTag from '../../WeightTag';
import ObjectCard from '../ObjectCard';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsRelatedContent from './ObjectsRelatedContent';

import './ObjectsRelated.less';

const ObjectsRelated = ({
  clearRelateObjects,
  currWobject,
  isCenterContent,
  getObjectRelated,
  hasNext,
  objects,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [relatedObjects, setRelatedObjects] = useState([]);
  const relatedObjectsPermlinks =
    !isEmpty(currWobject.related) && currWobject?.related?.map(obj => obj.body);

  useEffect(() => {
    !isEmpty(relatedObjectsPermlinks) &&
      getObjectInfo(relatedObjectsPermlinks).then(res => setRelatedObjects(res.wobjects));
  }, [currWobject.related]);

  const renderedObjects = [...relatedObjects, ...objects];

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

  const renderObjectsModal = () =>
    renderedObjects?.map(item => (
      <ObjectCard
        isModal
        key={item.author_permlink}
        wobject={item}
        parent={currWobject}
        showFollow={false}
        alt={<WeightTag weight={item.weight} />}
        isNewWindow={false}
      />
    ));

  return (
    <div onWheel={throttle(onWheelHandler, 500)}>
      <ObjectsRelatedContent
        setShowModal={setShowModal}
        isCenterContent={isCenterContent}
        relatedObjects={relatedObjects}
      />
      <Modal
        title="Related"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        id="ObjectRelated__Modal"
      >
        {renderObjectsModal(true)}
      </Modal>
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
