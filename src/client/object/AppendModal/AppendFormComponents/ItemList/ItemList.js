import React from 'react';
import { get } from 'lodash';
import { Form, Input } from 'antd';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';
import CreateObject from '../../../../post/CreateObjectModal/CreateObject';
import { TYPES_OF_MENU_ITEM } from '../../../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../../const/objectTypes';

const ItemList = (
  getFieldDecorator,
  loading,
  intl,
  selectedObject,
  handleSelectObject,
  handleCreateObject,
  getFieldRules,
  currentField,
  wObject,
) => {
  const objectType = currentField === TYPES_OF_MENU_ITEM.LIST ? OBJECT_TYPE.LIST : OBJECT_TYPE.PAGE;
  return (
    <React.Fragment>
      <Form.Item>
        {getFieldDecorator('menuItemName')(
          <Input
            className="AppendForm__input"
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'menu_item_placeholder',
              defaultMessage: 'Menu item name',
            })}
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator(currentField, {
          rules: getFieldRules(currentField),
        })(
          <SearchObjectsAutocomplete
            className="menu-item-search"
            itemsIdsToOmit={get(wObject, 'menuItems', []).map(f => f.author_permlink)}
            handleSelect={handleSelectObject}
            objectType={objectType}
          />,
        )}
        {selectedObject && <ObjectCardView wObject={selectedObject} />}
      </Form.Item>
      <CreateObject
        isSingleType
        withOpenModalBtn={!selectedObject}
        defaultObjectType={objectType}
        onCreateObject={handleCreateObject}
        openModalBtnText={intl.formatMessage({
          id: `create_new_${objectType}`,
          defaultMessage: 'Create new',
        })}
        parentObject={wObject}
      />
    </React.Fragment>
  );
};
export default ItemList;
