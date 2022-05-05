import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { isEmpty, round } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './ListTable.less';

const ListTable = ({ getOrderList, title, columnTitles }) => {
  const isSell = title === 'Sell orders';
  const { name } = useParams();
  const [orderList, setOrderList] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const checkLengthAndSetHasMore = list => {
    if (list.length <= 5) {
      return setHasMore(false);
    }

    return setHasMore(true);
  };

  const getOrderListFromApi = async () => {
    const list = await getOrderList(name);

    setOrderList(list);
    checkLengthAndSetHasMore(list);
  };

  const handleShowMore = async () => {
    const list = await getOrderList(name, orderList.length);

    setOrderList([...orderList, ...list]);
    checkLengthAndSetHasMore(list);
  };

  useEffect(() => {
    getOrderListFromApi();
  }, [name]);

  if (isEmpty(orderList)) {
    return null;
  }

  return (
    <div className="ListTable">
      <div className="ListTable__headers-row">
        <div className="ListTable__whole-title">
          <Icon type="bar-chart" className="ListTable__icon iconfont " />
          <h4 className="ListTable__title"> {title}</h4>
        </div>
        <button onClick={getOrderListFromApi}>
          {' '}
          <i className="ListTable__icon-refresh iconfont icon-refresh"> </i>
        </button>
      </div>
      <div className="ListTable__table">
        {columnTitles.map(columnTitle => (
          <div key={columnTitle} className="ListTable__header">
            {columnTitle}
          </div>
        ))}
      </div>
      <div className="ListTable__rows">
        {orderList.map(order => (
          <div className={!isSell ? 'ListTable__row' : 'ListTable__row-reverse'} key={order.textId}>
            <div className="ListTable__row-cell left_cell">
              {round(order.quantity * order.price, 3)}
            </div>
            <div className="ListTable__row-cell center_cell">{round(order.quantity, 3)}</div>
            <div className="ListTable__row-cell right_cell bid_cell">{round(order.price, 3)}</div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="ListTable__title ListTable__show-more">
          {' '}
          <button onClick={handleShowMore}>Show more</button>{' '}
        </div>
      )}
    </div>
  );
};

ListTable.propTypes = {
  getOrderList: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,
  columnTitles: PropTypes.shape().isRequired,
};
export default ListTable;
