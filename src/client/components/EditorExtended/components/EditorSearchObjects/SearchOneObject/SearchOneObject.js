import * as React from 'react';
import PropTypes from "prop-types";

import ObjectSearchCard from "../../../../ObjectSearchCard/ObjectSearchCard";
import { getObjectName } from "../../../../../helpers/wObjectHelper";

const SearchOneObject = ({ objectSelect, obj }) => {
  const handleSelectObject = () => {
    objectSelect(obj)
  };

  return (
    <div onClick={handleSelectObject}>
      <ObjectSearchCard
        key={obj.id}
        object={obj}
        name={getObjectName(obj)}
        type={obj.type || obj.object_type}
      />
    </div>
  );
}

SearchOneObject.propTypes = {
  obj: PropTypes.shape().isRequired,
  objectSelect: PropTypes.func.isRequired,
};

export default SearchOneObject;
