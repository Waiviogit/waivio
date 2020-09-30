import React from 'react';
import { FormattedMessage } from 'react-intl';
import { map } from 'lodash';
import { Form, Select } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';

import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';

const ItemCategory = (
  getFieldDecorator,
  selectedCategory,
  categories,
  loading,
  handleSelectCategory,
  handleSelectObject,
  selectedObject,
  getFieldRules,
) => (
  <React.Fragment>
    <div className="ant-form-item-label label AppendForm__appendTitles">
      <FormattedMessage id="suggest4" defaultMessage="I suggest to add field" />
    </div>
    <Form.Item>
      {getFieldDecorator('tagCategory', {
        initialValue: selectedCategory ? selectedCategory.body : 'Select a category',
        rules: getFieldRules(objectFields.tagCategory),
      })(
        <Select disabled={loading} onChange={handleSelectCategory}>
          {map(categories, category => (
            <Select.Option key={`${category.id}`} value={category.body}>
              {category.body}
            </Select.Option>
          ))}
        </Select>,
      )}
    </Form.Item>
    <div className="ant-form-item-label label AppendForm__appendTitles">
      <FormattedMessage id="suggest5" defaultMessage="I suggest to add field" />
    </div>
    <Form.Item>
      {getFieldDecorator(objectFields.categoryItem, {
        rules: getFieldRules(objectFields.categoryItem),
      })(<SearchObjectsAutocomplete handleSelect={handleSelectObject} objectType="hashtag" />)}
      {selectedObject && <ObjectCardView wObject={selectedObject} />}
    </Form.Item>
  </React.Fragment>
);
export default ItemCategory;
