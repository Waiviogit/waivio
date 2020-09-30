import React from 'react';
import { isEmpty } from 'lodash';
import { Form, Select } from 'antd';
import { getMenuItems, getObjectName, parseButtonsField } from '../../../../helpers/wObjectHelper';
import { objectFields, TYPES_OF_MENU_ITEM } from '../../../../../common/constants/listOfFields';
import OBJECT_TYPE from '../../../const/objectTypes';
import DnDListItem from '../../../../components/DnDList/DnDListItem';
import SortingList from '../../../../components/DnDList/DnDList';
import { PRIMARY_COLOR } from '../../../../../common/constants/waivio';

const ItemCustomSorting = (getFieldDecorator, wObject, loading, intl, handleChangeSorting) => {
  const buttons = parseButtonsField(wObject);
  const menuLinks = getMenuItems(wObject, TYPES_OF_MENU_ITEM.LIST, OBJECT_TYPE.LIST);
  const menuPages = getMenuItems(wObject, TYPES_OF_MENU_ITEM.PAGE, OBJECT_TYPE.PAGE);
  const listItems =
    [...menuLinks, ...menuPages].map(item => ({
      id: item.body || item.author_permlink,
      content: <DnDListItem name={item.alias || getObjectName(item)} type={item.type} />,
    })) || [];

  if (!isEmpty(buttons)) {
    buttons.forEach(btn => {
      listItems.push({
        id: btn.permlink,
        content: <DnDListItem name={btn.body.title} type={objectFields.button} />,
      });
    });
  }
  if (!isEmpty(wObject.newsFilter)) {
    listItems.push({
      id: TYPES_OF_MENU_ITEM.NEWS,
      content: (
        <DnDListItem
          name={intl.formatMessage({ id: 'news', defaultMessage: 'News' })}
          type={objectFields.newsFilter}
        />
      ),
    });
  }

  return (
    <React.Fragment>
      <Form.Item>
        {getFieldDecorator(objectFields.sorting, {
          initialValue: listItems.map(item => item.id).join(','),
        })(
          <Select
            className="AppendForm__hidden"
            mode="tags"
            disabled={loading}
            dropdownStyle={{ display: 'none' }}
            tokenSeparators={[' ', ',']}
          />,
        )}
      </Form.Item>
      <SortingList
        listItems={listItems}
        accentColor={PRIMARY_COLOR}
        onChange={handleChangeSorting}
      />
    </React.Fragment>
  );
};
export default ItemCustomSorting;
