import React from 'react';
import ListTable from './ListTable/ListTable';
import { getBuyBookList } from '../../waivioApi/ApiClient';

const BuyOrdersTable = () => {
  const columnTitles = ['HIVE', 'WAIV', 'BID'];

  const getOrderList = (account, offset) => getBuyBookList(account, offset);

  return <ListTable columnTitles={columnTitles} title="Buy orders" getOrderList={getOrderList} />;
};

export default BuyOrdersTable;
