import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { get } from 'lodash';
import { TYPES_OF_MENU_ITEM } from '../../../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../../../object/const/objectTypes';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';
import CreateObject from '../../../../post/CreateObjectModal/CreateObject';
import BaseField from '../BaseField';

const MenuListField = ({
  getFieldDecorator,
  getFieldRules,
  selectedObject,
  handleSelectObject,
  onCreateObject,
  wObject,
  intl,
}) => {
  const objectType = OBJECT_TYPE.LIST;

  return (
    <>
      <BaseField fieldName="menuItemName" getFieldDecorator={getFieldDecorator}>
        <Input
          className="AppendForm__input"
          placeholder={intl.formatMessage({
            id: 'list_title',
            defaultMessage: 'List title',
          })}
        />
      </BaseField>
      <BaseField
        fieldName={TYPES_OF_MENU_ITEM.LIST}
        getFieldDecorator={getFieldDecorator}
        rules={getFieldRules(TYPES_OF_MENU_ITEM.LIST)}
      >
        <SearchObjectsAutocomplete
          className="menu-item-search"
          itemsIdsToOmit={get(wObject, 'menuItems', []).map(f => f.author_permlink)}
          handleSelect={handleSelectObject}
          objectType={objectType}
        />
      </BaseField>
      {selectedObject && <ObjectCardView wObject={selectedObject} />}
      <CreateObject
        isSingleType
        withOpenModalBtn={!selectedObject}
        defaultObjectType={objectType}
        onCreateObject={onCreateObject}
        openModalBtnText={intl.formatMessage({
          id: `create_new_${objectType}`,
          defaultMessage: 'Create new',
        })}
        parentObject={wObject}
      />
    </>
  );
};

MenuListField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape(),
  handleSelectObject: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};

MenuListField.defaultProps = {
  selectedObject: null,
};

export default React.memo(MenuListField);
