import React from 'react';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';
import CreateObject from '../../../../post/CreateObjectModal/CreateObject';

const FeaturedField = ({
  getFieldDecorator,
  getFieldRules,
  selectedObject,
  handleSelectObject,
  onCreateObject,
  wObject,
  intl,
}) => (
  <>
    <BaseField
      fieldName={objectFields.featured}
      getFieldDecorator={getFieldDecorator}
      rules={getFieldRules(objectFields.featured)}
    >
      <SearchObjectsAutocomplete
        handleSelect={handleSelectObject}
        useExtendedSearch
        itemsIdsToOmit={wObject.featured?.map(i => i.body)}
        placeholder={intl.formatMessage({
          id: 'featured_placeholder',
          defaultMessage: 'Search for featured object',
        })}
      />
    </BaseField>
    {selectedObject && <ObjectCardView wObject={selectedObject} />}
    <br />
    <div className="add-create-btns">
      <CreateObject
        withOpenModalBtn={!selectedObject}
        openModalBtnText={intl.formatMessage({
          id: 'create_new_object',
          defaultMessage: 'Create new object',
        })}
        currentField={objectFields.featured}
        onCreateObject={onCreateObject}
        parentObject={{}}
      />
    </div>
  </>
);

FeaturedField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape(),
  handleSelectObject: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};

FeaturedField.defaultProps = {
  selectedObject: null,
};

export default React.memo(FeaturedField);
