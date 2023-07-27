import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';

const AffiliateCodesAutoComplete = ({ affiliateObjects, setSelectedObj, setOpenAppendModal }) => {
  const handleSelectObject = obj => {
    setSelectedObj(obj);
    setOpenAppendModal(true);
  };
  const itemsToOmit =
    affiliateObjects?.reduce((acc, currentObject) => {
      if (has(currentObject, 'affiliateCode')) {
        acc.push(currentObject.author_permlink);
      }

      return acc;
    }, []) || [];

  return (
    <SearchObjectsAutocomplete
      itemsIdsToOmit={itemsToOmit}
      objectType={'affiliate'}
      handleSelect={handleSelectObject}
      placeholder={'Find'}
    />
  );
};

AffiliateCodesAutoComplete.propTypes = {
  affiliateObjects: PropTypes.shape(),
  setSelectedObj: PropTypes.func,
  setOpenAppendModal: PropTypes.func,
};
export default AffiliateCodesAutoComplete;
