import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { has } from 'lodash';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';

const AffiliateCodesAutoComplete = ({
  affiliateObjects,
  setSelectedObj,
  setOpenAppendModal,
  intl,
}) => {
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
      useExtendedSearch
      itemsIdsToOmit={itemsToOmit}
      objectType={'affiliate'}
      handleSelect={handleSelectObject}
      placeholder={intl.formatMessage({
        id: 'find',
        defaultMessage: 'Find',
      })}
    />
  );
};

AffiliateCodesAutoComplete.propTypes = {
  affiliateObjects: PropTypes.shape(),
  setSelectedObj: PropTypes.func,
  setOpenAppendModal: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};
export default injectIntl(AffiliateCodesAutoComplete);
