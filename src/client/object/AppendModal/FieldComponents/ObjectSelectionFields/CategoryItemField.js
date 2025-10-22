import React from 'react';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';

const CategoryItemField = ({
  getFieldDecorator,
  getFieldRules,
  selectedObject,
  handleSelectObject,
  intl,
}) => (
  <>
    <BaseField
      fieldName={objectFields.categoryItem}
      getFieldDecorator={getFieldDecorator}
      rules={getFieldRules(objectFields.categoryItem)}
    >
      <SearchObjectsAutocomplete
        handleSelect={handleSelectObject}
        useExtendedSearch
        placeholder={intl.formatMessage({
          id: 'category_item_placeholder',
          defaultMessage: 'Search for category item',
        })}
      />
    </BaseField>
    {selectedObject && <ObjectCardView wObject={selectedObject} />}
  </>
);

CategoryItemField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape(),
  handleSelectObject: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

CategoryItemField.defaultProps = {
  selectedObject: null,
};

export default React.memo(CategoryItemField);
