import React from 'react';
import { Button, Icon } from 'antd';
import './ListTable.less';

const ListTable = () => (
  <div className="ListTable">
    <div className="ListTable__headers-row">
      <div className="ListTable__whole-title">
        <Icon type="bar-chart" className="ListTable__icon iconfont " />
        <h4 className="ListTable__title"> Buy orders</h4>
      </div>
      <Button>
        {' '}
        <i className="ListTable__icon-refresh iconfont icon-refresh"> </i>
      </Button>
    </div>
    <table className="ListTable__table">
      <th className="ListTable__header left_cell">HIVE</th>
      <th className="ListTable__header center_cell">WAIV</th>
      <th className="ListTable__header right_cell">BID</th>
    </table>
    <tbody className="ListTable__rows">
      <tr className="ListTable__row dark-row">
        <td className="ListTable__row-cell left_cell ">1141.111</td>
        <td className="ListTable__row-cell center_cell">222.668</td>
        <td className="ListTable__row-cell right_cell bid_cell">333.888</td>
      </tr>
      <tr className="ListTable__row light-row">
        <td className="ListTable__row-cell left_cell">44</td>
        <td className="ListTable__row-cell center_cell">555</td>
        <td className="ListTable__row-cell right_cell bid_cell">666.333</td>
      </tr>
    </tbody>
    <h4 className="ListTable__title ListTable__show-more">
      {' '}
      <Button>Show more</Button>{' '}
    </h4>
  </div>
);

export default ListTable;
