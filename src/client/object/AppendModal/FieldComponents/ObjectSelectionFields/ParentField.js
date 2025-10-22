import React from 'react';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';

const ParentField = ({
  getFieldDecorator,
  getFieldRules,
  selectedObject,
  handleSelectObject,
  intl,
}) => (
  <>
    <BaseField
      fieldName={objectFields.parent}
      getFieldDecorator={getFieldDecorator}
      rules={getFieldRules(objectFields.parent)}
    >
      <SearchObjectsAutocomplete
        handleSelect={handleSelectObject}
        useExtendedSearch
        placeholder={intl.formatMessage({
          id: 'parent_placeholder',
          defaultMessage: 'Search for parent object',
        })}
      />
    </BaseField>
    {selectedObject && <ObjectCardView wObject={selectedObject} />}
  </>
);

ParentField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape(),
  handleSelectObject: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

ParentField.defaultProps = {
  selectedObject: null,
};

export default React.memo(ParentField);
