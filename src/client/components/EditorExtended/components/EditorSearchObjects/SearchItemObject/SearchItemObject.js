import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";

import ObjectSearchCard from '../../../../ObjectSearchCard/ObjectSearchCard';
import { getObjectName } from '../../../../../helpers/wObjectHelper';

import './SearchItemObject.less';

const SearchItemObject = ({ objectSelect, obj, selectedObjIndex, setSelectedObjIndex, objectIndex }) => {
  const hoverObjCard = selectedObjIndex === objectIndex;
  const handleSelectObject = () => objectSelect(obj);
  const handleMouseOver = () => setSelectedObjIndex(objectIndex);

  return (
    <div
      onMouseOver={handleMouseOver}
      className={classNames("object-card", { "object-card__hover": hoverObjCard })}
      onClick={handleSelectObject}
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
  selectedObjIndex: PropTypes.number.isRequired,
  setSelectedObjIndex: PropTypes.func.isRequired,
};

export default SearchItemObject;
