import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import './TargetDaysTable.less';

const TargetDaysTable = props => {
  const { intl } = props;
  return (
    <table className="TargetDaysTable">
      <thead>
        <tr>
          <th>
            <Checkbox />
          </th>
          <th>
            <Checkbox />
          </th>
          <th>
            <Checkbox />
          </th>
          <th>
            <Checkbox />
          </th>
          <th>
            <Checkbox />
          </th>
          <th>
            <Checkbox />
          </th>
          <th>
            <Checkbox />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{intl.formatMessage({ id: 'sunday_cut', defaultMessage: `Sun` })}</td>
          <td>{intl.formatMessage({ id: 'monday_cut', defaultMessage: `Mon` })}</td>
          <td>{intl.formatMessage({ id: 'tuesday_cut', defaultMessage: `Tue` })}</td>
          <td>{intl.formatMessage({ id: 'wednesday_cut', defaultMessage: `Wed` })}</td>
          <td>{intl.formatMessage({ id: 'thursday_cut', defaultMessage: `Thu` })}</td>
          <td>{intl.formatMessage({ id: 'friday_cut', defaultMessage: `Fri` })}</td>
          <td>{intl.formatMessage({ id: 'saturday_cut', defaultMessage: `Sat` })}</td>
        </tr>
      </tbody>
    </table>
  );
};

TargetDaysTable.propTypes = {
  intl: PropTypes.shape(),
};

TargetDaysTable.defaultProps = {
  intl: {},
};

export default TargetDaysTable;
