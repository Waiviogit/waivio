import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { isEmpty } from 'lodash';
import ListTable from '../ListTable/ListTable';
import { getHiveBookList } from '../../../waivioApi/ApiClient';

const SellOrdersTableHive = () => {
  const [list, setList] = useState([]);
  const { name } = useParams();

  const getMappedArray = async () => {
    const response = await getHiveBookList(name);
    const mappedArray = response
      .filter(el => el.sell_price.base.includes('HIVE'))
      .sort((a, b) => a.real_price - b.real_price)
      .map(el => ({
        textId: el.id,
        quantity: Number.parseFloat(el.sell_price.base),
        price: el.real_price,
      }));

    setList(mappedArray);
  };

  useEffect(() => {
    getMappedArray();
  }, [name]);

  const columnTitles = ['Price', 'Hive', 'HBD ($)'];

  const getOrderList = async (account, offset) => {
    const newList = [...list];
    const splicedList = newList.splice(offset, 5);

    return splicedList;
  };

  if (isEmpty(list)) {
    return null;
  }

  return <ListTable columnTitles={columnTitles} title="Sell orders" getOrderList={getOrderList} />;
};

export default SellOrdersTableHive;
