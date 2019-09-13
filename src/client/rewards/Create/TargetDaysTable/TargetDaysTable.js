import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Checkbox } from 'antd';
import './TargetDaysTable.less';

const TargetDaysTable = ({ intl, setTargetDays }) => (
  <React.Fragment>
    <table className="TargetDaysTable">
      <thead>
        <tr>
          <th>
            <Checkbox onChange={() => setTargetDays('sunday')} />
          </th>
          <th>
            <Checkbox onChange={() => setTargetDays('monday')} />
          </th>
          <th>
            <Checkbox onChange={() => setTargetDays('tuesday')} />
          </th>
          <th>
            <Checkbox onChange={() => setTargetDays('wednesday')} />
          </th>
          <th>
            <Checkbox onChange={() => setTargetDays('thursday')} />
          </th>
          <th>
            <Checkbox onChange={() => setTargetDays('friday')} />
          </th>
          <th>
            <Checkbox onChange={() => setTargetDays('saturday')} />
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
  </React.Fragment>
);

TargetDaysTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  setTargetDays: PropTypes.func.isRequired,
};

export default injectIntl(TargetDaysTable);
