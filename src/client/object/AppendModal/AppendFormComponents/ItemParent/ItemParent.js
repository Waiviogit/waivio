import React from 'react';
import { Form } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';

const ItemParent = (getFieldDecorator, handleSelectObject, selectedObject, getFieldRules) => (
  <Form.Item>
    {getFieldDecorator(objectFields.parent, {
      rules: getFieldRules(objectFields.parent),
    })(<SearchObjectsAutocomplete handleSelect={handleSelectObject} />)}
    {selectedObject && <ObjectCardView wObject={selectedObject} />}
  </Form.Item>
);
export default ItemParent;
