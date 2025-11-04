import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { TYPES_OF_MENU_ITEM } from '../../../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../../../object/const/objectTypes';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../../objectCard/ObjectCardView';
import CreateObject from '../../../../post/CreateObjectModal/CreateObject';
import BaseField from '../BaseField';

const MenuPageField = ({
  getFieldDecorator,
  getFieldRules,
  selectedObject,
  handleSelectObject,
  onCreateObject,
  wObject,
  intl,
}) => {
  const objectType = OBJECT_TYPE.PAGE;

  return (
    <>
      <BaseField fieldName="menuItemName" getFieldDecorator={getFieldDecorator}>
        <Input
          className="AppendForm__input"
          placeholder={intl.formatMessage({
            id: 'page_title',
            defaultMessage: 'Page title',
          })}
        />
      </BaseField>
      <BaseField
        fieldName={TYPES_OF_MENU_ITEM.PAGE}
        getFieldDecorator={getFieldDecorator}
        rules={getFieldRules(TYPES_OF_MENU_ITEM.PAGE)}
      >
        <SearchObjectsAutocomplete
          className="menu-item-search"
          itemsIdsToOmit={wObject.menuItems?.map(f => f.author_permlink) || []}
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

MenuPageField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape(),
  handleSelectObject: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  wObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};

MenuPageField.defaultProps = {
  selectedObject: null,
};

export default React.memo(MenuPageField);
