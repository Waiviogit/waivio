import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectCard from '../ObjectCard';
import WeightTag from '../../WeightTag';
import ObjectsAddOnContent from './ObjectsAddOnContent';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';

const ObjectsAddOn = ({ wobject, isCenterContent }) => {
  const [showModal, setShowModal] = useState(false);
  const [addOnObjects, setAddOnObjects] = useState([]);
  const addOn = get(wobject, 'addOn', []);
  const relatedObjectsPermlinks = !isEmpty(addOn) ? addOn.map(obj => obj.body) : [];
  const sortedAddOnObjects = sortByFieldPermlinksList(relatedObjectsPermlinks, addOnObjects);
  const addOnObjectsArr =
    sortedAddOnObjects.length > 5 ? sortedAddOnObjects.slice(0, 5) : sortedAddOnObjects;

  useEffect(() => {
    if (!isEmpty(addOn)) {
      getObjectInfo(relatedObjectsPermlinks).then(res => setAddOnObjects(res.wobjects));
    }
  }, [wobject.addOn]);

  const renderObjectsModal = addOnObjectsArr?.map(item => (
    <ObjectCard
      key={item.author_permlink}
      wobject={item}
      // parent={wobject}
      showFollow={false}
      alt={<WeightTag weight={item.weight} />}
      isNewWindow={false}
    />
  ));

  return (
    <div
    // onWheel={throttle(onWheelHandler, 500)}
    >
      <ObjectsAddOnContent
        setShowModal={setShowModal}
        isCenterContent={isCenterContent}
        addOnObjects={sortedAddOnObjects}
      />
      <Modal
        title="Add-on"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        id="ObjectAddOn__Modal"
      >
        {renderObjectsModal}
      </Modal>
    </div>
  );
};

ObjectsAddOn.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsAddOn;
