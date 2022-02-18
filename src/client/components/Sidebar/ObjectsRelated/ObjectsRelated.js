import { throttle } from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import WeightTag from '../../WeightTag';
import ObjectCard from '../ObjectCard';
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

  React.useEffect(
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

  const renderObjectsModal = objects.map(item => (
    <ObjectCard
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
      <ObjectsRelatedContent setShowModal={setShowModal} isCenterContent={isCenterContent} />
      <Modal
        title="Related"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        id="ObjectRelated__Modal"
      >
        {renderObjectsModal}
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
