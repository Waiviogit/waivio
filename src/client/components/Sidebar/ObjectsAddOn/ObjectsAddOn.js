import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsAddOnContent from './ObjectsAddOnContent';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';

const ObjectsAddOn = ({ wobject, isCenterContent }) => {
  const [addOnObjects, setAddOnObjects] = useState([]);
  const addOn = get(wobject, 'addOn', []);
  const addOnObjectsPermlinks = !isEmpty(addOn) ? addOn.map(obj => obj.body) : [];
  const sortedAddOnObjects = sortByFieldPermlinksList(addOnObjectsPermlinks, addOnObjects);

  useEffect(() => {
    if (!isEmpty(addOn)) {
      getObjectInfo(addOnObjectsPermlinks).then(res => setAddOnObjects(res.wobjects));
    }
  }, [wobject.addOn]);

  return (
    <div>
      <ObjectsAddOnContent
        currWobject={wobject}
        isCenterContent={isCenterContent}
        addOnObjects={sortedAddOnObjects}
      />
    </div>
  );
};

ObjectsAddOn.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsAddOn;
