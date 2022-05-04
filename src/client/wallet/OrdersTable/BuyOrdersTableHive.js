import React from 'react';
import ListTable from '../ListTable/ListTable';
import { getHiveBookList } from '../../../waivioApi/ApiClient';

const BuyOrdersTableHive = () => {
  const columnTitles = ['HBD ($)', 'Hive', 'Price'];

  const getOrderList = async account => {
    const list = await getHiveBookList(account);

    return list.map(el => ({ textId: el, quantity: '', price: '' }));
  };

  return <ListTable columnTitles={columnTitles} title="Buy orders" getOrderList={getOrderList} />;
};

export default BuyOrdersTableHive;
