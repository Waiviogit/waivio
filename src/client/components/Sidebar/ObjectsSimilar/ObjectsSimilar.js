import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsSimilarContent from './ObjectsSimilarContent';

const ObjectsSimilar = ({ wobject, isCenterContent }) => {
  const [similarObjects, setSimilarObjects] = useState([]);
  const similar = get(wobject, 'similar', []);
  const similarObjectsPermlinks = !isEmpty(similar) ? similar.map(obj => obj.body) : [];

  useEffect(() => {
    if (!isEmpty(similar)) {
      getObjectInfo(similarObjectsPermlinks).then(res => setSimilarObjects(res.wobjects));
    }
  }, [wobject.similar]);

  return (
    <div>
      <ObjectsSimilarContent
        currWobject={wobject}
        isCenterContent={isCenterContent}
        similarObjects={similarObjects}
      />
    </div>
  );
};

ObjectsSimilar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsSimilar;
