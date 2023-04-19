import React, { useEffect, useState } from 'react';
import { isEmpty, get } from 'lodash';
import PropTypes from 'prop-types';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';
import ObjectsSimilarContent from './ObjectsSimilarContent';
import { sortByFieldPermlinksList } from '../../../../common/helpers/wObjectHelper';

const ObjectsSimilar = ({ wobject, isCenterContent }) => {
  const [similarObjects, setSimilarObjects] = useState([]);
  const similar = get(wobject, 'similar', []);
  const similarObjectsPermlinks = !isEmpty(similar) ? similar.map(obj => obj.body) : [];
  const sortedSimilarObjects = sortByFieldPermlinksList(similarObjectsPermlinks, similarObjects);

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
        similarObjects={sortedSimilarObjects}
      />
    </div>
  );
};

ObjectsSimilar.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
};

export default ObjectsSimilar;
