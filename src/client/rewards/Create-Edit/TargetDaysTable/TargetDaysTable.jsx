import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Checkbox } from 'antd';
import './TargetDaysTable.less';

const TargetDaysTable = ({ intl, setTargetDays, initialValues, disabled }) => (
  <React.Fragment>
    <table className="TargetDaysTable">
      <thead>
        <tr>
          <th>
            <Checkbox
              onChange={setTargetDays('sunday')}
              checked={initialValues.sunday}
              disabled={disabled}
            />
          </th>
          <th>
            <Checkbox
              onChange={setTargetDays('monday')}
              checked={initialValues.monday}
              disabled={disabled}
            />
          </th>
          <th>
            <Checkbox
              onChange={setTargetDays('tuesday')}
              checked={initialValues.tuesday}
              disabled={disabled}
            />
          </th>
          <th>
            <Checkbox
              onChange={setTargetDays('wednesday')}
              checked={initialValues.wednesday}
              disabled={disabled}
            />
          </th>
          <th>
            <Checkbox
              onChange={setTargetDays('thursday')}
              checked={initialValues.thursday}
              disabled={disabled}
            />
          </th>
          <th>
            <Checkbox
              onChange={setTargetDays('friday')}
              checked={initialValues.friday}
              disabled={disabled}
            />
          </th>
          <th>
            <Checkbox
              onChange={setTargetDays('saturday')}
              checked={initialValues.saturday}
              disabled={disabled}
            />
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

TargetDaysTable.defaultProps = {
  disabled: false,
  initialValues: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
};

TargetDaysTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  setTargetDays: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  initialValues: PropTypes.shape({
    monday: PropTypes.bool,
    tuesday: PropTypes.bool,
    wednesday: PropTypes.bool,
    thursday: PropTypes.bool,
    friday: PropTypes.bool,
    saturday: PropTypes.bool,
    sunday: PropTypes.bool,
  }),
};

export default injectIntl(TargetDaysTable);
