import React from 'react';
import ListTable from './ListTable/ListTable';
import { getSellBookList } from '../../waivioApi/ApiClient';

const SellOrdersTable = () => {
  const columnTitles = ['ASK', 'WAIV', 'HIVE'];

  const getOrderList = (account, offset) => getSellBookList(account, offset);

  return <ListTable title="Sell orders" columnTitles={columnTitles} getOrderList={getOrderList} />;
};

export default SellOrdersTable;
