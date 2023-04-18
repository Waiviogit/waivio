import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsAddOnContent from './ObjectsAddOnContent';

const ObjectsAddOn = ({ wobject, isCenterContent }) => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const addOn = get(wobject, 'addOn', []);
  const relatedObjectsPermlinks = !isEmpty(addOn) ? addOn.map(obj => obj.body) : [];

  useEffect(() => {
    if (!isEmpty(addOn)) {
      getObjectInfo(relatedObjectsPermlinks).then(res => setAddOnObjects(res.wobjects));
    }
  }, [wobject.addOn]);

  return (
    <div>
      <ObjectsAddOnContent
        currWobject={wobject}
        isCenterContent={isCenterContent}
        addOnObjects={addOnObjects}
      />
    </div>
  );
};

ObjectsAddOn.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsAddOn;
