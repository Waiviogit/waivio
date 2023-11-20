import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ObjectSearchCard from '../../../../ObjectSearchCard/ObjectSearchCard';
import { getObjectName } from '../../../../../../common/helpers/wObjectHelper';

import './SearchItemObject.less';

const SearchItemObject = ({
  objectSelect,
  obj,
  currentObjIndex,
  setCurrentObjIndex,
  objectIndex,
  searchBlockItem,
}) => {
  const hoverObjCard = currentObjIndex === objectIndex;
  const handleSelectObject = () => objectSelect(obj);
  const handleMouseOver = () => setCurrentObjIndex(objectIndex);

  return (
    <div
      ref={searchBlockItem}
      onClick={handleSelectObject}
      onMouseMove={handleMouseOver}
      className={classNames('object-card', { 'object-card__hover': hoverObjCard })}
    >
      <ObjectSearchCard
        key={obj.id}
        object={obj}
        name={getObjectName(obj)}
        type={obj.type || obj.object_type}
      />
    </div>
  );
};

SearchItemObject.propTypes = {
  obj: PropTypes.shape().isRequired,
  objectSelect: PropTypes.func.isRequired,
  objectIndex: PropTypes.number.isRequired,
  searchBlockItem: PropTypes.shape().isRequired,
  currentObjIndex: PropTypes.number.isRequired,
  setCurrentObjIndex: PropTypes.func.isRequired,
};

export default SearchItemObject;
