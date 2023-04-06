import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectCard from '../ObjectCard';
import WeightTag from '../../WeightTag';
import ObjectsSimilarContent from './ObjectsSimilarContent';

const ObjectsSimilar = ({ wobject, isCenterContent }) => {
  const [showModal, setShowModal] = useState(false);
  const [similarObjects, setSimilarObjects] = useState([]);
  const similar = get(wobject, 'similar', []);
  const similarObjectsPermlinks = !isEmpty(similar) && similar.map(obj => obj.body);

  useEffect(() => {
    !isEmpty(similar) &&
      getObjectInfo(similarObjectsPermlinks).then(res => setSimilarObjects(res.wobjects));
  }, []);

  const renderObjectsModal = similarObjects?.map(item => (
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
      <ObjectsSimilarContent
        setShowModal={setShowModal}
        isCenterContent={isCenterContent}
        similarObjects={similarObjects}
      />
      <Modal
        title="Similar"
        visible={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        id="ObjectSimilar__Modal"
      >
        {renderObjectsModal}
      </Modal>
    </div>
  );
};

ObjectsSimilar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsSimilar;
